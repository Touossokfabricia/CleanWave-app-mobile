// ============================================================
// src/modules/plannings/plannings.controller.js
// ============================================================
const planningsService = require('./plannings.service');

const getPlannings = async (req, res, next) => {
    try {
        const { statut, localisation_id, page, limit, dateDebut, dateFin } = req.query;
        const result = await planningsService.getPlannings({
            userId: req.userId,
            userRole: req.userRole,
            statut,
            localisationId: localisation_id,
            dateDebut,
            dateFin,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const getPlanningById = async (req, res, next) => {
    try {
        const planning = await planningsService.getPlanningById(req.params.id);
        if (!planning) return res.status(404).json({ error: 'Planning non trouvé' });
        res.json({ success: true, data: { planning } });
    } catch (error) { next(error); }
};

const createPlanning = async (req, res, next) => {
    try {
        const partenaireId = req.userRole === 'admin' && req.body.partenaire_id
            ? req.body.partenaire_id
            : req.userId;
        const planning = await planningsService.createPlanning(partenaireId, req.body);
        res.status(201).json({ success: true, message: 'Planning créé', data: { planning } });
    } catch (error) { next(error); }
};

const updatePlanning = async (req, res, next) => {
    try {
        const planning = await planningsService.updatePlanning(req.params.id, req.body);
        res.json({ success: true, message: 'Planning mis à jour', data: { planning } });
    } catch (error) { next(error); }
};

const deletePlanning = async (req, res, next) => {
    try {
        await planningsService.deletePlanning(req.params.id);
        res.json({ success: true, message: 'Planning supprimé' });
    } catch (error) { next(error); }
};

module.exports = { getPlannings, getPlanningById, createPlanning, updatePlanning, deletePlanning };
