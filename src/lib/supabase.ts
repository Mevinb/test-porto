import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  role: string;
  image_url: string | null;
  tags: string[];
  certificate_url: string | null;
  created_at: string;
};
