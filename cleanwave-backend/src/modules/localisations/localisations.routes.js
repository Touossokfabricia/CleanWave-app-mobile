// ============================================================
// src/modules/localisations/localisations.routes.js
//
// Routes de gestion des quartiers (localisations)
// Lecture : publique (toute personne peut voir les quartiers disponibles)
// Écriture : admin uniquement
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const localisationsController = require('./localisations.controller');

// GET /api/v1/localisations
// Liste tous les quartiers disponibles — public (utilisé pour l'inscription)
router.get('/', localisationsController.getAllLocalisations);

// GET /api/v1/localisations/:id
// Détails d'un quartier
router.get('/:id', localisationsController.getLocalisationById);

// POST /api/v1/localisations
// Créer un nouveau quartier — admin uniquement
router.post('/', authenticate, requireRole(['admin']), localisationsController.createLocalisation);

// PATCH /api/v1/localisations/:id
// Modifier un quartier — admin uniquement
router.patch('/:id', authenticate, requireRole(['admin']), localisationsController.updateLocalisation);

// DELETE /api/v1/localisations/:id
// Supprimer un quartier — admin uniquement
router.delete('/:id', authenticate, requireRole(['admin']), localisationsController.deleteLocalisation);

module.exports = router;
