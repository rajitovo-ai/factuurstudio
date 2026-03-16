import { create } from 'zustand'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export type InvoiceStatus = 'concept' | 'verzonden' | 'betaald' | 'vervallen'
export type PricingMode = 'excl' | 'incl'

export type StoredInvoiceLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

export type StoredInvoice = {
  id: string
  userId: string
  invoiceNumber: string
  companyName: string
  logoDataUrl?: string | null
  clientName: string
  clientEmail: string
  issueDate: string
  dueDate: string
  currencyCode: string
  pricingMode: PricingMode
  subtotal: number
  vatTotal: number
  total: number
  status: InvoiceStatus
  lines: StoredInvoiceLine[]
  createdAt: string
}

type CreateInvoiceInput = Omit<StoredInvoice, 'id' | 'createdAt'>
type UpdateInvoiceInput = Omit<StoredInvoice, 'id' | 'userId' | 'status' | 'createdAt'>

type DbInvoiceRow = {
  id: string
  user_id: string
  invoice_number: string
  company_name: string
  logo_data_url: string | null
  client_name: string
  client_email: string
  issue_date: string
  due_date: string
  currency_code: string
  pricing_mode: PricingMode
  subtotal: number
  vat_total: number
  total: number
  status: InvoiceStatus
  lines: unknown
  created_at: string
}

const toStoredInvoice = (row: DbInvoiceRow): StoredInvoice => ({
  id: row.id,
  userId: row.user_id,
  invoiceNumber: row.invoice_number,
  companyName: row.company_name,
  logoDataUrl: row.logo_data_url,
  clientName: row.client_name,
  clientEmail: row.client_email,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  currencyCode: row.currency_code,
  pricingMode: row.pricing_mode,
  subtotal: Number(row.subtotal),
  vatTotal: Number(row.vat_total),
  total: Number(row.total),
  status: row.status,
  lines: Array.isArray(row.lines) ? (row.lines as StoredInvoiceLine[]) : [],
  createdAt: row.created_at,
})

type InvoiceState = {
  invoices: StoredInvoice[]
  isLoading: boolean
  error: string | null
  loadedForUserId: string | null
  loadInvoices: (userId: string | null, force?: boolean) => Promise<void>
  createInvoice: (invoice: CreateInvoiceInput) => Promise<boolean>
  updateInvoice: (invoiceId: string, update: UpdateInvoiceInput) => Promise<boolean>
  removeInvoice: (invoiceId: string) => Promise<boolean>
  markInvoiceSent: (invoiceId: string) => Promise<boolean>
  markInvoicePaid: (invoiceId: string) => Promise<boolean>
  clearError: () => void
}

export const getInvoiceDisplayStatus = (invoice: StoredInvoice): InvoiceStatus => {
  if (invoice.status === 'concept') {
    return 'concept'
  }

  if (invoice.status === 'betaald') {
    return 'betaald'
  }

  const today = new Date().toISOString().slice(0, 10)
  if (invoice.dueDate < today) {
    return 'vervallen'
  }

  return 'verzonden'
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,
  loadedForUserId: null,

  loadInvoices: async (userId, force = false) => {
    if (!userId || !hasSupabaseConfig) {
      set({ invoices: [], loadedForUserId: userId, isLoading: false })
      return
    }

    if (!force && get().loadedForUserId === userId && get().invoices.length > 0) {
      return
    }

    set({ isLoading: true, error: null })

    const { data, error } = await supabase
      .from('app_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      set({ isLoading: false, error: error.message })
      return
    }

    set({
      invoices: (data ?? []).map((row) => toStoredInvoice(row as DbInvoiceRow)),
      loadedForUserId: userId,
      isLoading: false,
      error: null,
    })
  },

  createInvoice: async (invoice) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return false
    }

    const payload = {
      user_id: invoice.userId,
      invoice_number: invoice.invoiceNumber,
      company_name: invoice.companyName,
      logo_data_url: invoice.logoDataUrl ?? null,
      client_name: invoice.clientName,
      client_email: invoice.clientEmail,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      currency_code: invoice.currencyCode,
      pricing_mode: invoice.pricingMode,
      subtotal: invoice.subtotal,
      vat_total: invoice.vatTotal,
      total: invoice.total,
      status: invoice.status,
      lines: invoice.lines,
    }

    const { data, error } = await supabase
      .from('app_invoices')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const created = toStoredInvoice(data as DbInvoiceRow)
    set((state) => ({ invoices: [created, ...state.invoices], error: null }))
    return true
  },

  updateInvoice: async (invoiceId, update) => {
    const existing = get().invoices.find((invoice) => invoice.id === invoiceId)
    if (!existing || existing.status !== 'concept') return false

    const payload = {
      invoice_number: update.invoiceNumber,
      company_name: update.companyName,
      logo_data_url: update.logoDataUrl ?? null,
      client_name: update.clientName,
      client_email: update.clientEmail,
      issue_date: update.issueDate,
      due_date: update.dueDate,
      currency_code: update.currencyCode,
      pricing_mode: update.pricingMode,
      subtotal: update.subtotal,
      vat_total: update.vatTotal,
      total: update.total,
      lines: update.lines,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('app_invoices')
      .update(payload)
      .eq('id', invoiceId)
      .eq('status', 'concept')
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const updatedInvoice = toStoredInvoice(data as DbInvoiceRow)
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === invoiceId ? updatedInvoice : invoice)),
      error: null,
    }))

    return true
  },

  removeInvoice: async (invoiceId) => {
    const existing = get().invoices.find((invoice) => invoice.id === invoiceId)
    if (!existing || existing.status !== 'concept') return false

    const { error } = await supabase
      .from('app_invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('status', 'concept')

    if (error) {
      set({ error: error.message })
      return false
    }

    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== invoiceId),
      error: null,
    }))

    return true
  },

  markInvoiceSent: async (invoiceId) => {
    const existing = get().invoices.find((invoice) => invoice.id === invoiceId)
    if (!existing || existing.status !== 'concept') return false

    const { data, error } = await supabase
      .from('app_invoices')
      .update({ status: 'verzonden', updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
      .eq('status', 'concept')
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const updatedInvoice = toStoredInvoice(data as DbInvoiceRow)
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === invoiceId ? updatedInvoice : invoice)),
      error: null,
    }))

    return true
  },

  markInvoicePaid: async (invoiceId) => {
    const existing = get().invoices.find((invoice) => invoice.id === invoiceId)
    if (!existing || existing.status === 'concept' || existing.status === 'betaald') return false

    const { data, error } = await supabase
      .from('app_invoices')
      .update({ status: 'betaald', updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
      .neq('status', 'concept')
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const updatedInvoice = toStoredInvoice(data as DbInvoiceRow)
    set((state) => ({
      invoices: state.invoices.map((invoice) => (invoice.id === invoiceId ? updatedInvoice : invoice)),
      error: null,
    }))

    return true
  },

  clearError: () => set({ error: null }),
}))
