import { useCallback, useEffect, useState } from 'react'
import { supabase, UPLOADER_EMAIL } from '../lib/supabase'

// Tracks whether this browser has unlocked uploads with the shared password.
// Supabase keeps the session in localStorage, so it stays unlocked on reload.
export function useUploader() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setIsUnlocked(Boolean(data.session)))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setIsUnlocked(Boolean(session)))
    return () => data.subscription.unsubscribe()
  }, [])

  // Returns an error message, or null on success.
  const unlock = useCallback(async (password) => {
    if (!supabase) return 'Uploads are not set up yet.'
    const { error } = await supabase.auth.signInWithPassword({ email: UPLOADER_EMAIL, password })
    return error ? 'Wrong password — try again.' : null
  }, [])

  const lock = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return { isUnlocked, unlock, lock }
}
