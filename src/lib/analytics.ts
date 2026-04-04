import { getAttributionPayload } from './attribution'

type AnalyticsEventName =
  | 'signup'
  | 'sign_up'
  | 'start_checkout'
  | 'purchase'
  | 'invoice_created'
  | 'first_invoice_created'
  | 'invoice_marked_sent'
  | 'invoice_marked_paid'
  | 'quotation_created'
  | 'quotation_sent'
  | 'quotation_approved'
  | 'quotation_converted_to_invoice'
  | 'referral_used'
  | 'support_opened'
  | 'support_search_used'
  | 'support_contact_started'
  | 'support_feedback_yes'
  | 'support_feedback_no'
  | 'support_ticket_submitted'

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

type AnalyticsEvent = {
  name: AnalyticsEventName
  payload?: AnalyticsPayload
  timestamp: string
}

const ANALYTICS_KEY = 'factuurstudio.analytics.events'

const readEvents = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') return []

  const raw = window.localStorage.getItem(ANALYTICS_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as AnalyticsEvent[]
  } catch {
    return []
  }
}

const writeEvents = (events: AnalyticsEvent[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-200)))
}

export const trackEvent = (name: AnalyticsEventName, payload?: AnalyticsPayload) => {
  if (typeof window === 'undefined') return

  const mergedPayload: AnalyticsPayload = {
    ...getAttributionPayload(),
    ...(payload ?? {}),
  }

  const event: AnalyticsEvent = {
    name,
    payload: mergedPayload,
    timestamp: new Date().toISOString(),
  }

  const events = readEvents()
  writeEvents([...events, event])

  const gaEventName = name === 'signup' ? 'sign_up' : name

  // Optional bridge for GTM-like setups.
  const bridgeWindow = window as Window & { dataLayer?: unknown[] }
  if (Array.isArray(bridgeWindow.dataLayer)) {
    bridgeWindow.dataLayer.push({
      event: gaEventName,
      ...mergedPayload,
    })
  }

  // Direct GA4 tracking via gtag (used in production).
  const gtagWindow = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof gtagWindow.gtag === 'function') {
    gtagWindow.gtag('event', gaEventName, mergedPayload)
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', gaEventName, mergedPayload)
  }
}
