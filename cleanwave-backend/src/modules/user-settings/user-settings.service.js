// ============================================================
// src/modules/user-settings/user-settings.service.js
//
// SERVICE Paramètres utilisateur
// Chaque utilisateur a UN seul enregistrement UserSettings.
// Si l'enregistrement n'existe pas, on le crée avec les valeurs par défaut.
// ============================================================
const prisma = require('../../lib/prisma');

// Récupère les paramètres (crée si inexistants)
const getSettings = async (profileId) => {
    return prisma.userSettings.upsert({
        where: { profile_id: profileId },
        update: {},   // Rien à mettre à jour si on fait juste un GET
        create: {
            profile_id: profileId,
            dark_mode: false,
            notifications_push: true,
            notifications_email: false,
            langue: 'fr',
        },
    });
};

// Met à jour les paramètres
const updateSettings = async (profileId, data) => {
    const { dark_mode, notifications_push, notifications_email, langue } = data;
    return prisma.userSettings.upsert({
        where: { profile_id: profileId },
        update: {
            ...(dark_mode !== undefined && { dark_mode }),
            ...(notifications_push !== undefined && { notifications_push }),
            ...(notifications_email !== undefined && { notifications_email }),
            ...(langue !== undefined && { langue }),
            updated_at: new Date(),
        },
        create: {
            profile_id: profileId,
            dark_mode: dark_mode ?? false,
            notifications_push: notifications_push ?? true,
            notifications_email: notifications_email ?? false,
            langue: langue ?? 'fr',
        },
    });
};

// Met à jour le profil utilisateur (nom, prénom, téléphone)
const updateProfile = async (profileId, data) => {
    const { nom, prenom, telephone, avatar_url } = data;
    return prisma.profile.update({
        where: { id: profileId },
        data: {
            ...(nom !== undefined && { nom }),
            ...(prenom !== undefined && { prenom }),
            ...(telephone !== undefined && { telephone }),
            ...(avatar_url !== undefined && { avatar_url }),
            updated_at: new Date(),
        },
    });
};

module.exports = { getSettings, updateSettings, updateProfile };
