import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateReferralCode, REFERRAL_REWARD_THRESHOLD } from '../lib/referral'
import { useBillingStore } from './billingStore'

export type ReferralStatus = 'converted' | 'rewarded'

export type Referral = {
  id: string
  referrerId: string
  referredEmail: string
  referredUserId: string
  code: string
  createdAt: string
  status: ReferralStatus
}

type ReferralState = {
  referrals: Referral[]
  /** userId → referral-code */
  userCodes: Record<string, string>
  /** Geeft de bestaande code terug of genereert een nieuwe */
  getCode: (userId: string) => string
  /** Alle referrals van een specifieke referrer */
  getUserReferrals: (userId: string) => Referral[]
  /**
   * Verwerkt een succesvolle registratie via een referral-link.
   * Wisselt automatisch naar Pro als de reward-drempel bereikt is.
   */
  convertReferral: (referredUserId: string, referredEmail: string, code: string) => void
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      userCodes: {},

      getCode: (userId) => {
        const existing = get().userCodes[userId]
        if (existing) return existing
        const code = generateReferralCode()
        set((state) => ({ userCodes: { ...state.userCodes, [userId]: code } }))
        return code
      },

      getUserReferrals: (userId) => {
        return get().referrals.filter((r) => r.referrerId === userId)
      },

      convertReferral: (referredUserId, referredEmail, code) => {
        const normalizedCode = code.trim().toUpperCase()

        // Zoek de referrer op via zijn code
        const entry = Object.entries(get().userCodes).find(([, c]) => c === normalizedCode)
        if (!entry) return
        const [referrerId] = entry

        // Geen self-referral
        if (referrerId === referredUserId) return

        // Voorkom dubbelingen voor dezelfde referred user
        const alreadyExists = get().referrals.some((r) => r.referredUserId === referredUserId)
        if (alreadyExists) return

        const newReferral: Referral = {
          id: crypto.randomUUID(),
          referrerId,
          referredEmail,
          referredUserId,
          code: normalizedCode,
          createdAt: new Date().toISOString(),
          status: 'converted',
        }

        set((state) => ({ referrals: [...state.referrals, newReferral] }))

        // Controleer of de reward-drempel bereikt is
        const totalConverted = get().referrals.filter((r) => r.referrerId === referrerId).length

        if (totalConverted > 0 && totalConverted % REFERRAL_REWARD_THRESHOLD === 0) {
          // Markeer de oudste onbeloonde batch als 'rewarded'
          set((state) => {
            const unrewarded = state.referrals
              .filter((r) => r.referrerId === referrerId && r.status === 'converted')
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              .slice(0, REFERRAL_REWARD_THRESHOLD)
            const rewardIds = new Set(unrewarded.map((r) => r.id))
            return {
              referrals: state.referrals.map((r) =>
                rewardIds.has(r.id) ? { ...r, status: 'rewarded' as ReferralStatus } : r,
              ),
            }
          })

          // Ken gratis Pro-maand toe aan de referrer
          useBillingStore.getState().setUserPlan(referrerId, 'pro')
        }
      },
    }),
    {
      name: 'factuurstudio.local.referrals',
    },
  ),
)
