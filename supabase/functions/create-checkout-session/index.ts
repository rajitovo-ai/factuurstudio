import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type BillingCycle = 'monthly' | 'yearly'

type StripeCustomerResponse = {
  id: string
}

type StripeCheckoutSessionResponse = {
  id: string
  url: string | null
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

const stripeRequest = async <T>(
  secretKey: string,
  path: string,
  body: URLSearchParams,
): Promise<T> => {
  const response = await fetch(`${stripeApiBase}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const json = await response.json()

  if (!response.ok) {
    const message = json?.error?.message ?? `Stripe request failed (${response.status})`
    throw new Error(message)
  }

  return json as T
}

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
  if (!user?.id) {
    return null
  }

  return user
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
  const monthlyPriceId = Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')
  const yearlyPriceId = Deno.env.get('STRIPE_PRICE_PRO_YEARLY')

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return makeErrorResponse('Missing Supabase environment variables', 500)
  }

  if (!stripeSecretKey) {
    return makeErrorResponse('Missing STRIPE_SECRET_KEY secret', 500)
  }

  if (!monthlyPriceId || !yearlyPriceId) {
    return makeErrorResponse('Missing STRIPE_PRICE_PRO_MONTHLY or STRIPE_PRICE_PRO_YEARLY secret', 500)
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

  const userId = user.id
  const userEmail = user.email ?? ''

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  let billingCycle: BillingCycle = 'monthly'
  try {
    const body = await request.json()
    if (body?.billingCycle === 'monthly' || body?.billingCycle === 'yearly') {
      billingCycle = body.billingCycle
    }
  } catch {
    // Keep default monthly when no JSON body was sent.
  }

  const priceId = billingCycle === 'yearly' ? yearlyPriceId : monthlyPriceId

  const {
    data: existingSubscription,
    error: subscriptionReadError,
  } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (subscriptionReadError) {
    return makeErrorResponse(subscriptionReadError.message, 500)
  }

  let stripeCustomerId = existingSubscription?.stripe_customer_id ?? null

  try {
    if (!stripeCustomerId) {
      const customerBody = new URLSearchParams()
      if (userEmail) {
        customerBody.set('email', userEmail)
      }
      customerBody.set('metadata[supabase_user_id]', userId)

      const customer = await stripeRequest<StripeCustomerResponse>(
        stripeSecretKey,
        '/customers',
        customerBody,
      )
      stripeCustomerId = customer.id

      const { error: subscriptionUpdateError } = await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
          },
          { onConflict: 'user_id' },
        )

      if (subscriptionUpdateError) {
        return makeErrorResponse(subscriptionUpdateError.message, 500)
      }
    }

    const origin = request.headers.get('origin')
    const appBaseUrl = Deno.env.get('APP_BASE_URL') ?? origin ?? 'http://localhost:5173'

    const sessionBody = new URLSearchParams()
    sessionBody.set('mode', 'subscription')
    sessionBody.set('customer', stripeCustomerId)
    sessionBody.set('line_items[0][price]', priceId)
    sessionBody.set('line_items[0][quantity]', '1')
    sessionBody.set('success_url', `${appBaseUrl}/instellingen?billing=success`)
    sessionBody.set('cancel_url', `${appBaseUrl}/instellingen?billing=cancelled`)
    sessionBody.set('allow_promotion_codes', 'true')
    sessionBody.set('client_reference_id', userId)
    sessionBody.set('metadata[supabase_user_id]', userId)

    console.log(`[checkout] customer=${stripeCustomerId}, price=${priceId}, appBaseUrl=${appBaseUrl}`)

    const checkoutSession = await stripeRequest<StripeCheckoutSessionResponse>(
      stripeSecretKey,
      '/checkout/sessions',
      sessionBody,
    )

    console.log(`[checkout] session=${checkoutSession.id}, hasUrl=${Boolean(checkoutSession.url)}`)

    if (!checkoutSession.url) {
      return makeErrorResponse('Stripe returned no checkout URL', 500)
    }

    return new Response(
      JSON.stringify({
        url: checkoutSession.url,
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
    console.error('[checkout] error:', error)
    const message = error instanceof Error ? error.message : 'Unknown Stripe error'
    return makeErrorResponse(message, 500)
  }
})
