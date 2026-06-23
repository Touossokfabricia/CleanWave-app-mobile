// ============================================================
// src/modules/auth/auth.routes.js
// ============================================================

const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');
const authController = require('./auth.controller');

// POST /api/v1/auth/register — Inscription publique (citoyen uniquement)
router.post('/register', authController.registerCitoyen);

// POST /api/v1/auth/profile — Synchronise le profil après connexion Supabase
router.post('/profile', authenticate, authController.syncProfile);

// GET /api/v1/auth/me — Infos utilisateur connecté
router.get('/me', authenticate, authController.getMe);

// PATCH /api/v1/auth/password — Changer le mot de passe
router.patch('/password', authenticate, authController.changePassword);

module.exports = router;
