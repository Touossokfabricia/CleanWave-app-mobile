// ============================================================
// src/modules/users/users.service.js
//
// SERVICE Users — Gestion des utilisateurs (admin)
// ============================================================
const prisma = require('../../lib/prisma');
const { supabaseAdmin } = require('../../lib/supabase');

// Récupère tous les utilisateurs avec pagination et filtre par rôle
const getAllUsers = async ({ page = 1, limit = 20, type } = {}) => {
    const skip = (page - 1) * limit;
    const where = type ? { type } : {};

    const [users, total] = await Promise.all([
        prisma.profile.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            select: {
                id: true, nom: true, prenom: true, email: true,
                telephone: true, type: true, avatar_url: true, created_at: true,
                localisation: { select: { id: true, nom: true, ville: true } },
                fiche_collecteur: { select: { id: true, est_actif: true, matricule: true } },
            },
        }),
        prisma.profile.count({ where }),
    ]);

    return { users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

// Récupère un utilisateur par son ID
const getUserById = async (id) => {
    return prisma.profile.findUnique({
        where: { id },
        include: {
            localisation: { select: { id: true, nom: true, ville: true } },
            fiche_collecteur: { select: { id: true, partenaire_id: true, matricule: true, est_actif: true } },
            settings: true,
            _count: {
                select: {
                    signalements_emis: true,
                    plannings_crees: true,
                    chat_messages: true,
                },
            },
        },
    });
};

// Créer un utilisateur (admin uniquement)
// Le type peut être 'admin' ou 'partenaire' (pas 'citoyen' ni 'collecteur' via cette route)
const createUser = async (data) => {
    const { email, password, nom, prenom, telephone, type } = data;

    // Types autorisés via création admin
    const typesAutorises = ['admin', 'partenaire'];
    if (!typesAutorises.includes(type)) {
        const err = new Error(`Type invalide. Valeurs autorisées : ${typesAutorises.join(', ')}`);
        err.statusCode = 400;
        throw err;
    }

    if (!supabaseAdmin) {
        const err = new Error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.');
        err.statusCode = 500;
        throw err;
    }

    // 1. Créer le compte Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,  // Confirme l'email automatiquement
    });

    if (authError) {
        const err = new Error(authError.message);
        err.statusCode = 400;
        throw err;
    }

    const userId = authData.user.id;

    // 2. Créer le profil dans la table profiles
    const profile = await prisma.profile.create({
        data: {
            id: userId,
            nom,
            prenom: prenom || null,
            email,
            telephone: telephone || null,
            type,
        },
    });

    return profile;
};

// Mettre à jour un utilisateur
const updateUser = async (id, data) => {
    const { nom, prenom, telephone, avatar_url, localisation_id } = data;
    return prisma.profile.update({
        where: { id },
        data: {
            ...(nom !== undefined && { nom }),
            ...(prenom !== undefined && { prenom }),
            ...(telephone !== undefined && { telephone }),
            ...(avatar_url !== undefined && { avatar_url }),
            ...(localisation_id !== undefined && { localisation_id: localisation_id ? BigInt(localisation_id) : null }),
            updated_at: new Date(),
        },
    });
};

// Supprimer un utilisateur (supprime aussi le compte Supabase Auth)
const deleteUser = async (id) => {
    // Supprimer le compte Supabase Auth d'abord
    await supabaseAdmin.auth.admin.deleteUser(id);
    // Le profil Prisma sera supprimé en cascade (selon config RLS Supabase)
    return prisma.profile.delete({ where: { id } });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
