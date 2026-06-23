// ============================================================
// src/modules/primes/primes.controller.js
// ============================================================
const primesService = require('./primes.service');

const serializeBigInt = (obj) => JSON.parse(
    JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value)
);

const getMesPrimes = async (req, res, next) => {
    try {
        const primes = await primesService.getPrimesByCitoyen(req.userId);
        res.json({ success: true, data: { primes: serializeBigInt(primes) } });
    } catch (error) { next(error); }
};

const getAllPrimes = async (req, res, next) => {
    try {
        const { page, limit, statut } = req.query;
        const result = await primesService.getAllPrimes({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, statut });
        res.json({ success: true, data: serializeBigInt(result) });
    } catch (error) { next(error); }
};

const createPrime = async (req, res, next) => {
    try {
        const { citoyen_id, montant, motif } = req.body;
        if (!citoyen_id || !montant || !motif) {
            return res.status(400).json({ error: 'Les champs citoyen_id, montant et motif sont requis' });
        }
        const prime = await primesService.createPrime(req.body);
        res.status(201).json({ success: true, message: 'Prime créée', data: { prime: serializeBigInt(prime) } });
    } catch (error) { next(error); }
};

const marquerVersee = async (req, res, next) => {
    try {
        const prime = await primesService.marquerVersee(req.params.id);
        res.json({ success: true, message: 'Prime marquée comme versée', data: { prime: serializeBigInt(prime) } });
    } catch (error) { next(error); }
};

const annulerPrime = async (req, res, next) => {
    try {
        const prime = await primesService.annulerPrime(req.params.id);
        res.json({ success: true, message: 'Prime annulée', data: { prime: serializeBigInt(prime) } });
    } catch (error) { next(error); }
};

module.exports = { getMesPrimes, getAllPrimes, createPrime, marquerVersee, annulerPrime };
