import { create } from 'zustand'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export type CompanyProfile = {
  companyName: string
  address: string
  kvkNumber: string
  btwNumber: string
  iban: string
  logoDataUrl: string | null
}

type ProfileState = {
  profiles: Record<string, CompanyProfile>
  isLoading: boolean
  error: string | null
  loadProfile: (userId: string | null, force?: boolean) => Promise<void>
  upsertProfile: (userId: string, profile: CompanyProfile) => Promise<boolean>
  clearError: () => void
}

export const defaultCompanyProfile: CompanyProfile = {
  companyName: 'Mijn eerste bedrijf',
  address: '',
  kvkNumber: '',
  btwNumber: '',
  iban: '',
  logoDataUrl: null,
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: {},
  isLoading: false,
  error: null,

  loadProfile: async (userId, force = false) => {
    if (!userId || !hasSupabaseConfig) {
      return
    }

    if (!force && get().profiles[userId]) {
      return
    }

    set({ isLoading: true, error: null })

    const { data, error } = await supabase
      .from('profiles')
      .select('company_name, address, kvk_number, btw_number, iban, logo_url')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      set({ isLoading: false, error: error.message })
      return
    }

    const loadedProfile: CompanyProfile = {
      companyName: data?.company_name ?? defaultCompanyProfile.companyName,
      address: data?.address ?? '',
      kvkNumber: data?.kvk_number ?? '',
      btwNumber: data?.btw_number ?? '',
      iban: data?.iban ?? '',
      logoDataUrl: data?.logo_url ?? null,
    }

    set((state) => ({
      profiles: {
        ...state.profiles,
        [userId]: loadedProfile,
      },
      isLoading: false,
      error: null,
    }))
  },

  upsertProfile: async (userId, profile) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return false
    }

    const { error } = await supabase.from('profiles').upsert(
      {
        id: userId,
        company_name: profile.companyName,
        address: profile.address,
        kvk_number: profile.kvkNumber,
        btw_number: profile.btwNumber,
        iban: profile.iban,
        logo_url: profile.logoDataUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )

    if (error) {
      set({ error: error.message })
      return false
    }

    set((state) => ({
      profiles: {
        ...state.profiles,
        [userId]: profile,
      },
      error: null,
    }))

    return true
  },

  clearError: () => set({ error: null }),
}))
