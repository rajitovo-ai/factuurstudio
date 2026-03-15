import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateReferralCode, REFERRAL_REWARD_THRESHOLD } from '../lib/referral'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
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
  /** userId → lokaal gesimuleerde referral conversies (alleen dev UI) */
  devSimulatedConversions: Record<string, number>
  isSyncing: boolean
  /** Geeft de bestaande code terug of genereert een nieuwe */
  getCode: (userId: string) => string
  /** Alle referrals van een specifieke referrer */
  getUserReferrals: (userId: string) => Referral[]
  getDevSimulatedConversions: (userId: string) => number
  addDevSimulatedConversions: (userId: string, amount?: number) => void
  resetDevSimulatedConversions: (userId: string) => void
  /** Haalt code + referrals op uit Supabase */
  syncUserData: (userId: string | null) => Promise<void>
  /** Slaat referral-code tijdelijk op tot account/sessie beschikbaar is */
  setPendingReferralCode: (code: string | null) => void
  /** Verwerkt een pending referral-code op ingelogde gebruiker */
  processPendingReferral: (userId: string | null, email: string | null) => Promise<void>
  /**
   * Verwerkt een succesvolle registratie via een referral-link.
   * Wisselt automatisch naar Pro als de reward-drempel bereikt is.
   */
  convertReferral: (referredUserId: string, referredEmail: string, code: string) => Promise<void>
}

const PENDING_REFERRAL_KEY = 'factuurstudio.pending.referralCode'

const getPendingReferralCode = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(PENDING_REFERRAL_KEY)
}

const setPendingReferralCodeStorage = (code: string | null) => {
  if (typeof window === 'undefined') return
  if (!code) {
    window.localStorage.removeItem(PENDING_REFERRAL_KEY)
    return
  }
  window.localStorage.setItem(PENDING_REFERRAL_KEY, code.trim().toUpperCase())
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      userCodes: {},
      devSimulatedConversions: {},
      isSyncing: false,

      getCode: (userId) => {
        const existing = get().userCodes[userId]
        if (existing) return existing

        if (hasSupabaseConfig) {
          return ''
        }

        const code = generateReferralCode()
        set((state) => ({ userCodes: { ...state.userCodes, [userId]: code } }))
        return code
      },

      getUserReferrals: (userId) => {
        return get().referrals.filter((r) => r.referrerId === userId)
      },

      getDevSimulatedConversions: (userId) => {
        return get().devSimulatedConversions[userId] ?? 0
      },

      addDevSimulatedConversions: (userId, amount = 1) => {
        const safeAmount = Number.isFinite(amount) ? Math.max(1, Math.floor(amount)) : 1
        set((state) => ({
          devSimulatedConversions: {
            ...state.devSimulatedConversions,
            [userId]: (state.devSimulatedConversions[userId] ?? 0) + safeAmount,
          },
        }))
      },

      resetDevSimulatedConversions: (userId) => {
        set((state) => ({
          devSimulatedConversions: {
            ...state.devSimulatedConversions,
            [userId]: 0,
          },
        }))
      },

      setPendingReferralCode: (code) => {
        setPendingReferralCodeStorage(code)
      },

      syncUserData: async (userId) => {
        if (!userId || !hasSupabaseConfig) {
          return
        }

        set({ isSyncing: true })

        try {
          const codeResponse = await supabase
            .from('referral_codes')
            .select('code')
            .eq('user_id', userId)
            .maybeSingle()

          if (codeResponse.error) {
            console.error('Kon referral-code niet ophalen:', codeResponse.error.message)
          }

          let userCode = codeResponse.data?.code ?? null

          if (!userCode) {
            for (let attempts = 0; attempts < 6; attempts += 1) {
              const generated = generateReferralCode()
              const insertResponse = await supabase.from('referral_codes').insert({
                user_id: userId,
                code: generated,
              })

              if (!insertResponse.error) {
                userCode = generated
                break
              }

              const duplicateCode = insertResponse.error.code === '23505'
              if (!duplicateCode) {
                console.error('Kon referral-code niet aanmaken:', insertResponse.error.message)
                break
              }
            }
          }

          if (userCode) {
            set((state) => ({
              userCodes: {
                ...state.userCodes,
                [userId]: userCode,
              },
            }))
          }

          const referralsResponse = await supabase
            .from('referrals')
            .select('id, referrer_id, referred_email, referred_user_id, code, created_at, status')
            .eq('referrer_id', userId)
            .order('created_at', { ascending: false })

          if (referralsResponse.error) {
            console.error('Kon referrals niet ophalen:', referralsResponse.error.message)
            return
          }

          const remoteReferrals: Referral[] = (referralsResponse.data ?? []).map((row) => ({
            id: row.id,
            referrerId: row.referrer_id,
            referredEmail: row.referred_email,
            referredUserId: row.referred_user_id,
            code: row.code,
            createdAt: row.created_at,
            status: row.status === 'rewarded' ? 'rewarded' : 'converted',
          }))

          set((state) => {
            const otherUsers = state.referrals.filter((r) => r.referrerId !== userId)
            return {
              referrals: [...otherUsers, ...remoteReferrals],
            }
          })
        } finally {
          set({ isSyncing: false })
        }
      },

      processPendingReferral: async (userId, email) => {
        if (!userId || !email) {
          return
        }

        const pendingCode = getPendingReferralCode()
        if (!pendingCode) {
          return
        }

        await get().convertReferral(userId, email, pendingCode)
        setPendingReferralCodeStorage(null)
      },

      convertReferral: async (referredUserId, referredEmail, code) => {
        const normalizedCode = code.trim().toUpperCase()

        if (hasSupabaseConfig) {
          const { error } = await supabase.rpc('apply_referral', {
            p_referred_email: referredEmail,
            p_referred_user_id: referredUserId,
            p_code: normalizedCode,
            p_threshold: REFERRAL_REWARD_THRESHOLD,
          })

          if (error) {
            console.error('Kon referral niet verwerken in Supabase:', error.message)
            return
          }

          await get().syncUserData(referredUserId)
          await useBillingStore.getState().syncUserPlan(referredUserId)
          return
        }

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
          void useBillingStore.getState().setUserPlan(referrerId, 'pro')
        }
      },
    }),
    {
      name: 'factuurstudio.local.referrals',
    },
  ),
)
