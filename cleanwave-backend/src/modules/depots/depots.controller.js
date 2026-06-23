// ============================================================
// src/modules/depots/depots.controller.js
// ============================================================
const depotsService = require('./depots.service');

const getDepots = async (req, res, next) => {
    try {
        const { quartier, type_dechets, page, limit, tous } = req.query;
        const result = await depotsService.getDepots({
            actifSeulement: tous !== 'true',
            quartier, type_dechets,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
        });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const getDepotsProches = async (req, res, next) => {
    try {
        const { lat, lng, rayon } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat et lng sont requis' });
        }
        const depots = await depotsService.getDepotsProches(
            parseFloat(lat), parseFloat(lng), parseFloat(rayon) || 5
        );
        res.json({ success: true, data: { depots, count: depots.length } });
    } catch (error) { next(error); }
};

const getDepotById = async (req, res, next) => {
    try {
        const depot = await depotsService.getDepotById(req.params.id);
        if (!depot) return res.status(404).json({ error: 'Dépôt non trouvé' });
        res.json({ success: true, data: { depot } });
    } catch (error) { next(error); }
};

const createDepot = async (req, res, next) => {
    try {
        const { latitude, longitude, quartier, nom, type_dechets } = req.body;
        if (!latitude || !longitude || !quartier || !nom || !type_dechets) {
            return res.status(400).json({ error: 'Champs manquants', message: 'latitude, longitude, quartier, nom et type_dechets sont requis.' });
        }
        const depot = await depotsService.createDepot(req.body);
        res.status(201).json({ success: true, message: 'Dépôt créé', data: { depot } });
    } catch (error) { next(error); }
};

const updateDepot = async (req, res, next) => {
    try {
        const depot = await depotsService.updateDepot(req.params.id, req.body);
        res.json({ success: true, message: 'Dépôt mis à jour', data: { depot } });
    } catch (error) { next(error); }
};

const deleteDepot = async (req, res, next) => {
    try {
        await depotsService.deleteDepot(req.params.id);
        res.json({ success: true, message: 'Dépôt supprimé' });
    } catch (error) { next(error); }
};

module.exports = { getDepots, getDepotsProches, getDepotById, createDepot, updateDepot, deleteDepot };
