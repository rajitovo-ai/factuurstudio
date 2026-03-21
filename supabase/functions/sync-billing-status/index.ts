import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type StripeListResponse<T> = {
  data?: T[]
}

type StripeSubscription = {
  id: string
  status: string
  cancel_at_period_end?: boolean
  current_period_end?: number
  items?: {
    data?: Array<{
      price?: {
        id?: string
        recurring?: {
          interval?: 'month' | 'year'
        }
      }
    }>
  }
}

type SupabaseUserResponse = {
  id: string
  email?: string | null
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripeApiBase = 'https://api.stripe.com/v1'

const makeErrorResponse = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })

const getUserFromAccessToken = async (
  supabaseUrl: string,
  supabaseAnonKey: string,
  accessToken: string,
): Promise<SupabaseUserResponse | null> => {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  const user = (await response.json()) as SupabaseUserResponse
  return user?.id ? user : null
}

const stripeGet = async <T>(secretKey: string, path: string): Promise<T> => {
  const response = await fetch(`${stripeApiBase}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })

  const json = await response.json()

  if (!response.ok) {
    const message = json?.error?.message ?? `Stripe request failed (${response.status})`
    throw new Error(message)
  }

  return json as T
}

const planFromStripeStatus = (status: string) => {
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    return 'pro' as const
  }
  return 'free' as const
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return makeErrorResponse('Method not allowed', 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return makeErrorResponse('Missing Supabase environment variables', 500)
  }

  if (!stripeSecretKey) {
    return makeErrorResponse('Missing STRIPE_SECRET_KEY secret', 500)
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return makeErrorResponse('Missing Authorization header', 401)
  }

  const userJwt = authHeader.slice('Bearer '.length).trim()
  const user = await getUserFromAccessToken(supabaseUrl, supabaseAnonKey, userJwt)
  if (!user?.id) {
    return makeErrorResponse('Unauthorized', 401)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  const { data: subscriptionRow, error: readError } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (readError) {
    return makeErrorResponse(readError.message, 500)
  }

  const stripeCustomerId = subscriptionRow?.stripe_customer_id
  if (!stripeCustomerId) {
    return new Response(
      JSON.stringify({
        plan: 'free',
        stripeStatus: 'inactive',
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    const params = new URLSearchParams({
      customer: stripeCustomerId,
      status: 'all',
      limit: '1',
    })

    const subscriptions = await stripeGet<StripeListResponse<StripeSubscription>>(
      stripeSecretKey,
      `/subscriptions?${params.toString()}`,
    )

    const latest = subscriptions.data?.[0] ?? null
    const stripeStatus = latest?.status ?? 'inactive'
    const plan = planFromStripeStatus(stripeStatus)
    const currentPeriodEnd = latest?.current_period_end
      ? new Date(latest.current_period_end * 1000).toISOString()
      : null
    const stripePriceId = latest?.items?.data?.[0]?.price?.id ?? null
    const interval = latest?.items?.data?.[0]?.price?.recurring?.interval
    const billingCycle = interval === 'year' ? 'yearly' : interval === 'month' ? 'monthly' : null

    const { error: upsertError } = await supabase.from('subscriptions').upsert(
      {
        user_id: user.id,
        plan,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: latest?.id ?? null,
        stripe_price_id: stripePriceId,
        stripe_status: stripeStatus,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: Boolean(latest?.cancel_at_period_end),
      },
      { onConflict: 'user_id' },
    )

    if (upsertError) {
      return makeErrorResponse(upsertError.message, 500)
    }

    return new Response(
      JSON.stringify({
        plan,
        stripeStatus,
        billingCycle,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Stripe sync error'
    return makeErrorResponse(message, 500)
  }
})
