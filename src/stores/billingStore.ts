import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanId } from '../lib/billing'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

type BillingDetails = {
  plan: PlanId
  stripeStatus: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

type BillingState = {
  userPlans: Record<string, PlanId>
  userBillingDetails: Record<string, BillingDetails>
  getUserPlan: (userId: string | null) => PlanId
  getUserBillingDetails: (userId: string | null) => BillingDetails
  setUserPlan: (userId: string, planId: PlanId) => Promise<void>
  syncUserPlan: (userId: string | null) => Promise<void>
}

const defaultBillingDetails: BillingDetails = {
  plan: 'free',
  stripeStatus: 'inactive',
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      userPlans: {},
      userBillingDetails: {},
      getUserPlan: (userId) => {
        if (!userId) return 'free'
        return get().userPlans[userId] ?? 'free'
      },
      getUserBillingDetails: (userId) => {
        if (!userId) return defaultBillingDetails
        return get().userBillingDetails[userId] ?? defaultBillingDetails
      },
      setUserPlan: async (userId, planId) => {
        set((state) => ({
          userPlans: {
            ...state.userPlans,
            [userId]: planId,
          },
          userBillingDetails: {
            ...state.userBillingDetails,
            [userId]: {
              ...(state.userBillingDetails[userId] ?? defaultBillingDetails),
              plan: planId,
            },
          },
        }))

        if (!hasSupabaseConfig) {
          return
        }

        const { error } = await supabase
          .from('subscriptions')
          .upsert({ user_id: userId, plan: planId }, { onConflict: 'user_id' })

        if (error) {
          console.error('Kon abonnement niet opslaan in Supabase:', error.message)
        }
      },
      syncUserPlan: async (userId) => {
        if (!userId || !hasSupabaseConfig) {
          return
        }

        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan, stripe_status, current_period_end, cancel_at_period_end')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) {
          console.error('Kon abonnement niet ophalen uit Supabase:', error.message)
          return
        }

        const plan = data?.plan === 'pro' ? 'pro' : 'free'
        set((state) => ({
          userPlans: {
            ...state.userPlans,
            [userId]: plan,
          },
          userBillingDetails: {
            ...state.userBillingDetails,
            [userId]: {
              plan,
              stripeStatus: data?.stripe_status ?? 'inactive',
              currentPeriodEnd: data?.current_period_end ?? null,
              cancelAtPeriodEnd: Boolean(data?.cancel_at_period_end),
            },
          },
        }))
      },
    }),
    {
      name: 'factuurstudio.local.billing',
    },
  ),
)
