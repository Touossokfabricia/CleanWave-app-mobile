// ============================================================
// src/modules/localisations/localisations.controller.js
// ============================================================
const localisationsService = require('./localisations.service');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const getAllLocalisations = async (req, res, next) => {
    try {
        const localisations = await localisationsService.getAllLocalisations();
        res.json({ success: true, data: { localisations: serializeBigInt(localisations) } });
    } catch (error) { next(error); }
};

const getLocalisationById = async (req, res, next) => {
    try {
        const localisation = await localisationsService.getLocalisationById(req.params.id);
        if (!localisation) return res.status(404).json({ error: 'Localisation non trouvée' });
        res.json({ success: true, data: { localisation: serializeBigInt(localisation) } });
    } catch (error) { next(error); }
};

const createLocalisation = async (req, res, next) => {
    try {
        const { nom, ville } = req.body;
        if (!nom || !ville) {
            return res.status(400).json({ error: 'Les champs nom et ville sont requis' });
        }
        const localisation = await localisationsService.createLocalisation(req.body);
        res.status(201).json({
            success: true,
            message: 'Quartier ajouté avec succès',
            data: { localisation: serializeBigInt(localisation) },
        });
    } catch (error) { next(error); }
};

const updateLocalisation = async (req, res, next) => {
    try {
        const localisation = await localisationsService.updateLocalisation(req.params.id, req.body);
        res.json({ success: true, message: 'Quartier mis à jour', data: { localisation: serializeBigInt(localisation) } });
    } catch (error) { next(error); }
};

const deleteLocalisation = async (req, res, next) => {
    try {
        await localisationsService.deleteLocalisation(req.params.id);
        res.json({ success: true, message: 'Quartier supprimé' });
    } catch (error) { next(error); }
};

module.exports = { getAllLocalisations, getLocalisationById, createLocalisation, updateLocalisation, deleteLocalisation };
