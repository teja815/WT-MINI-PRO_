import { createClient } from '@supabase/supabase-js'

let supabase

export function initSupabase() {
  if (supabase) return supabase

  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    // do not throw — allow server to start without Supabase if not configured
    // eslint-disable-next-line no-console
    console.warn('Supabase not configured: missing SUPABASE_URL or SUPABASE_ANON_KEY')
    return null
  }

  supabase = createClient(url, anonKey)
  return supabase
}

export function getSupabase() {
  return supabase
}
