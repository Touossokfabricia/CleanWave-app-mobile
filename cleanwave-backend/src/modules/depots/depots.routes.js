// ============================================================
// src/modules/depots/depots.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole, optionalAuth } = require('../../middleware/auth.middleware');
const depotsController = require('./depots.controller');

// GET /api/v1/depots — Liste des dépôts actifs (public avec auth optionnelle)
router.get('/', optionalAuth, depotsController.getDepots);

// GET /api/v1/depots/proches — Dépôts proches d'une coordonnée
router.get('/proches', optionalAuth, depotsController.getDepotsProches);

// GET /api/v1/depots/:id — Détails d'un dépôt
router.get('/:id', optionalAuth, depotsController.getDepotById);

// POST /api/v1/depots — Créer un dépôt (admin uniquement)
router.post('/', authenticate, requireRole(['admin']), depotsController.createDepot);

// PATCH /api/v1/depots/:id — Modifier un dépôt (admin uniquement)
router.patch('/:id', authenticate, requireRole(['admin']), depotsController.updateDepot);

// DELETE /api/v1/depots/:id — Supprimer (admin)
router.delete('/:id', authenticate, requireRole(['admin']), depotsController.deleteDepot);

module.exports = router;
