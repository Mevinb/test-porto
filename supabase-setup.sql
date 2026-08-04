-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wmaspcohjxlqazgbelvv/sql/new

CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text,
  role text DEFAULT 'Participant',
  image_url text,
  tags text[] DEFAULT '{}',
  certificate_url text,
  created_at timestamptz DEFAULT now()
);

-- Create the public bucket used by the admin event image uploader.
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- These policies are intentionally scoped to this bucket. The CMS currently
-- uses the Supabase anon key, so the admin password protects the UI entrypoint.
DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "event_images_anon_upload" ON storage.objects;
DROP POLICY IF EXISTS "event_images_anon_update" ON storage.objects;
DROP POLICY IF EXISTS "event_images_anon_delete" ON storage.objects;

CREATE POLICY "event_images_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'event-images');

CREATE POLICY "event_images_anon_upload" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "event_images_anon_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'event-images')
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "event_images_anon_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'event-images');

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events (public portfolio)
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (true);

-- The browser admin page uses the anon key, so writes are protected by the
-- admin password in the UI. Tighten these policies before using this in a
-- public production deployment with an auth-backed admin account.
CREATE POLICY "events_admin_insert" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "events_admin_update" ON events
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "events_admin_delete" ON events
  FOR DELETE USING (true);
