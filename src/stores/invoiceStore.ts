import { create } from 'zustand'
import { trackEvent } from '../lib/analytics'
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
  clientContactName: string
  clientPhone: string
  clientAddress: string
  clientPostalCode: string
  clientCity: string
  clientCountry: string
  clientKvkNumber: string
  clientBtwNumber: string
  clientIban: string
  clientPaymentTermDays: number
  clientNotes: string
  invoiceDescription: string
  hasDueDate: boolean
  issueDate: string
  dueDate: string
  currencyCode: string
  pricingMode: PricingMode
  vatExemptionReason: string
  subtotal: number
  vatTotal: number
  total: number
  status: InvoiceStatus
  lines: StoredInvoiceLine[]
  isImported: boolean
  createdAt: string
}

type CreateInvoiceInput = Omit<StoredInvoice, 'id' | 'createdAt' | 'isImported' | 'vatExemptionReason'> & {
  isImported?: boolean
  vatExemptionReason?: string
}
type UpdateInvoiceInput = Omit<
  StoredInvoice,
  'id' | 'userId' | 'status' | 'createdAt' | 'isImported' | 'vatExemptionReason'
> & {
  vatExemptionReason?: string
}

type DbInvoiceRow = {
  id: string
  user_id: string
  invoice_number: string
  company_name: string
  logo_data_url: string | null
  client_name: string
  client_email: string
  client_contact_name: string | null
  client_phone: string | null
  client_address: string | null
  client_postal_code: string | null
  client_city: string | null
  client_country: string | null
  client_kvk_number: string | null
  client_btw_number: string | null
  client_iban: string | null
  client_payment_term_days: number | null
  client_notes: string | null
  invoice_description: string | null
  has_due_date: boolean | null
  issue_date: string
  due_date: string
  currency_code: string
  pricing_mode: PricingMode
  vat_exemption_reason: string | null
  subtotal: number
  vat_total: number
  total: number
  status: InvoiceStatus
  lines: unknown
  is_imported: boolean | null
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
  clientContactName: row.client_contact_name ?? '',
  clientPhone: row.client_phone ?? '',
  clientAddress: row.client_address ?? '',
  clientPostalCode: row.client_postal_code ?? '',
  clientCity: row.client_city ?? '',
  clientCountry: row.client_country ?? 'NL',
  clientKvkNumber: row.client_kvk_number ?? '',
  clientBtwNumber: row.client_btw_number ?? '',
  clientIban: row.client_iban ?? '',
  clientPaymentTermDays: row.client_payment_term_days ?? 14,
  clientNotes: row.client_notes ?? '',
  invoiceDescription: row.invoice_description ?? '',
  hasDueDate: row.has_due_date ?? true,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  currencyCode: row.currency_code,
  pricingMode: row.pricing_mode,
  vatExemptionReason: row.vat_exemption_reason ?? '',
  subtotal: Number(row.subtotal),
  vatTotal: Number(row.vat_total),
  total: Number(row.total),
  status: row.status,
  lines: Array.isArray(row.lines) ? (row.lines as StoredInvoiceLine[]) : [],
  isImported: row.is_imported ?? false,
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

  if (invoice.hasDueDate) {
    const today = new Date().toISOString().slice(0, 10)
    if (invoice.dueDate < today) {
      return 'vervallen'
    }
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
      client_contact_name: invoice.clientContactName,
      client_phone: invoice.clientPhone,
      client_address: invoice.clientAddress,
      client_postal_code: invoice.clientPostalCode,
      client_city: invoice.clientCity,
      client_country: invoice.clientCountry,
      client_kvk_number: invoice.clientKvkNumber,
      client_btw_number: invoice.clientBtwNumber,
      client_iban: invoice.clientIban,
      client_payment_term_days: invoice.clientPaymentTermDays,
      client_notes: invoice.clientNotes,
      invoice_description: invoice.invoiceDescription,
      has_due_date: invoice.hasDueDate,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      currency_code: invoice.currencyCode,
      pricing_mode: invoice.pricingMode,
      vat_exemption_reason: invoice.vatExemptionReason ?? '',
      subtotal: invoice.subtotal,
      vat_total: invoice.vatTotal,
      total: invoice.total,
      status: invoice.status,
      lines: invoice.lines,
      is_imported: invoice.isImported ?? false,
    }

    let insertData: unknown = null
    let insertError: { message: string } | null = null

    const initialInsert = await supabase
      .from('app_invoices')
      .insert(payload)
      .select('*')
      .single()

    insertData = initialInsert.data
    insertError = initialInsert.error

    if (insertError && /is_imported|column/i.test(insertError.message)) {
      const legacyPayload = { ...payload }
      delete (legacyPayload as { is_imported?: boolean }).is_imported
      delete (legacyPayload as { vat_exemption_reason?: string }).vat_exemption_reason
      const legacyInsert = await supabase
        .from('app_invoices')
        .insert(legacyPayload)
        .select('*')
        .single()

      insertData = legacyInsert.data
      insertError = legacyInsert.error
    }

    if (insertError) {
      set({ error: insertError.message })
      return false
    }

    const created = {
      ...toStoredInvoice(insertData as DbInvoiceRow),
      isImported: invoice.isImported ?? false,
    }
    const hadInvoicesBefore = get().invoices.some((item) => item.userId === invoice.userId)
    set((state) => ({ invoices: [created, ...state.invoices], error: null }))

    trackEvent('invoice_created', {
      userId: invoice.userId,
      status: created.status,
      total: created.total,
      imported: created.isImported,
    })

    if (!hadInvoicesBefore) {
      trackEvent('first_invoice_created', {
        userId: invoice.userId,
        invoiceId: created.id,
      })
    }

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
      client_contact_name: update.clientContactName,
      client_phone: update.clientPhone,
      client_address: update.clientAddress,
      client_postal_code: update.clientPostalCode,
      client_city: update.clientCity,
      client_country: update.clientCountry,
      client_kvk_number: update.clientKvkNumber,
      client_btw_number: update.clientBtwNumber,
      client_iban: update.clientIban,
      client_payment_term_days: update.clientPaymentTermDays,
      client_notes: update.clientNotes,
      invoice_description: update.invoiceDescription,
      has_due_date: update.hasDueDate,
      issue_date: update.issueDate,
      due_date: update.dueDate,
      currency_code: update.currencyCode,
      pricing_mode: update.pricingMode,
      vat_exemption_reason: update.vatExemptionReason ?? '',
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
    if (!existing) return false

    const { error } = await supabase.from('app_invoices').delete().eq('id', invoiceId)

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

    trackEvent('invoice_marked_sent', {
      invoiceId: updatedInvoice.id,
      userId: updatedInvoice.userId,
      total: updatedInvoice.total,
    })

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

    trackEvent('invoice_marked_paid', {
      invoiceId: updatedInvoice.id,
      userId: updatedInvoice.userId,
      total: updatedInvoice.total,
    })

    return true
  },

  clearError: () => set({ error: null }),
}))
