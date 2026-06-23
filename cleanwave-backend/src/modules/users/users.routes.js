// ============================================================
// src/modules/users/users.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const usersController = require('./users.controller');

// GET /api/v1/users — Liste tous les utilisateurs (admin seulement)
router.get('/', authenticate, requireRole(['admin']), usersController.getAllUsers);

// POST /api/v1/users — Créer un utilisateur admin ou partenaire (admin uniquement)
router.post('/', authenticate, requireRole(['admin']), usersController.createUser);

// GET /api/v1/users/:id — Détails d'un utilisateur
router.get('/:id', authenticate, usersController.getUserById);

// PATCH /api/v1/users/:id — Modifier un utilisateur (admin ou soi-même)
router.patch('/:id', authenticate, usersController.updateUser);

// DELETE /api/v1/users/:id — Supprimer (admin seulement)
router.delete('/:id', authenticate, requireRole(['admin']), usersController.deleteUser);

module.exports = router;
