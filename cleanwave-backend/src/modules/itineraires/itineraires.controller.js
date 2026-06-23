// ============================================================
// src/modules/itineraires/itineraires.controller.js
// ============================================================
const itinerairesService = require('./itineraires.service');

const getItineraires = async (req, res, next) => {
    try {
        if (req.userRole === 'collecteur') {
            const itineraires = await itinerairesService.getItinerairesByCollecteur(req.userId);
            return res.json({ success: true, data: { itineraires } });
        }
        const itineraires = await itinerairesService.getItinerairesByPartenaire(req.userId);
        res.json({ success: true, data: { itineraires } });
    } catch (error) { next(error); }
};

const createItineraire = async (req, res, next) => {
    try {
        const partenaireId = req.userRole === 'admin' && req.body.partenaire_id
            ? req.body.partenaire_id
            : req.userId;
        const itineraire = await itinerairesService.createItineraire(partenaireId, req.body);
        res.status(201).json({ success: true, message: 'Itinéraire créé', data: { itineraire } });
    } catch (error) { next(error); }
};

const envoyerItineraire = async (req, res, next) => {
    try {
        const itineraire = await itinerairesService.envoyerItineraire(req.userId, req.params.id);
        res.json({ success: true, message: 'Itinéraire envoyé au collecteur', data: { itineraire } });
    } catch (error) { next(error); }
};

const validerArret = async (req, res, next) => {
    try {
        const arret = await itinerairesService.validerArret(req.userId, req.params.arretId);
        res.json({ success: true, message: 'Dépôt / arrêt validé', data: { arret } });
    } catch (error) { next(error); }
};

module.exports = { getItineraires, createItineraire, envoyerItineraire, validerArret };
