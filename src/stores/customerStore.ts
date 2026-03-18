import { create } from 'zustand'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export type CustomerProfile = {
  id: string
  userId: string
  name: string
  companyName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  country: string
  kvkNumber: string
  btwNumber: string
  iban: string
  paymentTermDays: number
  notes: string
  createdAt: string
  updatedAt: string | null
}

type CustomerProfileInput = Omit<CustomerProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

type DbCustomerRow = {
  id: string
  user_id: string
  name: string
  company_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  country: string | null
  kvk_number: string | null
  btw_number: string | null
  iban: string | null
  payment_term_days: number | null
  notes: string | null
  created_at: string
  updated_at: string | null
}

type CustomerState = {
  customersByUser: Record<string, CustomerProfile[]>
  isLoading: boolean
  error: string | null
  loadedForUserId: string | null
  loadCustomers: (userId: string | null, force?: boolean) => Promise<void>
  createCustomer: (userId: string, input: CustomerProfileInput) => Promise<CustomerProfile | null>
  updateCustomer: (customerId: string, userId: string, input: CustomerProfileInput) => Promise<CustomerProfile | null>
  removeCustomer: (customerId: string, userId: string) => Promise<boolean>
  clearError: () => void
}

const toCustomerProfile = (row: DbCustomerRow): CustomerProfile => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  companyName: row.company_name ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  address: row.address ?? '',
  postalCode: row.postal_code ?? '',
  city: row.city ?? '',
  country: row.country ?? 'NL',
  kvkNumber: row.kvk_number ?? '',
  btwNumber: row.btw_number ?? '',
  iban: row.iban ?? '',
  paymentTermDays: row.payment_term_days ?? 14,
  notes: row.notes ?? '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const toPayload = (userId: string, input: CustomerProfileInput) => ({
  user_id: userId,
  name: input.name.trim() || input.companyName.trim() || 'Klant',
  company_name: input.companyName.trim() || null,
  email: input.email.trim() || null,
  phone: input.phone.trim() || null,
  address: input.address.trim() || null,
  postal_code: input.postalCode.trim() || null,
  city: input.city.trim() || null,
  country: input.country.trim() || 'NL',
  kvk_number: input.kvkNumber.trim() || null,
  btw_number: input.btwNumber.trim() || null,
  iban: input.iban.trim() || null,
  payment_term_days: Math.max(0, Math.round(input.paymentTermDays)),
  notes: input.notes.trim() || null,
  updated_at: new Date().toISOString(),
})

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customersByUser: {},
  isLoading: false,
  error: null,
  loadedForUserId: null,

  loadCustomers: async (userId, force = false) => {
    if (!userId || !hasSupabaseConfig) {
      return
    }

    const cached = get().customersByUser[userId]
    if (!force && get().loadedForUserId === userId && cached) {
      return
    }

    set({ isLoading: true, error: null })

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      set({ isLoading: false, error: error.message })
      return
    }

    set((state) => ({
      customersByUser: {
        ...state.customersByUser,
        [userId]: (data ?? []).map((row) => toCustomerProfile(row as DbCustomerRow)),
      },
      loadedForUserId: userId,
      isLoading: false,
      error: null,
    }))
  },

  createCustomer: async (userId, input) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return null
    }

    const payload = toPayload(userId, input)
    const { data, error } = await supabase.from('customers').insert(payload).select('*').single()

    if (error) {
      set({ error: error.message })
      return null
    }

    const created = toCustomerProfile(data as DbCustomerRow)
    set((state) => ({
      customersByUser: {
        ...state.customersByUser,
        [userId]: [created, ...(state.customersByUser[userId] ?? [])],
      },
      error: null,
    }))

    return created
  },

  updateCustomer: async (customerId, userId, input) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return null
    }

    const payload = toPayload(userId, input)
    const { data, error } = await supabase
      .from('customers')
      .update(payload)
      .eq('id', customerId)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) {
      set({ error: error.message })
      return null
    }

    const updated = toCustomerProfile(data as DbCustomerRow)
    set((state) => ({
      customersByUser: {
        ...state.customersByUser,
        [userId]: (state.customersByUser[userId] ?? []).map((customer) =>
          customer.id === customerId ? updated : customer,
        ),
      },
      error: null,
    }))

    return updated
  },

  removeCustomer: async (customerId, userId) => {
    if (!hasSupabaseConfig) {
      set({ error: 'Supabase is niet geconfigureerd.' })
      return false
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
      .eq('user_id', userId)

    if (error) {
      set({ error: error.message })
      return false
    }

    set((state) => ({
      customersByUser: {
        ...state.customersByUser,
        [userId]: (state.customersByUser[userId] ?? []).filter((customer) => customer.id !== customerId),
      },
      error: null,
    }))

    return true
  },

  clearError: () => set({ error: null }),
}))
