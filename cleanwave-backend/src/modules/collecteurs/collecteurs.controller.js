// ============================================================
// src/modules/collecteurs/collecteurs.controller.js
// ============================================================
const collecteursService = require('./collecteurs.service');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

// GET /api/v1/collecteurs — Liste les collecteurs du partenaire connecté
const getCollecteurs = async (req, res, next) => {
    try {
        const collecteurs = await collecteursService.getCollecteursByPartenaire(req.userId);
        res.json({ success: true, data: { collecteurs: serializeBigInt(collecteurs) } });
    } catch (error) { next(error); }
};

// GET /api/v1/collecteurs/me — Fiche du collecteur connecté
const getMe = async (req, res, next) => {
    try {
        const fiche = await collecteursService.getCollecteurByProfileId(req.userId);
        if (!fiche) return res.status(404).json({ error: 'Fiche collecteur introuvable' });
        res.json({ success: true, data: { collecteur: serializeBigInt(fiche) } });
    } catch (error) { next(error); }
};

// GET /api/v1/collecteurs/me/itineraire — Itinéraire du collecteur connecté
const getItineraire = async (req, res, next) => {
    try {
        const result = await collecteursService.getItineraire(req.userId);
        res.json({ success: true, data: serializeBigInt(result) });
    } catch (error) { next(error); }
};

// POST /api/v1/collecteurs — Créer un collecteur (partenaire uniquement)
const createCollecteur = async (req, res, next) => {
    try {
        const { email, password, nom } = req.body;
        if (!email || !password || !nom) {
            return res.status(400).json({ error: 'Les champs email, password et nom sont requis' });
        }
        const collecteur = await collecteursService.createCollecteur(req.userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Collecteur créé avec succès',
            data: { collecteur: serializeBigInt(collecteur) },
        });
    } catch (error) { next(error); }
};

// PATCH /api/v1/collecteurs/:id/status — Activer/désactiver
const toggleStatus = async (req, res, next) => {
    try {
        const { est_actif } = req.body;
        const collecteur = await collecteursService.toggleCollecteurStatus(req.params.id, est_actif);
        res.json({ success: true, data: { collecteur: serializeBigInt(collecteur) } });
    } catch (error) { next(error); }
};

module.exports = { getCollecteurs, getMe, getItineraire, createCollecteur, toggleStatus };
