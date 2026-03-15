import { create } from 'zustand'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { useBillingStore } from './billingStore'
import { useReferralStore } from './referralStore'

type DemoUser = {
  id: string
  email: string
  password: string
}

const DEMO_USERS_KEY = 'factuurstudio.demo.users'
const DEMO_SESSION_KEY = 'factuurstudio.demo.session'

const getDemoUsers = (): DemoUser[] => {
  if (typeof window === 'undefined') return []

  const rawUsers = window.localStorage.getItem(DEMO_USERS_KEY)
  if (!rawUsers) return []

  try {
    return JSON.parse(rawUsers) as DemoUser[]
  } catch {
    return []
  }
}

const setDemoUsers = (users: DemoUser[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

const getDemoSession = () => {
  if (typeof window === 'undefined') return null

  const rawSession = window.localStorage.getItem(DEMO_SESSION_KEY)
  if (!rawSession) return null

  try {
    return JSON.parse(rawSession) as Pick<DemoUser, 'id' | 'email'>
  } catch {
    return null
  }
}

const setDemoSession = (user: Pick<DemoUser, 'id' | 'email'> | null) => {
  if (typeof window === 'undefined') return

  if (!user) {
    window.localStorage.removeItem(DEMO_SESSION_KEY)
    return
  }

  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
}

type AuthState = {
  userId: string | null
  email: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemoMode: boolean
  error: string | null
  init: () => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  clearError: () => void
}

let authListenerInitialized = false

const syncPostAuthData = async (userId: string | null, email: string | null) => {
  if (!userId) return

  await Promise.all([
    useBillingStore.getState().syncUserPlan(userId),
    useReferralStore.getState().syncUserData(userId),
  ])

  await useReferralStore.getState().processPendingReferral(userId, email)
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  isLoading: true,
  isAuthenticated: false,
  isDemoMode: !hasSupabaseConfig,
  error: null,

  init: async () => {
    if (!hasSupabaseConfig) {
      const session = getDemoSession()
      set({
        userId: session?.id ?? null,
        email: session?.email ?? null,
        isAuthenticated: !!session,
        isLoading: false,
        isDemoMode: true,
      })
      return
    }

    if (!authListenerInitialized) {
      supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user
        set({
          userId: user?.id ?? null,
          email: user?.email ?? null,
          isAuthenticated: !!user,
          isLoading: false,
          isDemoMode: false,
        })

        if (user?.id) {
          void syncPostAuthData(user.id, user.email ?? null)
        }
      })
      authListenerInitialized = true
    }

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user

    set({
      userId: user?.id ?? null,
      email: user?.email ?? null,
      isAuthenticated: !!user,
      isLoading: false,
      isDemoMode: false,
    })

    if (user?.id) {
      await syncPostAuthData(user.id, user.email ?? null)
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })

    if (!hasSupabaseConfig) {
      const user = getDemoUsers().find((entry) => entry.email === email && entry.password === password)

      if (!user) {
        set({ isLoading: false, error: 'Onjuiste inloggegevens voor lokale demo.' })
        return false
      }

      setDemoSession({ id: user.id, email: user.email })
      set({
        userId: user.id,
        email: user.email,
        isAuthenticated: true,
        isLoading: false,
        isDemoMode: true,
        error: null,
      })
      return true
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }

    set({ isLoading: false, error: null })
    return true
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null })

    if (!hasSupabaseConfig) {
      const users = getDemoUsers()
      const existingUser = users.find((entry) => entry.email === email)

      if (existingUser) {
        set({ isLoading: false, error: 'Er bestaat al een lokaal demo-account met dit e-mailadres.' })
        return false
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
      }

      setDemoUsers([...users, newUser])
      setDemoSession({ id: newUser.id, email: newUser.email })
      set({
        userId: newUser.id,
        email: newUser.email,
        isAuthenticated: true,
        isLoading: false,
        isDemoMode: true,
        error: null,
      })
      return true
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }

    set({ isLoading: false, error: null })

    if (data.user?.id) {
      await syncPostAuthData(data.user.id, data.user.email ?? email)
    }

    return true
  },

  signOut: async () => {
    if (!hasSupabaseConfig) {
      setDemoSession(null)
      set({
        userId: null,
        email: null,
        isAuthenticated: false,
        isLoading: false,
        isDemoMode: true,
        error: null,
      })
      return
    }

    await supabase.auth.signOut()
    set({
      userId: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      isDemoMode: false,
      error: null,
    })
  },

  clearError: () => set({ error: null }),
}))
