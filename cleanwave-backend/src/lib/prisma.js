// ============================================================
// src/lib/prisma.js
//
// Instance unique du client Prisma (Singleton).
//
// POURQUOI UN SINGLETON ?
// Prisma crée une connexion à la base de données.
// Si on créait un nouveau client à chaque requête, on
// ouvrirait des centaines de connexions → surcharge de la BDD.
//
// Avec le singleton : UNE seule connexion est créée au
// démarrage du serveur, et partagée par toutes les routes.
// ============================================================

const { PrismaClient } = require('@prisma/client');

// Variable globale pour stocker l'instance unique
// En développement, Next.js / Nodemon rechargent le module à chaque
// changement de fichier. Sans cette technique, on créerait une
// nouvelle connexion à chaque rechargement.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']  // En dev : affiche toutes les requêtes SQL
        : ['error'],                   // En prod : seulement les erreurs
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;
