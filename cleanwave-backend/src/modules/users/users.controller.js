// ============================================================
// src/modules/users/users.controller.js
// ============================================================
const usersService = require('./users.service');

const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, type } = req.query;
        const result = await usersService.getAllUsers({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            type,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Un utilisateur ne peut voir que son propre profil sauf admin
        if (req.userRole !== 'admin' && req.userId !== id) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const user = await usersService.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json({ success: true, data: { user } });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // On ne peut modifier que son propre profil sauf admin
        if (req.userRole !== 'admin' && req.userId !== id) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const user = await usersService.updateUser(id, req.body);
        res.json({ success: true, message: 'Profil mis à jour', data: { user } });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usersService.deleteUser(id);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        next(error);
    }
};

// POST — Créer un utilisateur admin ou partenaire (admin uniquement)
const createUser = async (req, res, next) => {
    try {
        const { email, password, nom, type } = req.body;
        if (!email || !password || !nom || !type) {
            return res.status(400).json({
                error: 'Champs manquants',
                message: 'Les champs email, password, nom et type sont requis.',
            });
        }
        const user = await usersService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: `Utilisateur ${type} créé avec succès`,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
