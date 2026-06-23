// ============================================================
// src/modules/types-dechets/types-dechets.controller.js
// ============================================================
const typesDechetService = require('./types-dechets.service');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const getAllTypesDechets = async (req, res, next) => {
    try {
        const types = await typesDechetService.getAllTypesDechets();
        res.json({ success: true, data: { types_dechets: serializeBigInt(types) } });
    } catch (error) { next(error); }
};

const createTypeDechet = async (req, res, next) => {
    try {
        const { nom } = req.body;
        if (!nom) return res.status(400).json({ error: 'Le champ nom est requis' });
        const type = await typesDechetService.createTypeDechet(req.body);
        res.status(201).json({ success: true, data: { type_dechet: serializeBigInt(type) } });
    } catch (error) { next(error); }
};

const updateTypeDechet = async (req, res, next) => {
    try {
        const type = await typesDechetService.updateTypeDechet(req.params.id, req.body);
        res.json({ success: true, data: { type_dechet: serializeBigInt(type) } });
    } catch (error) { next(error); }
};

module.exports = { getAllTypesDechets, createTypeDechet, updateTypeDechet };
