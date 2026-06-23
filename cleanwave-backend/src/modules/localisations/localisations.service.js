// ============================================================
// src/modules/localisations/localisations.service.js
//
// SERVICE Localisations — Gestion des quartiers disponibles
// ============================================================
const prisma = require('../../lib/prisma');

// Récupère toutes les localisations actives
const getAllLocalisations = async () => {
    return prisma.localisation.findMany({
        where: { est_active: true },
        orderBy: { nom: 'asc' },
        select: {
            id: true,
            nom: true,
            ville: true,
            description: true,
            latitude: true,
            longitude: true,
        },
    });
};

// Récupère une localisation par son ID
const getLocalisationById = async (id) => {
    return prisma.localisation.findUnique({
        where: { id: BigInt(id) },
        include: { _count: { select: { profiles: true, depots: true } } },
    });
};

// Crée un nouveau quartier (admin uniquement)
const createLocalisation = async (data) => {
    const { nom, ville, description, latitude, longitude } = data;
    return prisma.localisation.create({
        data: {
            nom,
            ville,
            description: description || null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
        },
    });
};

// Met à jour un quartier (admin uniquement)
const updateLocalisation = async (id, data) => {
    const { nom, ville, description, latitude, longitude, est_active } = data;
    return prisma.localisation.update({
        where: { id: BigInt(id) },
        data: {
            ...(nom !== undefined && { nom }),
            ...(ville !== undefined && { ville }),
            ...(description !== undefined && { description }),
            ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
            ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
            ...(est_active !== undefined && { est_active }),
            updated_at: new Date(),
        },
    });
};

// Supprime un quartier (admin uniquement)
const deleteLocalisation = async (id) => {
    return prisma.localisation.delete({ where: { id: BigInt(id) } });
};

module.exports = {
    getAllLocalisations, getLocalisationById,
    createLocalisation, updateLocalisation, deleteLocalisation,
};
