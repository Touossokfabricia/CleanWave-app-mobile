// ============================================================
// src/modules/collecteurs/collecteurs.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const collecteursController = require('./collecteurs.controller');

// GET /api/v1/collecteurs/me — Infos du collecteur connecté
router.get('/me', authenticate, requireRole(['collecteur']), collecteursController.getMe);

// GET /api/v1/collecteurs/me/itineraire — Itinéraire du collecteur connecté
router.get('/me/itineraire', authenticate, requireRole(['collecteur']), collecteursController.getItineraire);

// GET /api/v1/collecteurs — Liste les collecteurs du partenaire connecté
router.get('/', authenticate, requireRole(['partenaire', 'admin']), collecteursController.getCollecteurs);

// POST /api/v1/collecteurs — Créer un collecteur (partenaire uniquement)
router.post('/', authenticate, requireRole(['partenaire', 'admin']), collecteursController.createCollecteur);

// PATCH /api/v1/collecteurs/:id/status — Activer/désactiver un collecteur
router.patch('/:id/status', authenticate, requireRole(['partenaire', 'admin']), collecteursController.toggleStatus);

module.exports = router;
