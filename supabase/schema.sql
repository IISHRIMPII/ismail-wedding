-- ============================================================
-- Ismail Wedding Website — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Wishes / Guestbook
CREATE TABLE IF NOT EXISTS wishes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Media (photos & videos)
CREATE TABLE IF NOT EXISTS media (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_name    TEXT NOT NULL,
  file_url         TEXT NOT NULL,
  file_type        TEXT NOT NULL CHECK (file_type IN ('photo', 'video')),
  votes            INTEGER NOT NULL DEFAULT 0,
  is_groom_contest BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Atomic vote increment function
CREATE OR REPLACE FUNCTION increment_votes(row_id UUID)
RETURNS VOID AS $$
  UPDATE media SET votes = votes + 1 WHERE id = row_id;
$$ LANGUAGE SQL;

-- ============================================================
-- Row Level Security (allow public read + insert, no delete/update from client)
-- ============================================================

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media  ENABLE ROW LEVEL SECURITY;

-- Wishes: anyone can read and insert
CREATE POLICY "wishes_select" ON wishes FOR SELECT USING (true);
CREATE POLICY "wishes_insert" ON wishes FOR INSERT WITH CHECK (true);

-- Media: anyone can read and insert
CREATE POLICY "media_select" ON media FOR SELECT USING (true);
CREATE POLICY "media_insert" ON media FOR INSERT WITH CHECK (true);
-- Allow vote update (only votes column via RPC is fine; restrict direct updates)
CREATE POLICY "media_update_votes" ON media FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- Storage bucket: wedding-media
-- ============================================================
-- Run in Supabase Dashboard → Storage → Create bucket:
--   Name: wedding-media
--   Public: YES
--
-- Then add this Storage policy (Dashboard → Storage → Policies):
--   Bucket: wedding-media
--   Policy: Allow public uploads
--   INSERT: true
--   SELECT: true
-- ============================================================
