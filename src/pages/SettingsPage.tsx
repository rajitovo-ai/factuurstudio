import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { trackEvent } from '../lib/analytics'
import { PLAN_CONFIGS } from '../lib/billing'
import { startProCheckout, syncBillingAfterCheckout } from '../lib/stripeBilling'
import { useAuthStore } from '../stores/authStore'
import { useBillingStore } from '../stores/billingStore'
import { defaultCompanyProfile, useProfileStore } from '../stores/profileStore'

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean)

export default function SettingsPage() {
  const userId = useAuthStore((state) => state.userId)
  const email = useAuthStore((state) => state.email)
  const profiles = useProfileStore((state) => state.profiles)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const upsertProfile = useProfileStore((state) => state.upsertProfile)
  const profileError = useProfileStore((state) => state.error)
  const planId = useBillingStore((state) => state.getUserPlan(userId))
  const billingDetails = useBillingStore((state) => state.getUserBillingDetails(userId))
  const setUserPlan = useBillingStore((state) => state.setUserPlan)
  const syncUserPlan = useBillingStore((state) => state.syncUserPlan)
  const [planMessage, setPlanMessage] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<null | 'monthly' | 'yearly'>(null)
  const [syncLoading, setSyncLoading] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | null>(null)

  const profile = useMemo(() => {
    if (!userId) return defaultCompanyProfile
    return profiles[userId] ?? defaultCompanyProfile
  }, [profiles, userId])

  const [companyName, setCompanyName] = useState(profile.companyName)
  const [address, setAddress] = useState(profile.address)
  const [kvkNumber, setKvkNumber] = useState(profile.kvkNumber)
  const [btwNumber, setBtwNumber] = useState(profile.btwNumber)
  const [iban, setIban] = useState(profile.iban)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(profile.logoDataUrl)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [logoWarning, setLogoWarning] = useState<string | null>(null)
  useEffect(() => {
    if (userId) {
      void loadProfile(userId)
    }
  }, [loadProfile, userId])

  useEffect(() => {
    setCompanyName(profile.companyName)
    setAddress(profile.address)
    setKvkNumber(profile.kvkNumber)
    setBtwNumber(profile.btwNumber)
    setIban(profile.iban)
    setLogoDataUrl(profile.logoDataUrl)
  }, [profile])

  useEffect(() => {
    if (!userId) return

    const searchParams = new URLSearchParams(window.location.search)
    const billingState = searchParams.get('billing')

    if (billingState === 'success') {
      setPlanMessage('Betaling ontvangen. We synchroniseren je abonnement...')
      window.setTimeout(() => {
        void (async () => {
          try {
            const syncResult = await syncBillingAfterCheckout()
            const hasProPlan = syncResult.plan === 'pro'
            const purchaseCycle = syncResult.billingCycle ?? 'monthly'
            const purchaseValue = purchaseCycle === 'yearly' ? 39.99 : 4.99

            if (hasProPlan) {
              trackEvent('purchase', {
                currency: 'EUR',
                value: purchaseValue,
                billing_cycle: purchaseCycle,
                plan: 'pro',
              })
            }
            setBillingCycle(syncResult.billingCycle ?? null)
          } catch (error) {
            console.error('Directe billing-sync mislukt:', error)
          } finally {
            await syncUserPlan(userId)
            setPlanMessage('Abonnement gesynchroniseerd.')
          }
        })()
      }, 0)
      searchParams.delete('billing')
      const nextQuery = searchParams.toString()
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`
      window.history.replaceState({}, document.title, nextUrl)
    }

    if (billingState === 'cancelled') {
      setPlanMessage('Afrekenen is geannuleerd. Je huidige plan blijft actief.')
      searchParams.delete('billing')
      const nextQuery = searchParams.toString()
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`
      window.history.replaceState({}, document.title, nextUrl)
    }
  }, [syncUserPlan, userId])


  const MAX_LOGO_WIDTH = 400
  const MAX_LOGO_HEIGHT = 200
  const isAdminUser = !!email && adminEmails.includes(email.toLowerCase())

  const onLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLogoWarning(null)

    if (file.size > 5 * 1024 * 1024) {
      setLogoWarning('Bestand is groter dan 5 MB en kan niet worden geladen.')
      return
    }

    const outputType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png'

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_LOGO_WIDTH || height > MAX_LOGO_HEIGHT) {
          const scale = Math.min(MAX_LOGO_WIDTH / width, MAX_LOGO_HEIGHT / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, width, height)
        const resized = canvas.toDataURL(outputType, 0.85)
        setLogoDataUrl(resized)
        // Warn if the resized result is still large (> ~200 KB as base64)
        if (resized.length > 200 * 1024) {
          setLogoWarning('Logo is verkleind maar nog steeds vrij groot. Overweeg een eenvoudiger afbeelding.')
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId) return

    const ok = await upsertProfile(userId, {
      companyName,
      address,
      kvkNumber,
      btwNumber,
      iban,
      logoDataUrl,
    })

    if (!ok) {
      return
    }

    setSavedMessage('Instellingen opgeslagen.')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  const setPlan = async (nextPlan: 'free' | 'pro') => {
    if (!userId) return
    await setUserPlan(userId, nextPlan)
    setPlanMessage(`Plan bijgewerkt naar ${PLAN_CONFIGS[nextPlan].name}.`)
    setTimeout(() => setPlanMessage(null), 2500)
  }

  const startCheckout = async (billingCycle: 'monthly' | 'yearly') => {
    setCheckoutError(null)
    setCheckoutLoading(billingCycle)
    try {
      trackEvent('start_checkout', {
        currency: 'EUR',
        value: billingCycle === 'yearly' ? 39.99 : 4.99,
        billing_cycle: billingCycle,
        plan: 'pro',
      })
      await startProCheckout(billingCycle)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout starten is mislukt.'
      setCheckoutError(message)
      setCheckoutLoading(null)
    }
  }

  const syncBillingNow = async () => {
    if (!userId) return
    setSyncLoading(true)
    setCheckoutError(null)
    try {
      const syncResult = await syncBillingAfterCheckout()
      setBillingCycle(syncResult.billingCycle ?? null)
      await syncUserPlan(userId)
      setPlanMessage('Abonnement gesynchroniseerd met Stripe.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Synchroniseren is mislukt.'
      setCheckoutError(message)
    } finally {
      setSyncLoading(false)
    }
  }

  const formattedPeriodEnd = billingDetails.currentPeriodEnd
    ? new Intl.DateTimeFormat('nl-NL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(billingDetails.currentPeriodEnd))
    : null

  const currentPlanLabel =
    planId === 'pro'
      ? billingCycle === 'yearly'
        ? 'Pro jaarlijks'
        : billingCycle === 'monthly'
          ? 'Pro maandelijks'
          : 'Pro'
      : PLAN_CONFIGS[planId].name

  return (
    <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Instellingen</p>
      <h1 className="mt-2 text-2xl font-extrabold">Bedrijfsprofiel</h1>
      <p className="mt-2 text-sm text-slate-600">
        Deze gegevens worden gebruikt in je factuur en PDF en worden veilig opgeslagen in je account.
        Toegestane formaten: PNG, JPEG, WebP — max 5 MB. Grote afbeeldingen worden automatisch verkleind naar max 400×200 px.
      </p>

      {profileError ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {profileError}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Bedrijfsnaam</span>
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Adres</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">KvK-nummer</span>
          <input
            value={kvkNumber}
            onChange={(event) => setKvkNumber(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">BTW-nummer</span>
          <input
            value={btwNumber}
            onChange={(event) => setBtwNumber(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">IBAN</span>
          <input
            value={iban}
            onChange={(event) => setIban(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
          />
        </label>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-700">Logo</p>
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onLogoChange} />
            {logoDataUrl ? (
              <button
                type="button"
                onClick={() => { setLogoDataUrl(null); setLogoWarning(null) }}
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Verwijder logo
              </button>
            ) : null}
          </div>
          {logoWarning ? (
            <p className="mt-2 text-xs text-amber-700">{logoWarning}</p>
          ) : null}
          {logoDataUrl ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <img src={logoDataUrl} alt="Bedrijfslogo" className="max-h-20 w-auto" />
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Opslaan
          </button>
          {savedMessage ? <p className="text-sm text-emerald-700">{savedMessage}</p> : null}
        </div>
      </form>

      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Plan</p>
        <p className="mt-1 text-sm text-slate-700">
          Huidig plan: <span className="font-semibold">{currentPlanLabel}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formattedPeriodEnd ? `Volgende verlenging: ${formattedPeriodEnd}` : ''}
          {billingDetails.cancelAtPeriodEnd ? ' · Eindigt aan het einde van deze periode' : ''}
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              void syncBillingNow()
            }}
            disabled={syncLoading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncLoading ? 'Synchroniseren...' : 'Synchroniseer abonnement'}
          </button>
        </div>

        {!isAdminUser ? (
          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50/70 p-4">
            <p className="text-sm font-semibold text-cyan-900">Upgrade naar Pro</p>
            <p className="mt-1 text-xs text-cyan-800">
              Kies je betaalcyclus. Je wordt doorgestuurd naar Stripe Checkout.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  void startCheckout('monthly')
                }}
                disabled={checkoutLoading !== null}
                className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading === 'monthly' ? 'Bezig...' : 'Pro maandelijks (€4,99)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  void startCheckout('yearly')
                }}
                disabled={checkoutLoading !== null}
                className="rounded-lg border border-cyan-700 bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading === 'yearly' ? 'Bezig...' : 'Pro jaarlijks (€39,99)'}
              </button>
            </div>
            {checkoutError ? <p className="mt-3 text-xs text-rose-700">{checkoutError}</p> : null}
          </div>
        ) : null}

        {isAdminUser ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void setPlan('free')
              }}
              className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              Zet plan op Free
            </button>
            <button
              type="button"
              onClick={() => {
                void setPlan('pro')
              }}
              className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            >
              Zet plan op Pro
            </button>
          </div>
        ) : null}

        {planMessage ? <p className="mt-3 text-sm text-emerald-700">{planMessage}</p> : null}
      </section>
    </main>
  )
}
