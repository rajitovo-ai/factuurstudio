import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { PLAN_CONFIGS } from '../lib/billing'
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
  const setUserPlan = useBillingStore((state) => state.setUserPlan)
  const [planMessage, setPlanMessage] = useState<string | null>(null)

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

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Planbeheer</p>
        <h2 className="mt-2 text-xl font-extrabold">Huidig plan: {PLAN_CONFIGS[planId].name}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Beperkingen en functies worden direct op basis van dit plan toegepast.
        </p>

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
        ) : (
          <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            Alleen beheerders kunnen handmatig plannen wijzigen.
          </p>
        )}

        {planMessage ? <p className="mt-3 text-sm text-emerald-700">{planMessage}</p> : null}
      </section>
    </main>
  )
}
