-- Set search path to the app schema
SET search_path TO echoes, public;

-- Enable extensions (in public schema)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Immutable unaccent wrapper for indexes
CREATE OR REPLACE FUNCTION f_unaccent(text)
RETURNS text AS $$
  SELECT public.unaccent('public.unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_quotes_body_fts ON quotes
  USING GIN (to_tsvector('portuguese', f_unaccent(body)));

CREATE INDEX IF NOT EXISTS idx_authors_name_fts ON authors
  USING GIN (to_tsvector('portuguese', f_unaccent(name)));

CREATE INDEX IF NOT EXISTS idx_categories_title_fts ON categories
  USING GIN (to_tsvector('portuguese', f_unaccent(title)));

-- Trigram indexes (fuzzy matching)
CREATE INDEX IF NOT EXISTS idx_quotes_body_trgm ON quotes
  USING GIN (f_unaccent(body) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_authors_name_trgm ON authors
  USING GIN (f_unaccent(name) gin_trgm_ops);
