// ============================================================
// src/modules/auth/auth.controller.js
// ============================================================

const authService = require('./auth.service');

const syncProfile = async (req, res, next) => {
    try {
        const { nom, prenom, localisation_id } = req.body;

        const profile = await authService.syncProfile(req.userId, {
            nom: nom || req.profile?.nom,
            prenom: prenom || req.profile?.prenom,
            email: req.user.email,
            type: req.profile?.type || 'citoyen',
            localisation_id: localisation_id ?? req.profile?.localisation_id,
        });

        res.json({
            success: true,
            message: 'Profil synchronisé avec succès',
            data: { profile },
        });
    } catch (error) {
        next(error);
    }
};

const registerCitoyen = async (req, res, next) => {
    try {
        const { email, password, nom, prenom, telephone, localisation_id } = req.body;

        const profile = await authService.registerCitoyen({
            email, password, nom, prenom, telephone, localisation_id,
        });

        res.status(201).json({
            success: true,
            message: 'Compte citoyen créé avec succès. Vous pouvez vous connecter.',
            data: { profile },
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const profile = req.profile
            ? req.profile
            : await authService.getProfileById(req.userId);

        res.json({
            success: true,
            data: {
                user: {
                    id: req.userId,
                    email: req.user.email,
                    email_confirmed: !!req.user.email_confirmed_at,
                },
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        await authService.changePassword(req.userId, req.body);
        res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { syncProfile, registerCitoyen, getMe, changePassword };
