// ============================================================
// src/app.js
//
// CONFIGURATION EXPRESS
//
// Ce fichier configure l'application Express :
//   - Sécurité (helmet, cors, rate limiting)
//   - Parsing du JSON
//   - Logging des requêtes
//   - Toutes les routes API
//   - Gestion des erreurs
//
// "Express" c'est comme un serveur de restaurant :
//   - Les "middlewares" sont les étapes par lesquelles
//     passe chaque commande (requête HTTP)
//   - Les "routes" sont les plats que tu peux commander
//   - Les "controllers" sont les cuisiniers
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import de toutes les routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const signalementsRoutes = require('./modules/signalements/signalements.routes');
const depotsRoutes = require('./modules/depots/depots.routes');
const planningsRoutes = require('./modules/plannings/plannings.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const localisationsRoutes = require('./modules/localisations/localisations.routes');
const collecteursRoutes = require('./modules/collecteurs/collecteurs.routes');
const primesRoutes = require('./modules/primes/primes.routes');
const typesDechetsRoutes = require('./modules/types-dechets/types-dechets.routes');
const userSettingsRoutes = require('./modules/user-settings/user-settings.routes');
const itinerairesRoutes = require('./modules/itineraires/itineraires.routes');

// Import du middleware de gestion des erreurs
const { errorHandler } = require('./middleware/error.middleware');

// ──────────────────────────────────────────────────────────
// Création de l'application Express
// ──────────────────────────────────────────────────────────
const app = express();

// ──────────────────────────────────────────────────────────
// MIDDLEWARE 1 : Sécurité — Helmet
//
// Helmet ajoute des en-têtes HTTP de sécurité automatiquement.
// Exemple : empêche les attaques XSS, clickjacking, etc.
// ──────────────────────────────────────────────────────────
app.use(helmet());

// ──────────────────────────────────────────────────────────
// MIDDLEWARE 2 : CORS — Cross-Origin Resource Sharing
//
// CORS définit quels sites/apps ont le droit d'appeler ce backend.
// Sans CORS, le navigateur web bloquerait les requêtes.
//
// En développement on autorise tout (*).
// En production on restreindra aux URLs de l'application.
// ──────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ──────────────────────────────────────────────────────────
// MIDDLEWARE 3 : Logging — Morgan
//
// Morgan affiche dans la console chaque requête reçue.
// Format "dev" : méthode, URL, statut, durée
// Exemple : GET /api/v1/depots 200 45ms
// ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// ──────────────────────────────────────────────────────────
// MIDDLEWARE 4 : Rate Limiting — Protection anti-spam
//
// Limite le nombre de requêtes par IP sur 15 minutes.
// Protège contre les attaques par force brute.
// ──────────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // max 200 requêtes par IP par fenêtre
    message: {
        error: 'Trop de requêtes. Réessayez dans 15 minutes.'
    }
});
app.use('/api/', limiter);

// ──────────────────────────────────────────────────────────
// MIDDLEWARE 5 : Parsing JSON
//
// Permet à Express de lire le corps des requêtes en JSON.
// Sans ça, req.body serait toujours undefined.
// ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' })); // 10mb pour les images en base64
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────────────────
// ROUTE DE SANTÉ (health check)
//
// Permet de vérifier que le serveur est bien démarré.
// Appelle GET /api/v1/health dans ton navigateur pour tester.
// ──────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'OK',
        message: '🌊 CleanWave Backend est opérationnel !',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// ──────────────────────────────────────────────────────────
// ROUTES API
//
// Chaque groupe de routes est préfixé par /api/v1/
// Le "v1" permet de versionner l'API.
// Si tu changes l'API plus tard, tu crées /api/v2/ sans casser v1.
// ──────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/signalements', signalementsRoutes);
app.use('/api/v1/depots', depotsRoutes);
app.use('/api/v1/plannings', planningsRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/localisations', localisationsRoutes);
app.use('/api/v1/collecteurs', collecteursRoutes);
app.use('/api/v1/primes', primesRoutes);
app.use('/api/v1/types-dechets', typesDechetsRoutes);
app.use('/api/v1/settings', userSettingsRoutes);
app.use('/api/v1/itineraires', itinerairesRoutes);

// ──────────────────────────────────────────────────────────
// ROUTE 404 — Route non trouvée
//
// Si aucune route ne correspond, on retourne une erreur claire.
// ──────────────────────────────────────────────────────────
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        message: `La route ${req.method} ${req.originalUrl} n'existe pas.`,
        routes_disponibles: [
            'GET  /api/v1/health',
            'POST /api/v1/auth/profile',
            'GET  /api/v1/auth/me',
            'GET  /api/v1/users',
            'POST /api/v1/users',
            'GET  /api/v1/signalements',
            'GET  /api/v1/signalements/stats',
            'GET  /api/v1/depots',
            'GET  /api/v1/plannings',
            'GET  /api/v1/chat/history',
            'GET  /api/v1/localisations',
            'GET  /api/v1/collecteurs',
            'GET  /api/v1/collecteurs/me/itineraire',
            'GET  /api/v1/primes/mes-primes',
            'GET  /api/v1/types-dechets',
            'GET  /api/v1/settings',
        ]
    });
});

// ──────────────────────────────────────────────────────────
// MIDDLEWARE DE GESTION DES ERREURS
//
// DOIT toujours être le DERNIER middleware.
// Capture toutes les erreurs lancées par les routes.
// ──────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
