import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type StripeSubscription = {
  id: string
  customer: string
  status: string
  cancel_at_period_end: boolean
  current_period_end: number
  items?: {
    data?: Array<{
      price?: {
        id?: string
      }
    }>
  }
  metadata?: {
    supabase_user_id?: string
  }
}

type StripeCheckoutSession = {
  customer?: string
  subscription?: string
  client_reference_id?: string
  metadata?: {
    supabase_user_id?: string
  }
}

type StripeCustomer = {
  id: string
  metadata?: {
    supabase_user_id?: string
  }
}

const stripeApiBase = 'https://api.stripe.com/v1'

const subtle = crypto.subtle

const timingSafeEqual = (left: Uint8Array, right: Uint8Array) => {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left[i] ^ right[i]
  }
  return mismatch === 0
}

const hexToBytes = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

const textToBytes = (value: string) => new TextEncoder().encode(value)

const computeSignature = async (secret: string, payload: string) => {
  const key = await subtle.importKey('raw', textToBytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const signatureBuffer = await subtle.sign('HMAC', key, textToBytes(payload))
  return new Uint8Array(signatureBuffer)
}

const verifyStripeSignature = async (rawBody: string, signatureHeader: string, webhookSecret: string) => {
  const parts = signatureHeader.split(',')
  const timestampPart = parts.find((part) => part.startsWith('t='))
  const signatureParts = parts.filter((part) => part.startsWith('v1='))

  if (!timestampPart || signatureParts.length === 0) {
    return false
  }

  const timestamp = Number(timestampPart.slice(2))
  if (!Number.isFinite(timestamp)) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > 300) {
    return false
  }

  const signedPayload = `${timestamp}.${rawBody}`
  const expected = await computeSignature(webhookSecret, signedPayload)

  return signatureParts.some((part) => {
    const receivedHex = part.slice(3)
    if (!/^[0-9a-fA-F]+$/.test(receivedHex)) {
      return false
    }
    const received = hexToBytes(receivedHex)
    return timingSafeEqual(expected, received)
  })
}

const stripeRequest = async <T>(
  secretKey: string,
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: URLSearchParams,
): Promise<T> => {
  const response = await fetch(`${stripeApiBase}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: body?.toString(),
  })

  const json = await response.json()

  if (!response.ok) {
    const message = json?.error?.message ?? `Stripe request failed (${response.status})`
    throw new Error(message)
  }

  return json as T
}

const planFromSubscriptionStatus = (status: string) => {
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    return 'pro'
  }
  return 'free'
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const signatureHeader = request.headers.get('stripe-signature')
  const rawBody = await request.text()

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!signatureHeader || !webhookSecret) {
    return new Response('Missing signature configuration', { status: 400 })
  }

  if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
    return new Response('Missing server configuration', { status: 500 })
  }

  const isValid = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret)
  if (!isValid) {
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(rawBody) as {
    type: string
    data?: {
      object?: unknown
    }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const upsertFromSubscription = async (subscription: StripeSubscription, userIdOverride?: string) => {
    let userId =
      userIdOverride ??
      subscription.metadata?.supabase_user_id ??
      null

    if (!userId) {
      const { data: subscriptionRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .maybeSingle()
      userId = subscriptionRow?.user_id ?? null
    }

    if (!userId && subscription.customer) {
      const { data: customerRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', subscription.customer)
        .maybeSingle()
      userId = customerRow?.user_id ?? null
    }

    if (!userId && subscription.customer) {
      const customer = await stripeRequest<StripeCustomer>(
        stripeSecretKey,
        `/customers/${subscription.customer}`,
      )
      userId = customer.metadata?.supabase_user_id ?? null
    }

    if (!userId) {
      console.warn('stripe-webhook: could not resolve user for subscription', subscription.id)
      return
    }

    const plan = planFromSubscriptionStatus(subscription.status)
    const stripePriceId = subscription.items?.data?.[0]?.price?.id ?? null

    const { error } = await supabase.from('subscriptions').upsert(
      {
        user_id: userId,
        plan,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        stripe_price_id: stripePriceId,
        stripe_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
      },
      { onConflict: 'user_id' },
    )

    if (error) {
      throw new Error(error.message)
    }
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = (event.data?.object ?? {}) as StripeCheckoutSession
      if (!session.subscription) {
        return new Response(JSON.stringify({ ok: true, ignored: true }), { status: 200 })
      }

      const subscription = await stripeRequest<StripeSubscription>(
        stripeSecretKey,
        `/subscriptions/${session.subscription}`,
      )

      const userId =
        session.metadata?.supabase_user_id ??
        session.client_reference_id ??
        undefined

      await upsertFromSubscription(subscription, userId)
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = (event.data?.object ?? {}) as StripeSubscription
      await upsertFromSubscription(subscription)
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('stripe-webhook failed', error)
    const message = error instanceof Error ? error.message : 'Unknown webhook error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
