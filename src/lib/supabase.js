import { createClient } from '@supabase/supabase-js'

// Public project settings (safe to ship in the browser — access is enforced by
// the row-level-security rules in supabase/setup.sql). Set in .env.local for
// dev and as GitHub repository variables for the deployed site.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The one shared login people unlock uploads with; they only type its password.
export const UPLOADER_EMAIL = import.meta.env.VITE_UPLOADER_EMAIL

export const PHOTO_BUCKET = 'photos'

export const isConfigured = Boolean(url && anonKey && UPLOADER_EMAIL)

export const supabase = isConfigured ? createClient(url, anonKey) : null
