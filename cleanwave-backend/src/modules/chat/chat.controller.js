// ============================================================
// src/modules/chat/chat.controller.js
// ============================================================
const chatService = require('./chat.service');

const getHistory = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const messages = await chatService.getHistory(req.userId, parseInt(limit) || 50);
        res.json({ success: true, data: { messages, count: messages.length } });
    } catch (error) { next(error); }
};

const sendMessage = async (req, res, next) => {
    try {
        const { contenu } = req.body;
        if (!contenu || contenu.trim() === '') {
            return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
        }
        const reponse = await chatService.sendMessage(req.userId, contenu.trim());
        res.status(201).json({ success: true, data: { reponse } });
    } catch (error) { next(error); }
};

const clearHistory = async (req, res, next) => {
    try {
        const count = await chatService.clearHistory(req.userId);
        res.json({ success: true, message: `${count} messages supprimés.` });
    } catch (error) { next(error); }
};

module.exports = { getHistory, sendMessage, clearHistory };
