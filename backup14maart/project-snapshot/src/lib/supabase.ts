import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
  // Keep this warning in dev to avoid silent auth failures.
  console.warn('Supabase env vars ontbreken. Voeg VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY toe.')
}

export const supabase = createClient(
  supabaseUrl ?? 'https://example.supabase.co',
  supabaseAnonKey ?? 'public-anon-key',
)
