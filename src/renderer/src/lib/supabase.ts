import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://bdlfiqxrfdveltudtudn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbGZpcXhyZmR2ZWx0dWR0dWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDg0ODIsImV4cCI6MjA5ODQ4NDQ4Mn0.fl2x-PL2Sjm8bAh_eIXaX6Aom5tZQCDa3IE_hOjENeo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
})
