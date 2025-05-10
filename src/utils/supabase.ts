import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined. Please connect to Supabase by clicking the "Connect to Supabase" button in the top right.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined. Please connect to Supabase by clicking the "Connect to Supabase" button in the top right.');
}

export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);