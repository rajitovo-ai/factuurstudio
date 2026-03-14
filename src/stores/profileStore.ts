import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  upsertProfile: (userId: string, profile: CompanyProfile) => void
}

export const defaultCompanyProfile: CompanyProfile = {
  companyName: 'FactuurStudio Demo B.V.',
  address: '',
  kvkNumber: '',
  btwNumber: '',
  iban: '',
  logoDataUrl: null,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: {},
      upsertProfile: (userId, profile) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: profile,
          },
        }))
      },
    }),
    {
      name: 'factuurstudio.local.profiles',
    },
  ),
)
