// ============================================================
// src/modules/primes/primes.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const primesController = require('./primes.controller');

// GET /api/v1/primes/mes-primes — Primes du citoyen connecté
router.get('/mes-primes', authenticate, requireRole(['citoyen']), primesController.getMesPrimes);

// GET /api/v1/primes — Toutes les primes (admin)
router.get('/', authenticate, requireRole(['admin']), primesController.getAllPrimes);

// POST /api/v1/primes — Créer une prime (admin)
router.post('/', authenticate, requireRole(['admin']), primesController.createPrime);

// PATCH /api/v1/primes/:id/verser — Marquer une prime comme versée
router.patch('/:id/verser', authenticate, requireRole(['admin']), primesController.marquerVersee);

// PATCH /api/v1/primes/:id/annuler — Annuler une prime
router.patch('/:id/annuler', authenticate, requireRole(['admin']), primesController.annulerPrime);

module.exports = router;
