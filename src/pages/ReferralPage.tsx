import { useEffect, useState } from 'react'
import { getReferralRewardLabel } from '../lib/referral'
import { useAuthStore } from '../stores/authStore'
import type { Referral } from '../stores/referralStore'
import { useReferralStore } from '../stores/referralStore'

const isDev = import.meta.env.DEV

const statusLabel: Record<ReferralStatus, string> = {
  converted: 'Geregistreerd',
  rewarded: 'Beloond ✓',
}

const statusClass: Record<ReferralStatus, string> = {
  converted: 'bg-green-100 text-green-800',
  rewarded: 'bg-cyan-100 text-cyan-800',
}

type ReferralStatus = 'converted' | 'rewarded'

const maskEmail = (email: string): string => {
  const atIndex = email.indexOf('@')
  if (atIndex < 2) return '•••' + email.slice(atIndex)
  return email.slice(0, 2) + '•••' + email.slice(atIndex)
}

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))

export default function ReferralPage() {
  const { userId } = useAuthStore()
  const {
    getCode,
    getUserReferrals,
    getDevSimulatedConversions,
    getRewardConfig,
    addDevSimulatedConversions,
    resetDevSimulatedConversions,
    syncUserData,
    isSyncing,
  } = useReferralStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (userId) {
      void syncUserData(userId)
    }
  }, [syncUserData, userId])

  if (!userId) return null

  const code = getCode(userId)
  const referrals = getUserReferrals(userId)
  const simulatedConverted = getDevSimulatedConversions(userId)
  const rewardConfig = getRewardConfig()
  const rewardThreshold = Math.max(1, rewardConfig.threshold)
  const rewardLabel = getReferralRewardLabel(rewardConfig)
  const baseUrl = window.location.origin
  const shareLink = `${baseUrl}/register?ref=${code}`

  const totalConvertedReal = referrals.filter((r) => r.status === 'converted' || r.status === 'rewarded').length
  const totalConverted = totalConvertedReal + simulatedConverted
  const rewardsEarned = Math.floor(totalConverted / rewardThreshold)
  const progressToNext = totalConverted % rewardThreshold
  const progressPercent = Math.round((progressToNext / rewardThreshold) * 100)
  const stillNeeded = rewardThreshold - progressToNext

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard niet beschikbaar — gebruiker kan handmatig kopiëren */
    }
  }

  return (
    <main className="space-y-4">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Referral programma</p>
        <h1 className="mt-2 text-2xl font-extrabold">Vrienden uitnodigen</h1>
        <p className="mt-2 text-sm text-slate-600">
          Deel je persoonlijke uitnodigingslink. Voor elke{' '}
          <strong>{rewardThreshold} vrienden</strong> die zich via jouw link registreren, ontvang
          jij automatisch <strong>{rewardLabel}</strong>.
        </p>
      </section>

      {isDev ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Dev referral debug</p>
          <p className="mt-1 text-xs text-amber-700">
            Simuleer lokale conversies voor snelle UI-tests. Dit wordt niet naar Supabase geschreven.
          </p>
          <p className="mt-2 text-xs text-amber-800">
            Gesimuleerd: <span className="font-semibold">{simulatedConverted}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addDevSimulatedConversions(userId, 1)}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              +1 conversie
            </button>
            <button
              type="button"
              onClick={() => addDevSimulatedConversions(userId, rewardThreshold)}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              +{rewardThreshold} conversies
            </button>
            <button
              type="button"
              onClick={() => resetDevSimulatedConversions(userId)}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Reset simulatie
            </button>
            <button
              type="button"
              disabled={!code}
              onClick={() => {
                window.open(shareLink, '_blank', 'noopener,noreferrer')
              }}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Open test-register tab
            </button>
          </div>
        </section>
      ) : null}

      {/* Jouw uitnodigingslink */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Jouw uitnodigingslink</p>
        {isSyncing ? (
          <p className="mt-2 text-xs text-slate-500">Gegevens synchroniseren...</p>
        ) : null}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={shareLink}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Jouw referral-link"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700 outline-none"
          />
          <button
            type="button"
            onClick={copyLink}
            disabled={!code}
            className="flex-shrink-0 rounded-lg bg-cyan-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-300"
          >
            {copied ? '✓ Gekopieerd!' : code ? 'Kopieer link' : 'Code laden...'}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Jouw persoonlijke code:{' '}
          <span className="font-mono font-bold text-slate-700">{code}</span>
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Geregistreerd</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{totalConverted}</p>
          <p className="mt-1 text-xs text-slate-400">
            via jouw link{simulatedConverted > 0 ? ` (${totalConvertedReal} echt + ${simulatedConverted} dev)` : ''}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Beloningen verdiend</p>
          <p className="mt-2 text-3xl font-extrabold text-cyan-700">{rewardsEarned}</p>
          <p className="mt-1 text-xs text-slate-400">beloningen</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Volgende beloning</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {stillNeeded}
            <span className="ml-1 text-base font-medium text-slate-400">nodig</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">registraties</p>
        </article>
      </section>

      {/* Voortgangsbalk */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Voortgang naar volgende beloning</p>
          <p className="text-sm font-semibold text-cyan-700">
            {progressToNext}/{rewardThreshold}
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-cyan-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressToNext}
            aria-valuemax={rewardThreshold}
          />
        </div>
        {rewardsEarned > 0 ? (
          <p className="mt-2 text-xs text-cyan-700">
            🎉 Je hebt al {rewardsEarned}× een beloning verdiend ({rewardLabel}).
          </p>
        ) : (
          <p className="mt-2 text-xs text-slate-500">
            Nog {stillNeeded} {stillNeeded === 1 ? 'registratie' : 'registraties'} tot jouw eerste gratis
            Pro-maand.
          </p>
        )}
      </section>

      {/* Hoe werkt het */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Hoe werkt het?</p>
        <ol className="mt-5 space-y-5">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-700 text-sm font-extrabold text-white">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-800">Deel jouw link</p>
              <p className="mt-0.5 text-sm text-slate-600">
                Kopieer je persoonlijke uitnodigingslink en deel die via WhatsApp, e-mail of social media.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-700 text-sm font-extrabold text-white">
              2
            </span>
            <div>
              <p className="font-semibold text-slate-800">Vriend registreert</p>
              <p className="mt-0.5 text-sm text-slate-600">
                De vriend klikt op jouw link en maakt een gratis Factuur Studio-account aan. De registratie
                wordt automatisch aan jou gekoppeld.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-700 text-sm font-extrabold text-white">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-800">Jij ontvangt je beloning</p>
              <p className="mt-0.5 text-sm text-slate-600">
                Per {rewardThreshold} succesvolle registraties ontvang je automatisch {rewardLabel}.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Referral-lijst */}
      {referrals.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Jouw referrals</p>

          {/* Desktop tabel */}
          <div className="mt-4 hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4">E-mailadres</th>
                  <th className="pb-2 pr-4">Datum</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r: Referral) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-slate-700">{maskEmail(r.referredEmail)}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatDate(r.createdAt)}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[r.status]}`}
                      >
                        {statusLabel[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 md:hidden">
            {referrals.map((r: Referral) => (
              <div key={r.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm text-slate-700">{maskEmail(r.referredEmail)}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[r.status]}`}
                  >
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center shadow-sm">
          <p className="text-4xl">🎁</p>
          <p className="mt-3 font-semibold text-slate-700">Nog geen referrals</p>
          <p className="mt-1 text-sm text-slate-500">
            Deel je link hierboven en begin met verdienen!
          </p>
        </section>
      )}
    </main>
  )
}
