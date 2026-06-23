// ============================================================
// src/modules/plannings/plannings.service.js
// ============================================================
const prisma = require('../../lib/prisma');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const planningInclude = {
    partenaire: { select: { id: true, nom: true, email: true } },
    etapes: {
        include: {
            localisation: { select: { id: true, nom: true, ville: true, latitude: true, longitude: true } },
        },
        orderBy: { ordre: 'asc' },
    },
};

const getPlannings = async ({
    userId, userRole, statut, localisationId, page = 1, limit = 20, dateDebut, dateFin,
} = {}) => {
    const skip = (page - 1) * limit;
    const where = {};

    if (statut) where.statut = statut;
    if (userRole === 'partenaire') where.partenaire_id = userId;
    if (dateDebut || dateFin) {
        where.date_collecte = {};
        if (dateDebut) where.date_collecte.gte = new Date(dateDebut);
        if (dateFin) where.date_collecte.lte = new Date(dateFin);
    }
    if (localisationId) {
        where.etapes = { some: { localisation_id: BigInt(localisationId) } };
    }

    let orderBy = { date_collecte: 'asc' };

    // Citoyen : prioriser les plannings de son quartier
    if (userRole === 'citoyen') {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: { localisation_id: true },
        });
        if (profile?.localisation_id) {
            const all = await prisma.planning.findMany({
                where,
                include: planningInclude,
                orderBy: { date_collecte: 'asc' },
            });
            const locId = profile.localisation_id.toString();
            const sorted = all.sort((a, b) => {
                const aMatch = a.etapes.some((e) => e.localisation_id.toString() === locId);
                const bMatch = b.etapes.some((e) => e.localisation_id.toString() === locId);
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return new Date(a.date_collecte) - new Date(b.date_collecte);
            });
            const paginated = sorted.slice(skip, skip + limit);
            return {
                plannings: paginated.map(serializeBigInt),
                pagination: { total: all.length, page, limit, totalPages: Math.ceil(all.length / limit) },
                quartier_prioritaire: locId,
            };
        }
    }

    const [plannings, total] = await Promise.all([
        prisma.planning.findMany({
            where, skip, take: limit, orderBy, include: planningInclude,
        }),
        prisma.planning.count({ where }),
    ]);

    return {
        plannings: plannings.map(serializeBigInt),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

const getPlanningById = async (id) => {
    const planning = await prisma.planning.findUnique({
        where: { id: BigInt(id) },
        include: planningInclude,
    });
    return planning ? serializeBigInt(planning) : null;
};

const createPlanning = async (partenaireId, data) => {
    const { titre, description, date_collecte, camion_assigne, notes, etapes } = data;

    if (!titre || !date_collecte || !Array.isArray(etapes) || etapes.length === 0) {
        const err = new Error('titre, date_collecte et etapes (au moins une) sont requis.');
        err.statusCode = 400;
        throw err;
    }

    for (const etape of etapes) {
        const loc = await prisma.localisation.findFirst({
            where: { id: BigInt(etape.localisation_id), est_active: true },
        });
        if (!loc) {
            const err = new Error(`Localisation ${etape.localisation_id} invalide ou inactive.`);
            err.statusCode = 400;
            throw err;
        }
    }

    const planning = await prisma.planning.create({
        data: {
            partenaire_id: partenaireId,
            titre,
            description: description || null,
            date_collecte: new Date(date_collecte),
            camion_assigne: camion_assigne || null,
            notes: notes || null,
            statut: 'planifie',
            etapes: {
                create: etapes.map((e, index) => ({
                    localisation_id: BigInt(e.localisation_id),
                    heure_debut: e.heure_debut,
                    heure_fin: e.heure_fin || e.heure_debut,
                    ordre: e.ordre ?? index,
                    notes: e.notes || null,
                })),
            },
        },
        include: planningInclude,
    });

    return serializeBigInt(planning);
};

const updatePlanning = async (id, data) => {
    const updateData = { updated_at: new Date() };
    if (data.statut) updateData.statut = data.statut;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.camion_assigne !== undefined) updateData.camion_assigne = data.camion_assigne;
    if (data.titre) updateData.titre = data.titre;
    if (data.description !== undefined) updateData.description = data.description;

    const planning = await prisma.planning.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: planningInclude,
    });
    return serializeBigInt(planning);
};

const deletePlanning = async (id) => {
    return prisma.planning.delete({ where: { id: BigInt(id) } });
};

module.exports = { getPlannings, getPlanningById, createPlanning, updatePlanning, deletePlanning };
