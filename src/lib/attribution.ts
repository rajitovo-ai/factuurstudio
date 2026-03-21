type AttributionFields = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  ttclid?: string
  referrer?: string
  landing_path?: string
  captured_at?: string
}

type AttributionPayload = Record<string, string>

const FIRST_TOUCH_KEY = 'factuurstudio.attribution.first_touch'
const LAST_TOUCH_KEY = 'factuurstudio.attribution.last_touch'

const ATTR_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'ttclid',
] as const

const readAttribution = (key: string): AttributionFields | null => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AttributionFields
  } catch {
    return null
  }
}

const writeAttribution = (key: string, value: AttributionFields) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

const extractFromUrl = (targetUrl: URL): AttributionFields => {
  const attribution: AttributionFields = {}

  for (const key of ATTR_KEYS) {
    const value = targetUrl.searchParams.get(key)
    if (value) attribution[key] = value
  }

  return attribution
}

export const captureAttributionFromUrl = () => {
  if (typeof window === 'undefined') return

  const targetUrl = new URL(window.location.href)
  const extracted = extractFromUrl(targetUrl)
  const hasAttribution = Object.keys(extracted).length > 0

  const baseRecord: AttributionFields = {
    ...extracted,
    referrer: document.referrer || '',
    landing_path: `${targetUrl.pathname}${targetUrl.search}`,
    captured_at: new Date().toISOString(),
  }

  const firstTouch = readAttribution(FIRST_TOUCH_KEY)

  if (!firstTouch && (hasAttribution || !!document.referrer)) {
    writeAttribution(FIRST_TOUCH_KEY, baseRecord)
  }

  if (hasAttribution) {
    writeAttribution(LAST_TOUCH_KEY, baseRecord)
  }
}

export const getAttributionPayload = (): AttributionPayload => {
  const firstTouch = readAttribution(FIRST_TOUCH_KEY)
  const lastTouch = readAttribution(LAST_TOUCH_KEY)

  const payload: AttributionPayload = {}

  if (lastTouch) {
    if (lastTouch.utm_source) payload.utm_source = lastTouch.utm_source
    if (lastTouch.utm_medium) payload.utm_medium = lastTouch.utm_medium
    if (lastTouch.utm_campaign) payload.utm_campaign = lastTouch.utm_campaign
    if (lastTouch.utm_term) payload.utm_term = lastTouch.utm_term
    if (lastTouch.utm_content) payload.utm_content = lastTouch.utm_content
    if (lastTouch.gclid) payload.gclid = lastTouch.gclid
    if (lastTouch.fbclid) payload.fbclid = lastTouch.fbclid
    if (lastTouch.msclkid) payload.msclkid = lastTouch.msclkid
    if (lastTouch.ttclid) payload.ttclid = lastTouch.ttclid
  }

  if (firstTouch) {
    if (firstTouch.utm_source) payload.first_utm_source = firstTouch.utm_source
    if (firstTouch.utm_medium) payload.first_utm_medium = firstTouch.utm_medium
    if (firstTouch.utm_campaign) payload.first_utm_campaign = firstTouch.utm_campaign
    if (firstTouch.referrer) payload.first_referrer = firstTouch.referrer
    if (firstTouch.landing_path) payload.first_landing_path = firstTouch.landing_path
  }

  return payload
}
