import type { StoredInvoice } from '../stores/invoiceStore'

export type PlanId = 'free' | 'pro'

export type PlanConfig = {
  id: PlanId
  name: string
  monthlyInvoiceLimit: number | null
  features: {
    emailSending: boolean
    removeBranding: boolean
    automaticReminders: boolean
    customerManagement: boolean
    exports: boolean
  }
}

export const PLAN_CONFIGS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyInvoiceLimit: 5,
    features: {
      emailSending: false,
      removeBranding: false,
      automaticReminders: false,
      customerManagement: false,
      exports: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyInvoiceLimit: null,
    features: {
      emailSending: true,
      removeBranding: true,
      automaticReminders: true,
      customerManagement: true,
      exports: true,
    },
  },
}

export const getCurrentMonthInvoiceCount = (invoices: StoredInvoice[], userId: string | null) => {
  if (!userId) return 0

  const currentMonth = new Date().toISOString().slice(0, 7)
  return invoices.filter((invoice) => invoice.userId === userId && invoice.issueDate.startsWith(currentMonth))
    .length
}

export const canCreateInvoiceThisMonth = (
  planId: PlanId,
  invoices: StoredInvoice[],
  userId: string | null,
) => {
  const config = PLAN_CONFIGS[planId]
  const usedThisMonth = getCurrentMonthInvoiceCount(invoices, userId)

  if (config.monthlyInvoiceLimit === null) {
    return {
      allowed: true,
      usedThisMonth,
      limit: null,
      remaining: null,
    }
  }

  const remaining = Math.max(0, config.monthlyInvoiceLimit - usedThisMonth)
  return {
    allowed: usedThisMonth < config.monthlyInvoiceLimit,
    usedThisMonth,
    limit: config.monthlyInvoiceLimit,
    remaining,
  }
}
