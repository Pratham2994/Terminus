import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured = Boolean(url && key)

// Only the public URL and the publishable (anon) key live in the client.
// Row-level security in supabase/schema.sql keeps each user's rows private.
export const supabase = configured ? createClient(url, key) : null
