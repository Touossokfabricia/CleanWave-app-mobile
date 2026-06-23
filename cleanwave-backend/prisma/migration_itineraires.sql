-- ============================================================
-- MIGRATION COMPLÉMENTAIRE — Itinéraires + localisation signalements
-- À exécuter dans Supabase SQL Editor après supabase_migration.sql
-- ============================================================

DO $$ BEGIN
  CREATE TYPE "StatutItineraire" AS ENUM ('brouillon', 'envoye', 'en_cours', 'termine', 'annule');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE signalements
  ADD COLUMN IF NOT EXISTS localisation_id BIGINT REFERENCES localisations(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS itineraires (
  id            BIGSERIAL PRIMARY KEY,
  partenaire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collecteur_id BIGINT NOT NULL REFERENCES collecteurs(id) ON DELETE CASCADE,
  planning_id   BIGINT REFERENCES plannings(id) ON DELETE SET NULL,
  titre         VARCHAR(200) NOT NULL,
  description   TEXT,
  date_debut    DATE NOT NULL,
  statut        "StatutItineraire" NOT NULL DEFAULT 'brouillon',
  date_envoi    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itineraire_stops (
  id              BIGSERIAL PRIMARY KEY,
  itineraire_id   BIGINT NOT NULL REFERENCES itineraires(id) ON DELETE CASCADE,
  localisation_id BIGINT REFERENCES localisations(id) ON DELETE SET NULL,
  depot_id        BIGINT REFERENCES depots(id) ON DELETE SET NULL,
  ordre           INT NOT NULL DEFAULT 0,
  heure_passage   VARCHAR(5),
  notes           TEXT,
  est_valide      BOOLEAN NOT NULL DEFAULT FALSE,
  date_validation TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itineraires_collecteur ON itineraires(collecteur_id);
CREATE INDEX IF NOT EXISTS idx_itineraire_stops_itineraire ON itineraire_stops(itineraire_id);
