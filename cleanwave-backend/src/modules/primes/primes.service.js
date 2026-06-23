// ============================================================
// src/modules/primes/primes.service.js
//
// SERVICE Primes — Gestion des récompenses citoyens
// ============================================================
const prisma = require('../../lib/prisma');

// Récupère les primes d'un citoyen
const getPrimesByCitoyen = async (citoyenId) => {
    return prisma.prime.findMany({
        where: { citoyen_id: citoyenId },
        orderBy: { date_prime: 'desc' },
    });
};

// Récupère toutes les primes (admin)
const getAllPrimes = async ({ page = 1, limit = 20, statut } = {}) => {
    const skip = (page - 1) * limit;
    const where = statut ? { statut } : {};
    const [primes, total] = await Promise.all([
        prisma.prime.findMany({
            where, skip, take: limit,
            include: {
                citoyen: { select: { id: true, nom: true, prenom: true, email: true } },
            },
            orderBy: { date_prime: 'desc' },
        }),
        prisma.prime.count({ where }),
    ]);
    return { primes, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

// Crée une prime pour un citoyen (admin)
const createPrime = async (data) => {
    const { citoyen_id, montant, motif } = data;
    return prisma.prime.create({
        data: {
            citoyen_id,
            montant: parseFloat(montant),
            motif,
            statut: 'en_attente',
        },
        include: {
            citoyen: { select: { id: true, nom: true, prenom: true, email: true } },
        },
    });
};

// Marquer une prime comme versée
const marquerVersee = async (primeId) => {
    return prisma.prime.update({
        where: { id: BigInt(primeId) },
        data: {
            statut: 'versee',
            date_versement: new Date(),
            updated_at: new Date(),
        },
    });
};

// Annuler une prime
const annulerPrime = async (primeId) => {
    return prisma.prime.update({
        where: { id: BigInt(primeId) },
        data: { statut: 'annulee', updated_at: new Date() },
    });
};

module.exports = { getPrimesByCitoyen, getAllPrimes, createPrime, marquerVersee, annulerPrime };
