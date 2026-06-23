// ============================================================
// src/lib/supabase.js
//
// Client Supabase côté BACKEND.
//
// Pourquoi un client Supabase dans le backend ?
// → Pour vérifier les tokens JWT des utilisateurs.
// → Quand un utilisateur envoie une requête, il inclut son
//   token JWT dans le header. Le backend utilise Supabase
//   pour vérifier que ce token est valide.
//
// On utilise la SERVICE_ROLE_KEY (clé admin) pour avoir
// accès complet à la base sans être bloqué par les RLS.
// ============================================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Variables Supabase manquantes dans .env !');
    console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌ MANQUANT');
    console.error('   SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅' : '❌ MANQUANT');
    process.exit(1);
}

// Client avec la clé ANON (pour vérifier les tokens utilisateur)
// C'est ce client qu'on utilise pour supabase.auth.getUser(token)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Client avec la clé SERVICE_ROLE (accès admin complet)
// À utiliser UNIQUEMENT pour les opérations admin serveur
// Ne jamais exposer côté client !
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        }
    })
    : null;

module.exports = { supabase, supabaseAdmin };
