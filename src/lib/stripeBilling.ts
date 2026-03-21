import { supabase } from './supabase'

export type BillingCycle = 'monthly' | 'yearly'

type CheckoutResponse = {
  url?: string
  error?: string
}

type BillingSyncResponse = {
  plan?: 'free' | 'pro'
  stripeStatus?: string
  billingCycle?: 'monthly' | 'yearly' | null
  error?: string
}

const parseFunctionError = async (response: Response) => {
  try {
    const payload = (await response.json()) as {
      error?: string
      message?: string
      code?: string | number
    }

    if (payload.error) return payload.error
    if (payload.message) return payload.message
    if (payload.code) return `HTTP ${response.status} (${payload.code})`

    return `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

const requestCheckoutWithToken = async (accessToken: string, billingCycle: BillingCycle) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuratie ontbreekt in frontend environment.')
  }

  const directResponse = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ billingCycle }),
  })

  return directResponse
}

const invokeWithDirectFetchFallback = async (billingCycle: BillingCycle) => {
  const invokeResponse = await supabase.functions.invoke<CheckoutResponse>('create-checkout-session', {
    body: { billingCycle },
  })

  if (!invokeResponse.error && invokeResponse.data?.url) {
    return invokeResponse.data.url
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.access_token) {
    throw new Error('Geen actieve sessie gevonden. Log opnieuw in en probeer het opnieuw.')
  }

  let directResponse = await requestCheckoutWithToken(session.access_token, billingCycle)

  if (directResponse.status === 401) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
    const refreshedToken = refreshData.session?.access_token
    if (refreshError || !refreshedToken) {
      throw new Error('Sessie verlopen. Log opnieuw in en probeer het opnieuw.')
    }

    directResponse = await requestCheckoutWithToken(refreshedToken, billingCycle)
  }

  if (!directResponse.ok) {
    const message = await parseFunctionError(directResponse)
    throw new Error(message)
  }

  const directPayload = (await directResponse.json()) as CheckoutResponse
  if (!directPayload.url) {
    throw new Error(directPayload.error ?? 'Checkout URL ontbreekt')
  }

  return directPayload.url
}

export const startProCheckout = async (billingCycle: BillingCycle) => {
  const checkoutUrl = await invokeWithDirectFetchFallback(billingCycle)
  window.location.href = checkoutUrl
}

export const syncBillingAfterCheckout = async () => {
  const invokeResponse = await supabase.functions.invoke<BillingSyncResponse>('sync-billing-status', {
    body: {},
  })

  if (!invokeResponse.error && invokeResponse.data) {
    return invokeResponse.data
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.access_token) {
    throw new Error('Geen actieve sessie gevonden. Log opnieuw in en probeer het opnieuw.')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuratie ontbreekt in frontend environment.')
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/sync-billing-status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    const message = await parseFunctionError(response)
    throw new Error(message)
  }

  return (await response.json()) as BillingSyncResponse
}
