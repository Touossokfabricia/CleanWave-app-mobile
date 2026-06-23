// ============================================================
// src/modules/chat/chat.routes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');
const chatController = require('./chat.controller');

// GET /api/v1/chat/history — Historique des messages
router.get('/history', authenticate, chatController.getHistory);

// POST /api/v1/chat/message — Envoyer un message
router.post('/message', authenticate, chatController.sendMessage);

// DELETE /api/v1/chat/history — Effacer l'historique
router.delete('/history', authenticate, chatController.clearHistory);

module.exports = router;
