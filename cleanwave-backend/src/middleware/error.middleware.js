// ============================================================
// src/middleware/error.middleware.js
//
// MIDDLEWARE GLOBAL DE GESTION DES ERREURS
//
// Ce middleware capture TOUTES les erreurs non gérées dans
// l'application et retourne une réponse JSON propre.
//
// COMMENT ÇA MARCHE ?
// Dans n'importe quelle route, si tu fais :
//   next(new Error('quelque chose a planté'))
// ou si une exception est lancée,
// Express appelle automatiquement ce middleware.
//
// Il doit TOUJOURS avoir 4 paramètres (err, req, res, next)
// pour qu'Express le reconnaisse comme gestionnaire d'erreurs.
// ============================================================

const errorHandler = (err, req, res, next) => {
    // Affiche l'erreur dans la console du serveur (pour le debug)
    console.error('❌ Erreur capturée:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
    });

    // Code de statut HTTP (par défaut 500 = erreur serveur)
    const statusCode = err.statusCode || err.status || 500;

    // Corps de la réponse JSON
    const response = {
        error: err.name || 'Erreur Serveur',
        message: err.message || 'Une erreur inattendue est survenue.',
    };

    // En développement, on ajoute la stack trace pour déboguer
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Erreurs Prisma spécifiques → messages clairs
    if (err.code === 'P2002') {
        // Violation de contrainte unique (ex: email déjà existant)
        return res.status(409).json({
            error: 'Conflit',
            message: 'Cette ressource existe déjà.',
        });
    }

    if (err.code === 'P2025') {
        // Enregistrement non trouvé
        return res.status(404).json({
            error: 'Non trouvé',
            message: 'L\'élément demandé n\'existe pas.',
        });
    }

    res.status(statusCode).json(response);
};

// Crée une erreur HTTP avec un code de statut personnalisé
const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

module.exports = { errorHandler, createError };
