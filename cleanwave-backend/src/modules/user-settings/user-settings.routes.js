// ============================================================
// src/modules/user-settings/user-settings.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');
const userSettingsController = require('./user-settings.controller');

// GET /api/v1/settings — Paramètres de l'utilisateur connecté
router.get('/', authenticate, userSettingsController.getSettings);

// PATCH /api/v1/settings — Modifier les paramètres (mode sombre, notifications...)
router.patch('/', authenticate, userSettingsController.updateSettings);

// PATCH /api/v1/settings/profile — Modifier les infos du compte (nom, téléphone...)
router.patch('/profile', authenticate, userSettingsController.updateProfile);

module.exports = router;
