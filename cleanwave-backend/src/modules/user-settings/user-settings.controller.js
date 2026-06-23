// ============================================================
// src/modules/user-settings/user-settings.controller.js
// ============================================================
const userSettingsService = require('./user-settings.service');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

// GET /api/v1/settings — Récupère les paramètres de l'utilisateur connecté
const getSettings = async (req, res, next) => {
    try {
        const settings = await userSettingsService.getSettings(req.userId);
        res.json({ success: true, data: { settings: serializeBigInt(settings) } });
    } catch (error) { next(error); }
};

// PATCH /api/v1/settings — Met à jour les paramètres
const updateSettings = async (req, res, next) => {
    try {
        const settings = await userSettingsService.updateSettings(req.userId, req.body);
        res.json({ success: true, message: 'Paramètres mis à jour', data: { settings: serializeBigInt(settings) } });
    } catch (error) { next(error); }
};

// PATCH /api/v1/settings/profile — Met à jour les infos du profil
const updateProfile = async (req, res, next) => {
    try {
        const profile = await userSettingsService.updateProfile(req.userId, req.body);
        res.json({ success: true, message: 'Profil mis à jour', data: { profile } });
    } catch (error) { next(error); }
};

module.exports = { getSettings, updateSettings, updateProfile };
