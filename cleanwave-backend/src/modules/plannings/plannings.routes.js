// ============================================================
// src/modules/plannings/plannings.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole, optionalAuth } = require('../../middleware/auth.middleware');
const planningsController = require('./plannings.controller');

// GET /api/v1/plannings — Liste des plannings (accessible à tous les connectés)
router.get('/', authenticate, planningsController.getPlannings);

// GET /api/v1/plannings/:id — Détails d'un planning
router.get('/:id', authenticate, planningsController.getPlanningById);

// POST /api/v1/plannings — Créer un planning (partenaire ou admin)
router.post('/', authenticate, requireRole(['partenaire', 'admin']), planningsController.createPlanning);

// PATCH /api/v1/plannings/:id — Modifier un planning
router.patch('/:id', authenticate, requireRole(['partenaire', 'admin']), planningsController.updatePlanning);

// DELETE /api/v1/plannings/:id — Supprimer (admin)
router.delete('/:id', authenticate, requireRole(['admin']), planningsController.deletePlanning);

module.exports = router;
