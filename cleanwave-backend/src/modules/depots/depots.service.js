// ============================================================
// src/modules/depots/depots.service.js
// ============================================================
const prisma = require('../../lib/prisma');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const depotInclude = {
    localisation: { select: { id: true, nom: true, ville: true } },
};

const getDepots = async ({ actifSeulement = true, localisation_id, type_dechets, page = 1, limit = 50 } = {}) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (actifSeulement) where.est_actif = true;
    if (localisation_id) where.localisation_id = BigInt(localisation_id);
    if (type_dechets) where.type_dechets = { contains: type_dechets, mode: 'insensitive' };

    const [depots, total] = await Promise.all([
        prisma.depot.findMany({
            where, skip, take: limit,
            orderBy: { nom: 'asc' },
            include: depotInclude,
        }),
        prisma.depot.count({ where }),
    ]);

    return { depots: depots.map(serializeBigInt), pagination: { total, page, limit } };
};

const getDepotById = async (id) => {
    const depot = await prisma.depot.findUnique({
        where: { id: BigInt(id) },
        include: depotInclude,
    });
    return depot ? serializeBigInt(depot) : null;
};

const getDepotsProches = async (lat, lng, rayonKm = 5) => {
    const depots = await prisma.depot.findMany({
        where: { est_actif: true },
        include: depotInclude,
    });

    const R = 6371;
    const depotsAvecDistance = depots
        .map((depot) => {
            const dLat = (parseFloat(depot.latitude) - lat) * Math.PI / 180;
            const dLng = (parseFloat(depot.longitude) - lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat * Math.PI / 180) *
                Math.cos(parseFloat(depot.latitude) * Math.PI / 180) *
                Math.sin(dLng / 2) ** 2;
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return { ...serializeBigInt(depot), distance_km: Math.round(distance * 10) / 10 };
        })
        .filter((d) => d.distance_km <= rayonKm)
        .sort((a, b) => a.distance_km - b.distance_km);

    return depotsAvecDistance;
};

const createDepot = async (data) => {
    const { latitude, longitude, localisation_id, nom, type_dechets, description } = data;

    if (!latitude || !longitude || !localisation_id || !nom) {
        const err = new Error('latitude, longitude, localisation_id et nom sont requis.');
        err.statusCode = 400;
        throw err;
    }

    const loc = await prisma.localisation.findFirst({
        where: { id: BigInt(localisation_id), est_active: true },
    });
    if (!loc) {
        const err = new Error('Localisation invalide ou inactive.');
        err.statusCode = 400;
        throw err;
    }

    const depot = await prisma.depot.create({
        data: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            localisation_id: BigInt(localisation_id),
            nom,
            type_dechets: type_dechets || 'Mixte',
            description: description || null,
            est_actif: true,
        },
        include: depotInclude,
    });
    return serializeBigInt(depot);
};

const updateDepot = async (id, data) => {
    const updateData = { updated_at: new Date() };
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type_dechets !== undefined) updateData.type_dechets = data.type_dechets;
    if (data.est_actif !== undefined) updateData.est_actif = data.est_actif;
    if (data.latitude !== undefined) updateData.latitude = parseFloat(data.latitude);
    if (data.longitude !== undefined) updateData.longitude = parseFloat(data.longitude);
    if (data.localisation_id !== undefined) updateData.localisation_id = BigInt(data.localisation_id);

    const depot = await prisma.depot.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: depotInclude,
    });
    return serializeBigInt(depot);
};

const deleteDepot = async (id) => {
    return prisma.depot.delete({ where: { id: BigInt(id) } });
};

module.exports = { getDepots, getDepotById, getDepotsProches, createDepot, updateDepot, deleteDepot };
