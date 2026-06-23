-- ============================================================
-- SCRIPT SQL SUPABASE — CleanWave
-- À exécuter dans l'éditeur SQL de Supabase (Dashboard > SQL Editor)
--
-- Ce script crée les tables manquantes, les index de performance
-- et les politiques RLS (Row Level Security).
--
-- ORDRE D'EXÉCUTION IMPORTANT :
-- 1. Types ENUM
-- 2. Tables (dans l'ordre des dépendances)
-- 3. Index
-- 4. Politiques RLS
-- ============================================================


-- ============================================================
-- SECTION 1 — TYPES ENUM PostgreSQL
-- ============================================================

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('admin', 'partenaire', 'collecteur', 'citoyen');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "StatutSignalement" AS ENUM ('en_attente', 'pris_en_charge', 'resolu', 'annule');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "StatutPlanning" AS ENUM ('planifie', 'en_cours', 'termine', 'annule');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "StatutPrime" AS ENUM ('en_attente', 'versee', 'annulee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================================
-- SECTION 2 — TABLES
-- ============================================================

-- Table des quartiers / zones géographiques
CREATE TABLE IF NOT EXISTS localisations (
  id          BIGSERIAL PRIMARY KEY,
  nom         VARCHAR(150) NOT NULL UNIQUE,
  ville       VARCHAR(100) NOT NULL,
  description TEXT,
  latitude    DECIMAL(10, 8),
  longitude   DECIMAL(11, 8),
  est_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mise à jour du champ type dans profiles (si la colonne existe déjà en VARCHAR)
-- Ajouter la colonne localisation_id si elle n'existe pas
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS localisation_id BIGINT REFERENCES localisations(id) ON DELETE SET NULL;

-- Modifier le type du champ 'type' pour utiliser l'enum Role
-- NOTE: Si la colonne 'type' est déjà VARCHAR, cette migration convertit les valeurs existantes
DO $$ BEGIN
  ALTER TABLE profiles ALTER COLUMN type TYPE "Role" USING type::"Role";
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Conversion du type déjà faite ou non nécessaire : %', SQLERRM;
END $$;

-- Ajouter la contrainte UNIQUE sur email dans profiles si absente
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_email_unique UNIQUE (email);

-- Table des collecteurs (agents terrain)
CREATE TABLE IF NOT EXISTS collecteurs (
  id            BIGSERIAL PRIMARY KEY,
  profile_id    UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  partenaire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matricule     VARCHAR(50),
  est_actif     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajouter la colonne localisation_id dans depots si absente
ALTER TABLE depots
  ADD COLUMN IF NOT EXISTS localisation_id BIGINT REFERENCES localisations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Table des types de déchets
CREATE TABLE IF NOT EXISTS types_dechets (
  id          BIGSERIAL PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icone       VARCHAR(50),
  couleur     VARCHAR(7),
  est_actif   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insérer les types de déchets par défaut
INSERT INTO types_dechets (nom, icone, couleur) VALUES
  ('Plastique',    'bottle',   '#3AB795'),
  ('Verre',        'glass',    '#2196F3'),
  ('Métal',        'metal',    '#9E9E9E'),
  ('Papier',       'file',     '#FF9800'),
  ('Organique',    'leaf',     '#4CAF50'),
  ('Électronique', 'battery',  '#9C27B0'),
  ('Textile',      'shirt',    '#E91E63'),
  ('Dangereux',    'warning',  '#F44336')
ON CONFLICT (nom) DO NOTHING;

-- Table pivot signalement ↔ type de déchet (N-N)
CREATE TABLE IF NOT EXISTS signalement_type_dechet (
  signalement_id BIGINT NOT NULL REFERENCES signalements(id) ON DELETE CASCADE,
  type_dechet_id BIGINT NOT NULL REFERENCES types_dechets(id) ON DELETE CASCADE,
  PRIMARY KEY (signalement_id, type_dechet_id)
);

-- Modifier signalements : changer etat en enum, rendre photo_url optionnel
DO $$ BEGIN
  ALTER TABLE signalements ALTER COLUMN etat TYPE "StatutSignalement" USING etat::"StatutSignalement";
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Migration etat déjà faite : %', SQLERRM;
END $$;

-- Supprimer les colonnes dépréciées de signalements (type_signalement et etat_prise_en_charge)
-- car ces données sont maintenant gérées par la table pivot
ALTER TABLE signalements
  ALTER COLUMN photo_url DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS date_resolution TIMESTAMPTZ;

-- Mise à jour de la table plannings
DO $$ BEGIN
  ALTER TABLE plannings ALTER COLUMN statut TYPE "StatutPlanning" USING statut::"StatutPlanning";
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Migration statut planning déjà faite : %', SQLERRM;
END $$;

ALTER TABLE plannings
  ADD COLUMN IF NOT EXISTS titre VARCHAR(200),
  ALTER COLUMN notes DROP NOT NULL,
  ALTER COLUMN camion_assigne DROP NOT NULL;

-- Table des étapes de planning (quartier + heure de passage)
CREATE TABLE IF NOT EXISTS etapes_planning (
  id              BIGSERIAL PRIMARY KEY,
  planning_id     BIGINT NOT NULL REFERENCES plannings(id) ON DELETE CASCADE,
  localisation_id BIGINT NOT NULL REFERENCES localisations(id) ON DELETE CASCADE,
  heure_debut     VARCHAR(5) NOT NULL,   -- Format "HH:MM"
  heure_fin       VARCHAR(5) NOT NULL,   -- Format "HH:MM"
  ordre           INT NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des primes / récompenses
CREATE TABLE IF NOT EXISTS primes (
  id              BIGSERIAL PRIMARY KEY,
  citoyen_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  montant         DECIMAL(10, 2) NOT NULL,
  motif           TEXT NOT NULL,
  statut          "StatutPrime" NOT NULL DEFAULT 'en_attente',
  date_prime      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_versement  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des paramètres utilisateur (1 ligne par profil)
CREATE TABLE IF NOT EXISTS user_settings (
  id                  BIGSERIAL PRIMARY KEY,
  profile_id          UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  dark_mode           BOOLEAN NOT NULL DEFAULT FALSE,
  notifications_push  BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_email BOOLEAN NOT NULL DEFAULT FALSE,
  langue              VARCHAR(5) NOT NULL DEFAULT 'fr',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 3 — INDEX DE PERFORMANCE
-- (améliore la vitesse des requêtes fréquentes)
-- ============================================================

-- Signalements
CREATE INDEX IF NOT EXISTS idx_signalements_user_id    ON signalements(user_id);
CREATE INDEX IF NOT EXISTS idx_signalements_etat        ON signalements(etat);
CREATE INDEX IF NOT EXISTS idx_signalements_collecteur  ON signalements(collecteur_id);
CREATE INDEX IF NOT EXISTS idx_signalements_date        ON signalements(date_signalement DESC);

-- Plannings
CREATE INDEX IF NOT EXISTS idx_plannings_partenaire   ON plannings(partenaire_id);
CREATE INDEX IF NOT EXISTS idx_plannings_date         ON plannings(date_collecte);
CREATE INDEX IF NOT EXISTS idx_plannings_statut       ON plannings(statut);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_type          ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_localisation  ON profiles(localisation_id);

-- Collecteurs
CREATE INDEX IF NOT EXISTS idx_collecteurs_partenaire ON collecteurs(partenaire_id);

-- Primes
CREATE INDEX IF NOT EXISTS idx_primes_citoyen         ON primes(citoyen_id);
CREATE INDEX IF NOT EXISTS idx_primes_statut          ON primes(statut);

-- Étapes planning
CREATE INDEX IF NOT EXISTS idx_etapes_planning        ON etapes_planning(planning_id);
CREATE INDEX IF NOT EXISTS idx_etapes_localisation    ON etapes_planning(localisation_id);

-- Pivot signalement ↔ type déchet
CREATE INDEX IF NOT EXISTS idx_sig_type_signalement   ON signalement_type_dechet(signalement_id);
CREATE INDEX IF NOT EXISTS idx_sig_type_dechet        ON signalement_type_dechet(type_dechet_id);


-- ============================================================
-- SECTION 4 — ROW LEVEL SECURITY (RLS)
-- Supabase utilise RLS pour protéger les données côté BDD.
-- Ces politiques s'appliquent aux accès directs à Supabase.
-- Votre backend Node.js utilise le service_role qui bypass RLS.
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE localisations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE collecteurs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE depots                ENABLE ROW LEVEL SECURITY;
ALTER TABLE types_dechets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE signalements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE signalement_type_dechet ENABLE ROW LEVEL SECURITY;
ALTER TABLE plannings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapes_planning       ENABLE ROW LEVEL SECURITY;
ALTER TABLE primes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages         ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ────────────────────────────────────────────────
-- Un utilisateur peut lire son propre profil
CREATE POLICY IF NOT EXISTS "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Un utilisateur peut mettre à jour son propre profil
CREATE POLICY IF NOT EXISTS "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── LOCALISATIONS ────────────────────────────────────────────
-- Tous les utilisateurs authentifiés peuvent lire les localisations
CREATE POLICY IF NOT EXISTS "localisations_select_all"
  ON localisations FOR SELECT
  TO authenticated
  USING (true);

-- ── SIGNALEMENTS ────────────────────────────────────────────
-- Un citoyen voit uniquement ses propres signalements
CREATE POLICY IF NOT EXISTS "signalements_select_citoyen"
  ON signalements FOR SELECT
  USING (auth.uid() = user_id);

-- Un citoyen peut créer un signalement
CREATE POLICY IF NOT EXISTS "signalements_insert_citoyen"
  ON signalements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── PLANNINGS ────────────────────────────────────────────────
-- Lecture publique des plannings pour tous les authentifiés
CREATE POLICY IF NOT EXISTS "plannings_select_all"
  ON plannings FOR SELECT
  TO authenticated
  USING (true);

-- ── USER SETTINGS ────────────────────────────────────────────
-- Un utilisateur ne voit que ses propres paramètres
CREATE POLICY IF NOT EXISTS "settings_select_own"
  ON user_settings FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "settings_upsert_own"
  ON user_settings FOR ALL
  USING (auth.uid() = profile_id);

-- ── PRIMES ────────────────────────────────────────────────────
-- Un citoyen ne voit que ses propres primes
CREATE POLICY IF NOT EXISTS "primes_select_citoyen"
  ON primes FOR SELECT
  USING (auth.uid() = citoyen_id);

-- ── CHAT MESSAGES ────────────────────────────────────────────
-- Un utilisateur ne voit que ses propres messages
CREATE POLICY IF NOT EXISTS "chat_select_own"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "chat_insert_own"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- SECTION 5 — TRIGGER updated_at automatique
-- Met à jour le champ updated_at à chaque modification
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables avec updated_at
DO $$ DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'localisations', 'collecteurs', 'depots',
    'signalements', 'plannings', 'primes', 'user_settings'
  ] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%s_updated_at ON %s;
      CREATE TRIGGER trg_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;


-- ============================================================
-- FIN DU SCRIPT
-- Vérification : SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' ORDER BY table_name;
-- ============================================================
