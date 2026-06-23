// ============================================================
// src/middleware/auth.middleware.js
//
// MIDDLEWARE D'AUTHENTIFICATION
//
// Ce middleware s'exécute AVANT chaque route protégée.
// Il vérifie que l'utilisateur est bien connecté en
// validant son token JWT Supabase.
//
// COMMENT ÇA MARCHE ?
//
// 1. L'utilisateur se connecte dans l'app mobile
//    → Supabase lui donne un "token JWT"
//
// 2. À chaque requête API, l'app envoie ce token dans
//    le header HTTP : "Authorization: Bearer <token>"
//
// 3. Ce middleware lit le token, demande à Supabase de
//    le vérifier, et si valide : ajoute les infos de
//    l'utilisateur dans req.user
//
// 4. La route suivante peut alors utiliser req.user
//    pour savoir qui fait la requête.
// ============================================================

const { supabase } = require('../lib/supabase');
const prisma = require('../lib/prisma');

// ──────────────────────────────────────────────────────────
// authenticate — Vérifie le JWT et charge le profil
// ──────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
    try {
        // 1. Lire le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Non autorisé',
                message: 'Token manquant. Connectez-vous d\'abord.',
            });
        }

        // 2. Extraire le token (enlever "Bearer ")
        const token = authHeader.substring(7);

        // 3. Vérifier le token avec Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: 'Token invalide',
                message: 'Votre session a expiré. Reconnectez-vous.',
            });
        }

        // 4. Charger le profil depuis la base de données
        //    Le profil peut être null pour les nouveaux utilisateurs (ex: premier appel à /auth/profile).
        //    On ne bloque PAS ici — c'est la route qui décide si un profil est obligatoire.
        const profile = await prisma.profile.findUnique({
            where: { id: user.id },
        });

        // 5. Ajouter les infos dans req pour les routes suivantes
        req.user = user;                          // données Supabase Auth
        req.profile = profile || null;            // null si profil pas encore créé
        req.userId = user.id;                     // raccourci pratique
        req.userRole = profile?.type || null;     // null si profil absent

        // 6. Passer au middleware/route suivant
        next();

    } catch (error) {
        console.error('❌ Erreur middleware authenticate:', error);
        return res.status(500).json({
            error: 'Erreur serveur',
            message: 'Une erreur est survenue lors de l\'authentification.',
        });
    }
};

// ──────────────────────────────────────────────────────────
// requireRole — Vérifie que l'utilisateur a le bon rôle
//
// Usage : router.get('/route', authenticate, requireRole(['admin']), handler)
// ──────────────────────────────────────────────────────────
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Rôle non défini. Authentifiez-vous d\'abord.',
            });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                error: 'Accès refusé',
                message: `Cette action nécessite le rôle : ${allowedRoles.join(' ou ')}.`,
                votre_role: req.userRole,
            });
        }

        next();
    };
};

// ──────────────────────────────────────────────────────────
// optionalAuth — Auth optionnelle (ne bloque pas si absent)
//
// Usage pour les routes publiques qui bénéficient de données
// supplémentaires quand l'utilisateur est connecté
// ──────────────────────────────────────────────────────────
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Pas de token → continue sans auth
        }

        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
            const profile = await prisma.profile.findUnique({
                where: { id: user.id },
            });
            req.user = user;
            req.profile = profile;
            req.userId = user.id;
            req.userRole = profile?.type;
        }

        next();
    } catch {
        next(); // En cas d'erreur → continue sans auth
    }
};

module.exports = { authenticate, requireRole, optionalAuth };
