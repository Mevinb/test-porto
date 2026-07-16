// Run this once to set up your Supabase database tables
// Usage: node setup-db.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:mevinbenty12+@db.wmaspcohjxlqazgbelvv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

const SQL = `
  CREATE TABLE IF NOT EXISTS events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    event_date date NOT NULL,
    location text,
    role text,
    image_url text,
    tags text[] DEFAULT '{}',
    certificate_url text,
    created_at timestamptz DEFAULT now()
  );

  -- Enable Row Level Security
  ALTER TABLE events ENABLE ROW LEVEL SECURITY;

  -- Allow public read (anyone can view your events)
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_public_read'
    ) THEN
      CREATE POLICY events_public_read ON events FOR SELECT USING (true);
    END IF;
  END $$;

  -- Allow authenticated users (you, via service role) to manage events
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_admin_all'
    ) THEN
      CREATE POLICY events_admin_all ON events USING (true) WITH CHECK (true);
    END IF;
  END $$;
`;

try {
  await client.connect();
  console.log('✅ Connected to Supabase PostgreSQL');
  await client.query(SQL);
  console.log('✅ Events table created (or already exists)');
  console.log('✅ RLS policies configured');
  await client.end();
  console.log('\n🎉 Database setup complete!');
  console.log('\nNext step: Add your Supabase anon key to .env.local:');
  console.log('  VITE_SUPABASE_ANON_KEY=<your-anon-key>');
  console.log('  (Get it from: https://supabase.com/dashboard/project/wmaspcohjxlqazgbelvv/settings/api)');
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
