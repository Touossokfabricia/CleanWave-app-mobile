// ============================================================
// src/modules/signalements/signalements.controller.js
// ============================================================
const signalementsService = require('./signalements.service');

const getSignalements = async (req, res, next) => {
    try {
        const { page, limit, etat } = req.query;
        const result = await signalementsService.getSignalements({
            userId: req.userId,
            userRole: req.userRole,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            etat,
        });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const getSignalementById = async (req, res, next) => {
    try {
        const signalement = await signalementsService.getSignalementById(req.params.id);
        if (!signalement) return res.status(404).json({ error: 'Signalement non trouvé' });
        if (req.userRole === 'citoyen' && signalement.user_id !== req.userId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        res.json({ success: true, data: { signalement } });
    } catch (error) { next(error); }
};

const createSignalement = async (req, res, next) => {
    try {
        const signalement = await signalementsService.createSignalement(req.userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Signalement créé avec succès !',
            data: { signalement },
        });
    } catch (error) { next(error); }
};

const updateSignalement = async (req, res, next) => {
    try {
        const existing = await signalementsService.getSignalementById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Signalement non trouvé' });
        if (req.userRole === 'citoyen' && existing.user_id !== req.userId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const signalement = await signalementsService.updateSignalement(req.params.id, req.body);
        res.json({ success: true, message: 'Signalement mis à jour', data: { signalement } });
    } catch (error) { next(error); }
};

const assignerCollecteur = async (req, res, next) => {
    try {
        const collecteurId = req.body.collecteur_id || req.userId;
        const signalement = await signalementsService.assignerCollecteur(req.params.id, collecteurId);
        res.json({ success: true, message: 'Signalement assigné', data: { signalement } });
    } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await signalementsService.getStats();
        res.json({ success: true, data: { stats } });
    } catch (error) { next(error); }
};

const deleteSignalement = async (req, res, next) => {
    try {
        await signalementsService.deleteSignalement(req.params.id);
        res.json({ success: true, message: 'Signalement supprimé' });
    } catch (error) { next(error); }
};

module.exports = {
    getSignalements, getSignalementById, createSignalement,
    updateSignalement, assignerCollecteur, getStats, deleteSignalement,
};
