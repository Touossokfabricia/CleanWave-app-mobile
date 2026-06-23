// ============================================================
// src/modules/itineraires/itineraires.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const itinerairesController = require('./itineraires.controller');

router.get('/', authenticate, requireRole(['partenaire', 'admin', 'collecteur']), itinerairesController.getItineraires);
router.post('/', authenticate, requireRole(['partenaire', 'admin']), itinerairesController.createItineraire);
router.patch('/:id/envoyer', authenticate, requireRole(['partenaire', 'admin']), itinerairesController.envoyerItineraire);
router.patch('/arrets/:arretId/valider', authenticate, requireRole(['collecteur']), itinerairesController.validerArret);

module.exports = router;
