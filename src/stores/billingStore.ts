import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanId } from '../lib/billing'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

type BillingState = {
  userPlans: Record<string, PlanId>
  getUserPlan: (userId: string | null) => PlanId
  setUserPlan: (userId: string, planId: PlanId) => Promise<void>
  syncUserPlan: (userId: string | null) => Promise<void>
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      userPlans: {},
      getUserPlan: (userId) => {
        if (!userId) return 'free'
        return get().userPlans[userId] ?? 'free'
      },
      setUserPlan: async (userId, planId) => {
        set((state) => ({
          userPlans: {
            ...state.userPlans,
            [userId]: planId,
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
          .select('plan')
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
        }))
      },
    }),
    {
      name: 'factuurstudio.local.billing',
    },
  ),
)
