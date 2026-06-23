// ============================================================
// src/modules/types-dechets/types-dechets.service.js
// ============================================================
const prisma = require('../../lib/prisma');

const getAllTypesDechets = async () => {
    return prisma.typeDechet.findMany({
        where: { est_actif: true },
        orderBy: { nom: 'asc' },
    });
};

const createTypeDechet = async (data) => {
    const { nom, description, icone, couleur } = data;
    return prisma.typeDechet.create({
        data: { nom, description: description || null, icone: icone || null, couleur: couleur || null },
    });
};

const updateTypeDechet = async (id, data) => {
    return prisma.typeDechet.update({
        where: { id: BigInt(id) },
        data: { ...data, updated_at: new Date() },
    });
};

module.exports = { getAllTypesDechets, createTypeDechet, updateTypeDechet };
