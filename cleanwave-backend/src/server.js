// ============================================================
// src/server.js
//
// POINT D'ENTRÉE du serveur.
//
// Ce fichier fait UNE seule chose : démarrer le serveur.
// Toute la configuration Express est dans app.js.
// Séparer les deux permet de tester l'app sans démarrer
// le vrai serveur.
// ============================================================

// Charge les variables d'environnement depuis .env
// DOIT être en premier, avant tout autre import !
require('dotenv').config();

const app = require('./app');

// Récupère le port depuis .env, ou utilise 3001 par défaut
const PORT = process.env.PORT || 3001;

// Démarre le serveur
const server = app.listen(PORT, () => {
    console.log('');
    console.log('🌊 ============================================');
    console.log(`🌊  CleanWave Backend — Serveur démarré !`);
    console.log(`🌊  URL : http://localhost:${PORT}`);
    console.log(`🌊  Env : ${process.env.NODE_ENV || 'development'}`);
    console.log('🌊 ============================================');
    console.log('');
    console.log('📡 Routes disponibles :');
    console.log(`   GET  http://localhost:${PORT}/api/v1/health`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/profile`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/signalements`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/depots`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/plannings`);
    console.log('');
});

// Gestion des erreurs non capturées (protection contre les crashes)
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non capturée:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Promesse rejetée non gérée:', reason);
    process.exit(1);
});

module.exports = server;
