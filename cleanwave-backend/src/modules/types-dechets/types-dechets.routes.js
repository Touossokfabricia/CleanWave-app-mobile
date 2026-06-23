// ============================================================
// src/modules/types-dechets/types-dechets.routes.js
// Lecture publique, écriture admin uniquement
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const typesDechetController = require('./types-dechets.controller');

// GET /api/v1/types-dechets — Liste tous les types (public)
router.get('/', typesDechetController.getAllTypesDechets);

// POST /api/v1/types-dechets — Créer un type (admin)
router.post('/', authenticate, requireRole(['admin']), typesDechetController.createTypeDechet);

// PATCH /api/v1/types-dechets/:id — Modifier un type (admin)
router.patch('/:id', authenticate, requireRole(['admin']), typesDechetController.updateTypeDechet);

module.exports = router;
