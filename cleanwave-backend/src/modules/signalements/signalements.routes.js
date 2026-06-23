// ============================================================
// src/modules/signalements/signalements.routes.js
//
// Routes du module Signalements
// C'est le module CENTRAL de CleanWave.
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const signalementsController = require('./signalements.controller');

// GET /api/v1/signalements
// - Citoyen : voit ses propres signalements
// - Collecteur : voit tous les signalements à traiter
// - Admin : voit tous les signalements
// - Partenaire : voit les signalements de sa zone
router.get('/', authenticate, signalementsController.getSignalements);

// GET /api/v1/signalements/stats
// ⚠️  DOIT être déclaré AVANT /:id — sinon Express capture 'stats' comme identifiant
// et tente BigInt('stats') → erreur 500
router.get('/stats', authenticate, signalementsController.getStats);

// GET /api/v1/signalements/:id
// Détails d'un signalement spécifique
router.get('/:id', authenticate, signalementsController.getSignalementById);

// POST /api/v1/signalements
// Créer un nouveau signalement (citoyen uniquement)
router.post('/', authenticate, requireRole(['citoyen', 'admin']), signalementsController.createSignalement);

// PATCH /api/v1/signalements/:id
// Modifier un signalement (créateur ou collecteur assigné ou admin)
router.patch('/:id', authenticate, signalementsController.updateSignalement);

// PATCH /api/v1/signalements/:id/assigner
// Assigner un collecteur à un signalement (collecteur ou admin)
router.patch('/:id/assigner', authenticate, requireRole(['collecteur', 'admin']), signalementsController.assignerCollecteur);

// DELETE /api/v1/signalements/:id
// Supprimer (admin uniquement)
router.delete('/:id', authenticate, requireRole(['admin']), signalementsController.deleteSignalement);

module.exports = router;
