import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase URL or Publishable Key missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local'
  );
}

// Client initialized using public publishable/anon key only (never service_role)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
