// ============================================================
// src/modules/itineraires/itineraires.service.js
// ============================================================
const prisma = require('../../lib/prisma');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const itineraireInclude = {
    collecteur: {
        include: {
            profile: { select: { id: true, nom: true, prenom: true, email: true } },
        },
    },
    planning: { select: { id: true, titre: true, date_collecte: true } },
    arrets: {
        include: {
            localisation: { select: { id: true, nom: true, ville: true, latitude: true, longitude: true } },
            depot: { select: { id: true, nom: true, latitude: true, longitude: true, type_dechets: true } },
        },
        orderBy: { ordre: 'asc' },
    },
};

const getItinerairesByPartenaire = async (partenaireId) => {
    const list = await prisma.itineraire.findMany({
        where: { partenaire_id: partenaireId },
        include: itineraireInclude,
        orderBy: { created_at: 'desc' },
    });
    return list.map(serializeBigInt);
};

const getItinerairesByCollecteur = async (collecteurProfileId) => {
    const fiche = await prisma.collecteur.findUnique({ where: { profile_id: collecteurProfileId } });
    if (!fiche) {
        const err = new Error('Fiche collecteur non trouvée');
        err.statusCode = 404;
        throw err;
    }

    const list = await prisma.itineraire.findMany({
        where: {
            collecteur_id: fiche.id,
            statut: { in: ['envoye', 'en_cours'] },
        },
        include: itineraireInclude,
        orderBy: { date_debut: 'asc' },
    });
    return list.map(serializeBigInt);
};

const createItineraire = async (partenaireId, data) => {
    const { collecteur_id, planning_id, titre, description, date_debut, arrets } = data;

    const collecteur = await prisma.collecteur.findFirst({
        where: { id: BigInt(collecteur_id), partenaire_id: partenaireId },
    });
    if (!collecteur) {
        const err = new Error('Collecteur introuvable ou non rattaché à ce partenaire.');
        err.statusCode = 400;
        throw err;
    }

    if (!titre || !date_debut || !Array.isArray(arrets) || arrets.length === 0) {
        const err = new Error('titre, date_debut et arrets (au moins un) sont requis.');
        err.statusCode = 400;
        throw err;
    }

    for (const arret of arrets) {
        if (arret.localisation_id) {
            const loc = await prisma.localisation.findFirst({
                where: { id: BigInt(arret.localisation_id), est_active: true },
            });
            if (!loc) {
                const err = new Error(`Localisation ${arret.localisation_id} invalide.`);
                err.statusCode = 400;
                throw err;
            }
        }
    }

    const itineraire = await prisma.itineraire.create({
        data: {
            partenaire_id: partenaireId,
            collecteur_id: BigInt(collecteur_id),
            planning_id: planning_id ? BigInt(planning_id) : null,
            titre,
            description: description || null,
            date_debut: new Date(date_debut),
            statut: 'brouillon',
            arrets: {
                create: arrets.map((a, index) => ({
                    localisation_id: a.localisation_id ? BigInt(a.localisation_id) : null,
                    depot_id: a.depot_id ? BigInt(a.depot_id) : null,
                    ordre: a.ordre ?? index,
                    heure_passage: a.heure_passage || null,
                    notes: a.notes || null,
                })),
            },
        },
        include: itineraireInclude,
    });

    return serializeBigInt(itineraire);
};

const envoyerItineraire = async (partenaireId, itineraireId) => {
    const existing = await prisma.itineraire.findFirst({
        where: { id: BigInt(itineraireId), partenaire_id: partenaireId },
    });
    if (!existing) {
        const err = new Error('Itinéraire introuvable.');
        err.statusCode = 404;
        throw err;
    }

    const itineraire = await prisma.itineraire.update({
        where: { id: BigInt(itineraireId) },
        data: { statut: 'envoye', date_envoi: new Date(), updated_at: new Date() },
        include: itineraireInclude,
    });
    return serializeBigInt(itineraire);
};

const validerArret = async (collecteurProfileId, arretId) => {
    const fiche = await prisma.collecteur.findUnique({ where: { profile_id: collecteurProfileId } });
    if (!fiche) {
        const err = new Error('Fiche collecteur non trouvée');
        err.statusCode = 404;
        throw err;
    }

    const arret = await prisma.itineraireStop.findUnique({
        where: { id: BigInt(arretId) },
        include: { itineraire: true },
    });
    if (!arret || arret.itineraire.collecteur_id !== fiche.id) {
        const err = new Error('Arrêt introuvable ou non autorisé.');
        err.statusCode = 403;
        throw err;
    }

    const updated = await prisma.itineraireStop.update({
        where: { id: BigInt(arretId) },
        data: { est_valide: true, date_validation: new Date() },
        include: {
            localisation: { select: { id: true, nom: true } },
            depot: { select: { id: true, nom: true } },
        },
    });

    return serializeBigInt(updated);
};

module.exports = {
    getItinerairesByPartenaire,
    getItinerairesByCollecteur,
    createItineraire,
    envoyerItineraire,
    validerArret,
};
