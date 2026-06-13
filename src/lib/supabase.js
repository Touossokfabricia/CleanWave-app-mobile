// ============================================================
// src/lib/supabase.js
//
// CORRECTION : compatible avec expo-secure-store v55+
// et @supabase/supabase-js v2 récent
//
// PROBLÈMES RÉSOLUS :
// 1. ExpoSecureStoreAdapter réécrit avec la nouvelle API de
//    expo-secure-store v55 (getItemAsync → getValueWithKeyAsync
//    n'existe plus, on utilise getItemAsync directement)
// 2. Ajout de Platform.OS pour éviter l'erreur "protocol getter"
//    sur React Native (SecureStore ne fonctionne pas sur web)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ⚠️ Remplace ces deux valeurs par celles de TON projet Supabase
// Tableau de bord Supabase → Settings → API
const SUPABASE_URL = 'https://rnvyezzhdtbqodrecrpv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudnllenpoZHRicW9kcmVjcnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDQyMDYsImV4cCI6MjA5NDA4MDIwNn0.ILbXFIbCD6VJtvUkSEzYWxGMlIyTkomRWCW0IZsHpjc';

// ============================================================
// STORAGE ADAPTER
//
// Supabase a besoin d'un endroit pour sauvegarder le token
// de connexion. On lui donne un adaptateur différent selon
// la plateforme :
//   - Téléphone (iOS/Android) → SecureStore (coffre-fort sécurisé)
//   - Web (navigateur)        → localStorage (stockage navigateur)
//
// C'est la correction principale des deux erreurs !
// ============================================================

// Adaptateur pour téléphone (iOS / Android)
// Utilise l'API correcte de expo-secure-store v55+
const SecureStoreAdapter = {
  getItem: async (key) => {
    try {
      // expo-secure-store v55+ : on utilise getItemAsync directement
      // (getValueWithKeyAsync n'existe plus dans cette version)
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Silencieux si erreur (ex: valeur trop longue)
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Silencieux si la clé n'existe pas
    }
  },
};

// Adaptateur pour le navigateur web
// SecureStore ne fonctionne pas sur web, on utilise localStorage
const WebStorageAdapter = {
  getItem: (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
    return Promise.resolve();
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
    return Promise.resolve();
  },
};

// On choisit l'adaptateur selon la plateforme
// Platform.OS vaut 'ios', 'android', ou 'web'
const storage = Platform.OS === 'web'
  ? WebStorageAdapter
  : SecureStoreAdapter;

// ============================================================
// CRÉATION DU CLIENT SUPABASE
// ============================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,                  // notre adaptateur selon la plateforme
    autoRefreshToken: true,   // renouvelle le token automatiquement
    persistSession: true,     // garde la session après fermeture de l'app
    detectSessionInUrl: false, // désactivé sur mobile (inutile)
  },
});