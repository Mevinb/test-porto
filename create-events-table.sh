#!/bin/bash
# Run this script ONCE to create the events table in your Supabase project.
# You need your Personal Access Token (PAT) from:
#   https://supabase.com/dashboard/account/tokens
#
# Usage: PAT=your_pat_here bash create-events-table.sh

PAT="${PAT:-}"

if [ -z "$PAT" ]; then
  echo "❌  Error: PAT environment variable not set."
  echo "    Get your PAT from: https://supabase.com/dashboard/account/tokens"
  echo "    Then run: PAT=your_token bash create-events-table.sh"
  exit 1
fi

SQL='
CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text,
  role text DEFAULT '"'"'Participant'"'"',
  image_url text,
  tags text[] DEFAULT '"'"'{}'"'"',
  certificate_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='"'"'events'"'"' AND policyname='"'"'events_public_read'"'"') THEN
    CREATE POLICY events_public_read ON events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='"'"'events'"'"' AND policyname='"'"'events_admin_all'"'"') THEN
    CREATE POLICY events_admin_all ON events FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
'

RESPONSE=$(curl -s -X POST \
  "https://api.supabase.com/v1/projects/wmaspcohjxlqazgbelvv/database/query" \
  -H "Authorization: Bearer $PAT" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}")

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"error"'; then
  echo "❌  Migration failed. Check the error above."
else
  echo "✅  Events table created successfully!"
fi
