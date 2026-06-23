// ============================================================
// src/modules/signalements/signalements.service.js
// ============================================================
const prisma = require('../../lib/prisma');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const signalementInclude = {
    citoyen: {
        select: {
            id: true, nom: true, prenom: true,
            localisation: { select: { id: true, nom: true, ville: true } },
        },
    },
    collecteur: { select: { id: true, nom: true, prenom: true } },
    depot: {
        select: {
            id: true, nom: true, latitude: true, longitude: true,
            localisation: { select: { id: true, nom: true, ville: true } },
        },
    },
    quartier: { select: { id: true, nom: true, ville: true } },
    types_dechets: {
        include: { type_dechet: { select: { id: true, nom: true, icone: true, couleur: true } } },
    },
};

const getSignalements = async ({ userId, userRole, page = 1, limit = 20, etat } = {}) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (etat) where.etat = etat;

    if (userRole === 'citoyen') {
        where.user_id = userId;
    } else if (userRole === 'collecteur') {
        where.OR = [
            { collecteur_id: userId },
            { etat: 'en_attente', collecteur_id: null },
        ];
    }

    const [signalements, total] = await Promise.all([
        prisma.signalement.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date_signalement: 'desc' },
            include: signalementInclude,
        }),
        prisma.signalement.count({ where }),
    ]);

    return {
        signalements: signalements.map(serializeBigInt),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

const getSignalementById = async (id) => {
    const signalement = await prisma.signalement.findUnique({
        where: { id: BigInt(id) },
        include: signalementInclude,
    });
    return signalement ? serializeBigInt(signalement) : null;
};

const createSignalement = async (userId, data) => {
    const {
        localisation, latitude, longitude, description,
        photo_url, depot_id, localisation_id, types_dechets_ids,
        use_profile_localisation,
    } = data;

    let resolvedLocalisationId = localisation_id ? BigInt(localisation_id) : null;

    if (use_profile_localisation) {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: { localisation_id: true },
        });
        resolvedLocalisationId = profile?.localisation_id || null;
    }

    if (!localisation || latitude === undefined || longitude === undefined || !description) {
        const err = new Error('localisation, latitude, longitude et description sont requis.');
        err.statusCode = 400;
        throw err;
    }

    const typeIds = Array.isArray(types_dechets_ids) ? types_dechets_ids : [];
    if (typeIds.length === 0) {
        const err = new Error('Sélectionnez au moins un type de déchet (types_dechets_ids).');
        err.statusCode = 400;
        throw err;
    }

    const signalement = await prisma.signalement.create({
        data: {
            user_id: userId,
            localisation,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
            photo_url: photo_url || null,
            depot_id: depot_id ? BigInt(depot_id) : null,
            localisation_id: resolvedLocalisationId,
            etat: 'en_attente',
            types_dechets: {
                create: typeIds.map((typeId) => ({
                    type_dechet_id: BigInt(typeId),
                })),
            },
        },
        include: signalementInclude,
    });

    return serializeBigInt(signalement);
};

const updateSignalement = async (id, data) => {
    const { description, etat, photo_url } = data;

    const updateData = { updated_at: new Date() };
    if (description !== undefined) updateData.description = description;
    if (etat !== undefined) updateData.etat = etat;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (etat === 'pris_en_charge') updateData.date_prise_en_charge = new Date();
    if (etat === 'resolu') updateData.date_resolution = new Date();

    const signalement = await prisma.signalement.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: signalementInclude,
    });

    return serializeBigInt(signalement);
};

const assignerCollecteur = async (signalementId, collecteurId) => {
    const signalement = await prisma.signalement.update({
        where: { id: BigInt(signalementId) },
        data: {
            collecteur_id: collecteurId,
            etat: 'pris_en_charge',
            date_prise_en_charge: new Date(),
            updated_at: new Date(),
        },
        include: signalementInclude,
    });
    return serializeBigInt(signalement);
};

const getStats = async () => {
    const [total, en_attente, pris_en_charge, resolu] = await Promise.all([
        prisma.signalement.count(),
        prisma.signalement.count({ where: { etat: 'en_attente' } }),
        prisma.signalement.count({ where: { etat: 'pris_en_charge' } }),
        prisma.signalement.count({ where: { etat: 'resolu' } }),
    ]);
    return { total, en_attente, pris_en_charge, resolu };
};

const deleteSignalement = async (id) => {
    return prisma.signalement.delete({ where: { id: BigInt(id) } });
};

module.exports = {
    getSignalements, getSignalementById, createSignalement,
    updateSignalement, assignerCollecteur, getStats, deleteSignalement,
};
