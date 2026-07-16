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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events (public portfolio)
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (true);

-- Allow any authenticated or service-role operation (for the admin CMS)
CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (true) WITH CHECK (true);
