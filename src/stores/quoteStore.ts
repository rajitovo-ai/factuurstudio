import { create } from 'zustand'
import { trackEvent } from '../lib/analytics'
import { getQuoteDisplayStatus } from '../lib/quoteStatus'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import type { PricingMode, StoredInvoiceLine } from './invoiceStore'
import { useInvoiceStore } from './invoiceStore'

export { getQuoteDisplayStatus }

export type QuoteStatus = 'concept' | 'verzonden' | 'goedgekeurd' | 'afgewezen' | 'vervallen'

export type StoredQuote = {
  id: string
  userId: string
  quoteNumber: string
  sellerName?: string
  sellerEmail?: string
  sellerPhone?: string
  sellerKvk?: string
  sellerIban?: string
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
  quoteDescription: string
  discountDescription?: string
  discountAmount?: number
  hasDueDate: boolean
  issueDate: string
  dueDate: string
  expiresAt: string | null
  currencyCode: string
  pricingMode: PricingMode
  vatExemptionReason: string
  subtotal: number
  vatTotal: number
  total: number
  status: QuoteStatus
  lines: StoredInvoiceLine[]
  convertedInvoiceId: string | null
  approvedAt: string | null
  rejectedAt: string | null
  rejectionReason: string
  createdAt: string
}

type CreateQuoteInput = Omit<StoredQuote, 'id' | 'createdAt' | 'convertedInvoiceId' | 'approvedAt' | 'rejectedAt'>
type UpdateQuoteInput = Omit<
  StoredQuote,
  'id' | 'userId' | 'status' | 'createdAt' | 'convertedInvoiceId' | 'approvedAt' | 'rejectedAt'
>

type DbQuoteRow = {
  id: string
  user_id: string
  quote_number: string
  seller_name: string | null
  seller_email: string | null
  seller_phone: string | null
  seller_kvk: string | null
  seller_iban: string | null
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
  quote_description: string | null
  discount_description: string | null
  discount_amount: number | null
  has_due_date: boolean | null
  issue_date: string
  due_date: string
  expires_at: string | null
  currency_code: string
  pricing_mode: PricingMode
  vat_exemption_reason: string | null
  subtotal: number
  vat_total: number
  total: number
  status: QuoteStatus
  lines: unknown
  converted_invoice_id: string | null
  approved_at: string | null
  rejected_at: string | null
  rejection_reason: string | null
  created_at: string
}

const toStoredQuote = (row: DbQuoteRow): StoredQuote => ({
  id: row.id,
  userId: row.user_id,
  quoteNumber: row.quote_number,
  sellerName: typeof row.seller_name === 'string' ? row.seller_name : undefined,
  sellerEmail: typeof row.seller_email === 'string' ? row.seller_email : undefined,
  sellerPhone: typeof row.seller_phone === 'string' ? row.seller_phone : undefined,
  sellerKvk: typeof row.seller_kvk === 'string' ? row.seller_kvk : undefined,
  sellerIban: typeof row.seller_iban === 'string' ? row.seller_iban : undefined,
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
  quoteDescription: row.quote_description ?? '',
  discountDescription: row.discount_description ?? '',
  discountAmount: row.discount_amount ?? 0,
  hasDueDate: row.has_due_date ?? true,
  issueDate: row.issue_date,
  dueDate: row.due_date,
  expiresAt: row.expires_at,
  currencyCode: row.currency_code,
  pricingMode: row.pricing_mode,
  vatExemptionReason: row.vat_exemption_reason ?? '',
  subtotal: Number(row.subtotal),
  vatTotal: Number(row.vat_total),
  total: Number(row.total),
  status: row.status,
  lines: Array.isArray(row.lines) ? (row.lines as StoredInvoiceLine[]) : [],
  convertedInvoiceId: row.converted_invoice_id,
  approvedAt: row.approved_at,
  rejectedAt: row.rejected_at,
  rejectionReason: row.rejection_reason ?? '',
  createdAt: row.created_at,
})

