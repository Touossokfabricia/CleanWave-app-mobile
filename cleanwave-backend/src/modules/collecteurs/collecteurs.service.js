// ============================================================
// src/modules/collecteurs/collecteurs.service.js
//
// SERVICE Collecteurs — Gestion des agents de collecte terrain
//
// RÈGLES MÉTIER :
// - Un collecteur est créé par un partenaire
// - Il est automatiquement lié à ce partenaire
// - Un collecteur ne peut voir QUE son propre itinéraire
// ============================================================
const prisma = require('../../lib/prisma');
const { supabaseAdmin } = require('../../lib/supabase');

// Récupère tous les collecteurs d'un partenaire
const getCollecteursByPartenaire = async (partenaireId) => {
    return prisma.collecteur.findMany({
        where: { partenaire_id: partenaireId },
        include: {
            profile: {
                select: { id: true, nom: true, prenom: true, email: true, telephone: true, avatar_url: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
};

// Récupère la fiche collecteur d'un profil
const getCollecteurByProfileId = async (profileId) => {
    return prisma.collecteur.findUnique({
        where: { profile_id: profileId },
        include: {
            profile: { select: { id: true, nom: true, prenom: true, email: true } },
            partenaire: { select: { id: true, nom: true, prenom: true, email: true } },
        },
    });
};

// Crée un collecteur
// Le partenaire crée le compte Supabase + le profil + la fiche collecteur
const createCollecteur = async (partenaireId, data) => {
    const { email, password, nom, prenom, telephone, matricule } = data;

    if (!supabaseAdmin) {
        const err = new Error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.');
        err.statusCode = 500;
        throw err;
    }

    // 1. Créer le compte Supabase Auth (via Admin API)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        const err = new Error(authError.message);
        err.statusCode = 400;
        throw err;
    }

    const userId = authData.user.id;

    // 2. Créer le profil avec le rôle collecteur
    const profile = await prisma.profile.create({
        data: {
            id: userId,
            nom,
            prenom: prenom || null,
            email,
            telephone: telephone || null,
            type: 'collecteur',
        },
    });

    // 3. Créer la fiche collecteur liée au partenaire
    const collecteur = await prisma.collecteur.create({
        data: {
            profile_id: userId,
            partenaire_id: partenaireId,
            matricule: matricule || null,
        },
        include: {
            profile: { select: { id: true, nom: true, prenom: true, email: true } },
        },
    });

    return collecteur;
};

// Récupère l'itinéraire du collecteur connecté (itinéraires envoyés + plannings)
const getItineraire = async (collecteurProfileId) => {
    const itinerairesService = require('../itineraires/itineraires.service');
    const itineraires = await itinerairesService.getItinerairesByCollecteur(collecteurProfileId);

    const ficheCollecteur = await prisma.collecteur.findUnique({
        where: { profile_id: collecteurProfileId },
    });

    if (!ficheCollecteur) {
        const err = new Error('Fiche collecteur non trouvée');
        err.statusCode = 404;
        throw err;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plannings = await prisma.planning.findMany({
        where: {
            partenaire_id: ficheCollecteur.partenaire_id,
            date_collecte: { gte: today },
            statut: { in: ['planifie', 'en_cours'] },
        },
        include: {
            etapes: {
                include: {
                    localisation: { select: { id: true, nom: true, ville: true, latitude: true, longitude: true } },
                },
                orderBy: { ordre: 'asc' },
            },
            partenaire: { select: { nom: true, prenom: true, telephone: true } },
        },
        orderBy: { date_collecte: 'asc' },
    });

    const serializeBigInt = (obj) => JSON.parse(
        JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
    );

    return {
        itineraires,
        plannings: plannings.map(serializeBigInt),
    };
};

// Activer/désactiver un collecteur
const toggleCollecteurStatus = async (collecteurId, estActif) => {
    return prisma.collecteur.update({
        where: { id: BigInt(collecteurId) },
        data: { est_actif: estActif, updated_at: new Date() },
    });
};

module.exports = {
    getCollecteursByPartenaire, getCollecteurByProfileId,
    createCollecteur, getItineraire, toggleCollecteurStatus,
};
