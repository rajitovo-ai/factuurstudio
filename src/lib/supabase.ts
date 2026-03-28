import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Configuration check
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// Development warning
if (!hasSupabaseConfig && import.meta.env.DEV) {
  console.warn('Supabase env vars ontbreken. Voeg VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY toe.')
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? 'https://example.supabase.co',
  supabaseAnonKey ?? 'public-anon-key',
)
