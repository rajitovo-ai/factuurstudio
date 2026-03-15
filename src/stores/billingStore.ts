import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanId } from '../lib/billing'

type BillingState = {
  userPlans: Record<string, PlanId>
  getUserPlan: (userId: string | null) => PlanId
  setUserPlan: (userId: string, planId: PlanId) => void
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      userPlans: {},
      getUserPlan: (userId) => {
        if (!userId) return 'free'
        return get().userPlans[userId] ?? 'free'
      },
      setUserPlan: (userId, planId) => {
        set((state) => ({
          userPlans: {
            ...state.userPlans,
            [userId]: planId,
          },
        }))
      },
    }),
    {
      name: 'factuurstudio.local.billing',
    },
  ),
)
