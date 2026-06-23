// ============================================================
// src/modules/auth/auth.service.js
//
// SERVICE Authentification — Logique métier
// ============================================================

const prisma = require('../../lib/prisma');
const { supabaseAdmin } = require('../../lib/supabase');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

// Crée ou met à jour le profil après connexion Supabase
const syncProfile = async (userId, userData) => {
    const { nom, prenom, email, type, localisation_id } = userData;

    const profile = await prisma.profile.upsert({
        where: { id: userId },
        update: {
            nom: nom || undefined,
            prenom: prenom || undefined,
            ...(localisation_id !== undefined && {
                localisation_id: localisation_id ? BigInt(localisation_id) : null,
            }),
            updated_at: new Date(),
        },
        create: {
            id: userId,
            nom: nom || 'Utilisateur',
            prenom: prenom || null,
            email,
            type: type || 'citoyen',
            localisation_id: localisation_id ? BigInt(localisation_id) : null,
        },
        include: {
            localisation: { select: { id: true, nom: true, ville: true } },
        },
    });

    // Créer les paramètres par défaut si absents
    await prisma.userSettings.upsert({
        where: { profile_id: userId },
        update: {},
        create: { profile_id: userId },
    });

    return serializeBigInt(profile);
};

// Inscription publique — rôle citoyen forcé, localisation obligatoire
const registerCitoyen = async ({ email, password, nom, prenom, telephone, localisation_id }) => {
    if (!email || !password || !nom || !localisation_id) {
        const err = new Error('email, password, nom et localisation_id sont obligatoires.');
        err.statusCode = 400;
        throw err;
    }

    const localisation = await prisma.localisation.findFirst({
        where: { id: BigInt(localisation_id), est_active: true },
    });
    if (!localisation) {
        const err = new Error('Localisation invalide ou inactive.');
        err.statusCode = 400;
        throw err;
    }

    if (!supabaseAdmin) {
        const err = new Error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.');
        err.statusCode = 500;
        throw err;
    }

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

    const profile = await prisma.profile.create({
        data: {
            id: userId,
            nom,
            prenom: prenom || null,
            email,
            telephone: telephone || null,
            type: 'citoyen',
            localisation_id: BigInt(localisation_id),
            settings: { create: {} },
        },
        include: {
            localisation: { select: { id: true, nom: true, ville: true } },
        },
    });

    return serializeBigInt(profile);
};

const getProfileById = async (userId) => {
    const profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
            localisation: { select: { id: true, nom: true, ville: true } },
            settings: true,
            fiche_collecteur: { select: { id: true, partenaire_id: true, est_actif: true } },
        },
    });
    return profile ? serializeBigInt(profile) : null;
};

// Changement de mot de passe (utilisateur connecté)
const changePassword = async (userId, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
        const err = new Error('currentPassword et newPassword sont obligatoires.');
        err.statusCode = 400;
        throw err;
    }
    if (newPassword.length < 6) {
        const err = new Error('Le nouveau mot de passe doit contenir au moins 6 caractères.');
        err.statusCode = 400;
        throw err;
    }

    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) {
        const err = new Error('Profil introuvable.');
        err.statusCode = 404;
        throw err;
    }

    if (!supabaseAdmin) {
        const err = new Error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.');
        err.statusCode = 500;
        throw err;
    }

    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword,
    });
    if (signInError) {
        const err = new Error('Mot de passe actuel incorrect.');
        err.statusCode = 401;
        throw err;
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
    });
    if (updateError) {
        const err = new Error(updateError.message);
        err.statusCode = 400;
        throw err;
    }

    return { success: true };
};

module.exports = { syncProfile, registerCitoyen, getProfileById, changePassword };
