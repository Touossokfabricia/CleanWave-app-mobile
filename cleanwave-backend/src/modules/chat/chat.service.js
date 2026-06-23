// ============================================================
// src/modules/chat/chat.service.js
//
// SERVICE Chat — Gestion du chatbot IA
//
// Ce service gère l'historique des conversations.
// Pour la réponse IA, on utilise une réponse simple pour l'instant.
// Tu pourras brancher OpenAI / Gemini API plus tard !
// ============================================================
const prisma = require('../../lib/prisma');

// ──────────────────────────────────────────────────────────
// getHistory — Récupère l'historique des messages
// ──────────────────────────────────────────────────────────
const getHistory = async (userId, limit = 50) => {
    const messages = await prisma.chatMessage.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'asc' },
        take: limit,
    });
    return messages.map(serializeBigInt);
};

// ──────────────────────────────────────────────────────────
// sendMessage — Traite un message et génère une réponse
// ──────────────────────────────────────────────────────────
const sendMessage = async (userId, contenu) => {
    // 1. Sauvegarder le message de l'utilisateur
    await prisma.chatMessage.create({
        data: { user_id: userId, role: 'user', contenu },
    });

    // 2. Générer une réponse du chatbot
    // TODO: Brancher ici l'API OpenAI, Gemini ou autre
    const reponseBot = genererReponseChatbot(contenu);

    // 3. Sauvegarder la réponse du bot
    const messageBot = await prisma.chatMessage.create({
        data: { user_id: userId, role: 'assistant', contenu: reponseBot },
    });

    return serializeBigInt(messageBot);
};

// ──────────────────────────────────────────────────────────
// clearHistory — Effacer l'historique d'un utilisateur
// ──────────────────────────────────────────────────────────
const clearHistory = async (userId) => {
    const result = await prisma.chatMessage.deleteMany({
        where: { user_id: userId },
    });
    return result.count;
};

// ──────────────────────────────────────────────────────────
// genererReponseChatbot — Réponses simples (à remplacer par IA)
// ──────────────────────────────────────────────────────────
const genererReponseChatbot = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes('signalement') || msg.includes('signaler')) {
        return '♻️ Pour signaler un dépôt sauvage, rendez-vous dans l\'onglet "Signalements" et prenez une photo du dépôt avec sa localisation. Notre équipe interviendra dans les 48h.';
    }
    if (msg.includes('dépôt') || msg.includes('depot') || msg.includes('déposer')) {
        return '🗑️ Les points de dépôt autorisés sont visibles sur la carte. Cherchez le plus proche de chez vous. Assurez-vous de trier vos déchets selon le type accepté.';
    }
    if (msg.includes('planning') || msg.includes('collecte') || msg.includes('camion')) {
        return '🚛 Le planning des collectes est disponible dans l\'onglet "Planning". Vous pouvez voir les horaires de passage dans votre quartier.';
    }
    if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
        return '👋 Bonjour ! Je suis l\'assistant CleanWave. Comment puis-je vous aider ? Vous pouvez me poser des questions sur les signalements, les dépôts ou les collectes.';
    }
    if (msg.includes('merci')) {
        return '😊 De rien ! N\'hésitez pas si vous avez d\'autres questions. Ensemble, rendons le Cameroun plus propre !';
    }
    if (msg.includes('aide') || msg.includes('help')) {
        return '🌊 Je peux vous aider avec :\n• Signaler un dépôt sauvage\n• Trouver un point de dépôt\n• Consulter le planning de collecte\n• Comprendre le système de points\n\nQue souhaitez-vous savoir ?';
    }

    return '🌊 Merci pour votre message ! Pour une meilleure assistance, posez-moi des questions sur les signalements, les dépôts autorisés ou les plannings de collecte. L\'équipe CleanWave est là pour vous aider ! 💚';
};

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

module.exports = { getHistory, sendMessage, clearHistory };