type QuoteState = {
  quotes: StoredQuote[]
  isLoading: boolean
  error: string | null
  loadedForUserId: string | null
  loadQuotes: (userId: string | null, force?: boolean) => Promise<void>
  createQuote: (quote: CreateQuoteInput) => Promise<boolean>
  updateQuote: (quoteId: string, update: UpdateQuoteInput) => Promise<boolean>
  removeQuote: (quoteId: string) => Promise<boolean>
  markQuoteSent: (quoteId: string) => Promise<boolean>
  markQuoteRejected: (quoteId: string, reason?: string) => Promise<boolean>
  markQuoteApproved: (quoteId: string) => Promise<boolean>
  clearError: () => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  isLoading: false,
  error: null,
  loadedForUserId: null,

  loadQuotes: async (userId, force = false) => {
    try {
      if (!userId || !hasSupabaseConfig) {
        set({ quotes: [], loadedForUserId: userId, isLoading: false })
        return
      }

      if (!force && get().loadedForUserId === userId && get().quotes.length > 0) {
        return
      }

      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('app_quotes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        set({ isLoading: false, error: `Kan offertes niet laden: ${error.message}` })
        return
      }

      set({
        quotes: (data ?? []).map((row) => toStoredQuote(row as DbQuoteRow)),
        loadedForUserId: userId,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Onverwachte fout bij laden van offertes',
      })
    }
  },

  createQuote: async (quote) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return false
    }

    const payload = {
      user_id: quote.userId,
      quote_number: quote.quoteNumber,
      seller_name: quote.sellerName ?? '',
      seller_email: quote.sellerEmail ?? '',
      seller_phone: quote.sellerPhone ?? '',
      seller_kvk: quote.sellerKvk ?? '',
      seller_iban: quote.sellerIban ?? '',
      company_name: quote.companyName,
      logo_data_url: quote.logoDataUrl ?? null,
      client_name: quote.clientName,
      client_email: quote.clientEmail,
      client_contact_name: quote.clientContactName,
      client_phone: quote.clientPhone,
      client_address: quote.clientAddress,
      client_postal_code: quote.clientPostalCode,
      client_city: quote.clientCity,
      client_country: quote.clientCountry,
      client_kvk_number: quote.clientKvkNumber,
      client_btw_number: quote.clientBtwNumber,
      client_iban: quote.clientIban,
      client_payment_term_days: quote.clientPaymentTermDays,
      client_notes: quote.clientNotes,
      quote_description: quote.quoteDescription,
      discount_description: quote.discountDescription ?? '',
      discount_amount: quote.discountAmount ?? 0,
      has_due_date: quote.hasDueDate,
      issue_date: quote.issueDate,
      due_date: quote.dueDate,
      expires_at: quote.expiresAt,
      currency_code: quote.currencyCode,
      pricing_mode: quote.pricingMode,
      vat_exemption_reason: quote.vatExemptionReason,
      subtotal: quote.subtotal,
      vat_total: quote.vatTotal,
      total: quote.total,
      status: quote.status,
      lines: quote.lines,
      rejection_reason: quote.rejectionReason,
    }

    let insertData: unknown = null
    let insertError: { message: string } | null = null

    const initialInsert = await supabase.from('app_quotes').insert(payload).select('*').single()
    insertData = initialInsert.data
    insertError = initialInsert.error

    if (insertError && /seller_name|seller_email|seller_phone|seller_kvk|seller_iban|discount_description|discount_amount|column/i.test(insertError.message)) {
      const legacyPayload = { ...payload }
      delete (legacyPayload as { seller_name?: string }).seller_name
      delete (legacyPayload as { seller_email?: string }).seller_email
      delete (legacyPayload as { seller_phone?: string }).seller_phone
      delete (legacyPayload as { seller_kvk?: string }).seller_kvk
      delete (legacyPayload as { seller_iban?: string }).seller_iban
      delete (legacyPayload as { discount_description?: string }).discount_description
      delete (legacyPayload as { discount_amount?: number }).discount_amount

      const legacyInsert = await supabase.from('app_quotes').insert(legacyPayload).select('*').single()
      insertData = legacyInsert.data
      insertError = legacyInsert.error
    }

    if (insertError) {
      set({ error: insertError.message })
      return false
    }

    const created = toStoredQuote(insertData as DbQuoteRow)
    set((state) => ({ quotes: [created, ...state.quotes], error: null }))

    trackEvent('quotation_created', {
      quoteId: created.id,
      userId: created.userId,
      status: created.status,
      total: created.total,
    })

    return true
  },

  updateQuote: async (quoteId, update) => {
    const existing = get().quotes.find((quote) => quote.id === quoteId)
    if (!existing || existing.status !== 'concept') return false

    const payload = {
      quote_number: update.quoteNumber,
      seller_name: update.sellerName ?? '',
      seller_email: update.sellerEmail ?? '',
      seller_phone: update.sellerPhone ?? '',
      seller_kvk: update.sellerKvk ?? '',
      seller_iban: update.sellerIban ?? '',
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
      quote_description: update.quoteDescription,
      discount_description: update.discountDescription ?? '',
      discount_amount: update.discountAmount ?? 0,
      has_due_date: update.hasDueDate,
      issue_date: update.issueDate,
      due_date: update.dueDate,
      expires_at: update.expiresAt,
      currency_code: update.currencyCode,
      pricing_mode: update.pricingMode,
      vat_exemption_reason: update.vatExemptionReason,
      subtotal: update.subtotal,
      vat_total: update.vatTotal,
      total: update.total,
      lines: update.lines,
      rejection_reason: update.rejectionReason,
      updated_at: new Date().toISOString(),
    }

    let updateData: unknown = null
    let updateError: { message: string } | null = null

    const initialUpdate = await supabase
      .from('app_quotes')
      .update(payload)
      .eq('id', quoteId)
      .eq('status', 'concept')
      .select('*')
      .single()

    updateData = initialUpdate.data
    updateError = initialUpdate.error

    if (updateError && /seller_name|seller_email|seller_phone|seller_kvk|seller_iban|discount_description|discount_amount|column/i.test(updateError.message)) {
      const legacyPayload = { ...payload }
      delete (legacyPayload as { seller_name?: string }).seller_name
      delete (legacyPayload as { seller_email?: string }).seller_email
      delete (legacyPayload as { seller_phone?: string }).seller_phone
      delete (legacyPayload as { seller_kvk?: string }).seller_kvk
      delete (legacyPayload as { seller_iban?: string }).seller_iban
      delete (legacyPayload as { discount_description?: string }).discount_description
      delete (legacyPayload as { discount_amount?: number }).discount_amount

      const legacyUpdate = await supabase
        .from('app_quotes')
        .update(legacyPayload)
        .eq('id', quoteId)
        .eq('status', 'concept')
        .select('*')
        .single()

      updateData = legacyUpdate.data
      updateError = legacyUpdate.error
    }

    if (updateError) {
      set({ error: updateError.message })
      return false
    }

    const updated = toStoredQuote(updateData as DbQuoteRow)
    set((state) => ({
      quotes: state.quotes.map((quote) => (quote.id === quoteId ? updated : quote)),
      error: null,
    }))

    return true
  },

  removeQuote: async (quoteId) => {
    const existing = get().quotes.find((quote) => quote.id === quoteId)
    if (!existing || existing.status !== 'concept') return false

    const { error } = await supabase.from('app_quotes').delete().eq('id', quoteId).eq('status', 'concept')

    if (error) {
      set({ error: error.message })
      return false
    }

    set((state) => ({
      quotes: state.quotes.filter((quote) => quote.id !== quoteId),
      error: null,
    }))

    return true
  },

  markQuoteSent: async (quoteId) => {
    const existing = get().quotes.find((quote) => quote.id === quoteId)
    if (!existing || existing.status !== 'concept') return false

    const { data, error } = await supabase
      .from('app_quotes')
      .update({ status: 'verzonden', updated_at: new Date().toISOString() })
      .eq('id', quoteId)
      .eq('status', 'concept')
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const updated = toStoredQuote(data as DbQuoteRow)
    set((state) => ({
      quotes: state.quotes.map((quote) => (quote.id === quoteId ? updated : quote)),
      error: null,
    }))

    trackEvent('quotation_sent', {
      quoteId: updated.id,
      userId: updated.userId,
      total: updated.total,
    })

    return true
  },

  markQuoteRejected: async (quoteId, reason = '') => {
    const existing = get().quotes.find((quote) => quote.id === quoteId)
    if (!existing || existing.status !== 'verzonden') return false

    const { data, error } = await supabase
      .from('app_quotes')
      .update({
        status: 'afgewezen',
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', quoteId)
      .eq('status', 'verzonden')
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return false
    }

    const updated = toStoredQuote(data as DbQuoteRow)
    set((state) => ({
      quotes: state.quotes.map((quote) => (quote.id === quoteId ? updated : quote)),
      error: null,
    }))

    return true
  },

  markQuoteApproved: async (quoteId) => {
    const existing = get().quotes.find((quote) => quote.id === quoteId)
    if (!existing || (existing.status !== 'verzonden' && existing.status !== 'goedgekeurd')) return false

    if (!existing.userId) return false

    const { data: rpcData, error } = await supabase.rpc('approve_quote_to_invoice', {
      p_quote_id: quoteId,
    })

    if (error) {
      const message = error.message.toLowerCase()

      if (message.includes('function public.approve_quote_to_invoice') || message.includes('does not exist')) {
        set({
          error:
            'Offerte-conversie is nog niet beschikbaar in de database. Voer migratie 017 uit en probeer opnieuw.',
        })
        return false
      }

      if (message.includes('quote_not_found')) {
        set({ error: 'Offerte niet gevonden of geen toegang.' })
        return false
      }

      if (message.includes('quote_not_approvable')) {
        set({ error: 'Deze offerte kan niet (meer) worden goedgekeurd.' })
        return false
      }

      if (message.includes('unauthorized')) {
        set({ error: 'Je sessie is verlopen. Log opnieuw in en probeer opnieuw.' })
        return false
      }

      set({ error: error.message })
      return false
    }

    const result = (rpcData ?? null) as {
      invoiceId?: string
      alreadyConverted?: boolean
    } | null

    if (!result?.invoiceId) {
      set({ error: 'Goedkeuren van offerte is mislukt: geen factuur-id ontvangen.' })
      return false
    }

    await Promise.all([
      get().loadQuotes(existing.userId, true),
      useInvoiceStore.getState().loadInvoices(existing.userId, true),
    ])

    const updated = get().quotes.find((quote) => quote.id === quoteId)
    if (!updated) {
      set({ error: 'Offerte is goedgekeurd, maar kon niet opnieuw geladen worden.' })
      return false
    }

    set((state) => ({
      quotes: state.quotes.map((quote) => (quote.id === quoteId ? updated : quote)),
      error: null,
    }))

    trackEvent('quotation_approved', {
      quoteId: updated.id,
      userId: updated.userId,
      invoiceId: result.invoiceId,
      total: updated.total,
    })

    if (!result.alreadyConverted) {
      trackEvent('quotation_converted_to_invoice', {
        quoteId: updated.id,
        invoiceId: result.invoiceId,
        userId: updated.userId,
      })
    }

    return true
  },

  clearError: () => set({ error: null }),
}))
