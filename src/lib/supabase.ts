import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '') as string;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '') as string;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'placeholder-anon-key'
);

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'placeholder-anon-key'
);

export const storageBucket = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'event-images') as string;

export function getPublicAssetUrl(path: string) {
  return supabase.storage.from(storageBucket).getPublicUrl(path).data.publicUrl;
}

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
