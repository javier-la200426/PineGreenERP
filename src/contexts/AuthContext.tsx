import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase, UserRole } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
}

interface AuthContextType {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ])
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const t0 = performance.now()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single()
    console.log(`[AuthContext] fetchProfile ${(performance.now() - t0).toFixed(0)}ms`, error ?? data)
    if (error) return null
    return data as Profile
  }, [])

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION from localStorage immediately (no network call).
    // Token refresh (if needed) happens in the background and fires TOKEN_REFRESHED later.
    // This avoids the ~5s blocking delay from getSession() which waits for token refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`[AuthContext] onAuthStateChange: ${event}`)
        setSession(newSession)

        if (event === 'INITIAL_SESSION') {
          // Page load / reload — fetch profile then unblock routing
          if (newSession?.user) {
            const p = await withTimeout(fetchProfile(newSession.user.id), 5000)
            setProfile(p)
          }
          setIsLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
        // SIGNED_IN and TOKEN_REFRESHED are ignored here —
        // signIn/signUp already set the profile eagerly.
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  async function signIn(email: string, password: string) {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password: trimmedPassword })
    if (error) {
      console.error('[AuthContext] signIn error:', error.message, error.status)
      return { error: error.message }
    }

    if (data.session) {
      setSession(data.session)
      const p = await withTimeout(fetchProfile(data.session.user.id), 5000)
      setProfile(p)
    }

    return { error: null }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: {
        data: { full_name: fullName, role: 'client' },
      },
    })
    if (error) return { error: error.message }

    if (data.session) {
      setSession(data.session)
      const p = await withTimeout(fetchProfile(data.session.user.id), 5000)
      setProfile(p)
    }

    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ session, profile, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
