import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PLAN_CONFIGS, canCreateInvoiceThisMonth } from '../lib/billing'
import RelatedSupport from '../components/support/RelatedSupport'
import { deriveDashboardMetrics } from '../lib/dashboard'
import SearchInput from '../components/ui/SearchInput'
import { filterInvoices } from '../lib/searchUtils'
import Skeleton, { CardSkeleton } from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'
import { useBillingStore } from '../stores/billingStore'
import { getInvoiceDisplayStatus, useInvoiceStore } from '../stores/invoiceStore'

const isDev = import.meta.env.DEV

const statCardClass =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md'

const formatCurrency = (amount: number, language: string) =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : 'nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)

const formatDate = (isoDate: string, language: string) =>
  new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))

const formatMonth = (monthKey: string, language: string) => {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'nl-NL', { month: 'short' }).format(date)
}

const statusBadgeClass = (status: ReturnType<typeof getInvoiceDisplayStatus>) => {
  if (status === 'betaald') return 'bg-emerald-100 text-emerald-700'
  if (status === 'vervallen') return 'bg-rose-100 text-rose-700'
  if (status === 'verzonden') return 'bg-cyan-100 text-cyan-700'
  return 'bg-slate-100 text-slate-700'
}

const statusLabel = (status: ReturnType<typeof getInvoiceDisplayStatus>, t: (key: string) => string) => {
  if (status === 'betaald') return t('common:paid')
  if (status === 'vervallen') return t('common:overdue')
  if (status === 'verzonden') return t('common:sent')
  return t('common:draft')
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation(['dashboard', 'common', 'navigation'])
  const language = i18n.language
  const { isDemoMode, userId } = useAuthStore()
  const invoices = useInvoiceStore((state) => state.invoices)
  const invoicesLoading = useInvoiceStore((state) => state.isLoading)
  const invoiceError = useInvoiceStore((state) => state.error)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const planId = useBillingStore((state) => state.getUserPlan(userId))
  const setUserPlan = useBillingStore((state) => state.setUserPlan)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    void loadInvoices(userId)
  }, [loadInvoices, userId])

  const currentMonth = new Date().toISOString().slice(0, 7)

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)
  const filteredInvoices = useMemo(() => {
    return filterInvoices(userInvoices, searchQuery)
  }, [userInvoices, searchQuery])

  const dashboardMetrics = useMemo(
    () => deriveDashboardMetrics(filteredInvoices, userId, currentMonth),
    [currentMonth, filteredInvoices, userId],
  )

  const {
    userInvoices: filteredUserInvoices,
    openInvoices,
    overdueInvoices,
    conceptInvoices,
    recentInvoices,
    openAmount,
    paidAmount,
    monthlyInvoiceCount,
    paidThisMonthCount,
    trend,
  } = dashboardMetrics

  const monthlyQuota = useMemo(
    () => canCreateInvoiceThisMonth(planId, filteredUserInvoices, userId),
    [planId, userId, filteredUserInvoices],
  )
  const quotaUsedPercent = monthlyQuota.limit
    ? Math.min(100, (monthlyQuota.usedThisMonth / monthlyQuota.limit) * 100)
    : 0
  const hasQuotaAttention = monthlyQuota.limit !== null && quotaUsedPercent >= 80
  const hasActionItems = overdueInvoices.length > 0 || conceptInvoices.length > 0 || hasQuotaAttention
  const showLoadingSkeleton = invoicesLoading && userInvoices.length === 0
  const maxTrendValue = Math.max(...trend.map((entry) => entry.paidTotal), 1)

  return (
    <main className="space-y-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#164e63_42%,#ecfeff_100%)] p-6 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.85)] sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">{t('dashboard:title')}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Focus op wat nu telt</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cyan-50/90 sm:text-base">
              {t('dashboard:hero.description')}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                {openInvoices.length} {t('common:open').toLowerCase()}
              </span>
              <span className="rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                {overdueInvoices.length} {t('common:overdue').toLowerCase()}
              </span>
              <span className="rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                {paidThisMonthCount} {t('dashboard:stats.paidThisMonth')}
              </span>
              <Link
                to="/support"
                className="rounded-full border border-cyan-200/40 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50 transition hover:bg-white/20"
              >
                {t('common:help')}?
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">{t('dashboard:quickActions.title')}</p>
            <div className="mt-3 grid gap-2">
              <Link
                to="/facturen/nieuw"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50"
              >
                {t('dashboard:actions.newInvoice')}
              </Link>
              <Link
                to="/facturen"
                className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {t('dashboard:actions.viewInvoices')}
              </Link>
              <Link
                to="/klanten"
                className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {t('dashboard:actions.manageCustomers')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {invoiceError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Er ging iets mis bij het laden van dashboarddata: {invoiceError}
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search Input */}
        <div className="sm:col-span-2 xl:col-span-4">
          <SearchInput
            placeholder="Dashboard zoeken..."
            onSearch={setSearchQuery}
            className="max-w-lg"
          />
        </div>
        
        {showLoadingSkeleton ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : null}
        {!showLoadingSkeleton ? (
          <>
        <article className={`${statCardClass} border-cyan-100 bg-gradient-to-b from-cyan-50 to-white`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('dashboard:stats.outstanding')}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatCurrency(openAmount, language)}</p>
          <p className="mt-1 text-xs text-slate-500">{openInvoices.length} {t('common:invoices').toLowerCase()}</p>
        </article>
        <article className={`${statCardClass} border-rose-100 bg-gradient-to-b from-rose-50 to-white`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('dashboard:stats.overdue')}</p>
          <p className="mt-2 text-2xl font-extrabold text-rose-700">{overdueInvoices.length}</p>
          <p className="mt-1 text-xs text-slate-500">{t('dashboard:stats.overdueDescription')}</p>
        </article>
        <article className={`${statCardClass} border-violet-100 bg-gradient-to-b from-violet-50 to-white`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('dashboard:stats.thisMonth')}</p>
          <p className="mt-2 text-2xl font-extrabold text-violet-700">{monthlyInvoiceCount}</p>
        </article>
        <article className={`${statCardClass} border-emerald-100 bg-gradient-to-b from-emerald-50 to-white`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('common:paid')}</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">{formatCurrency(paidAmount, language)}</p>
        </article>
          </>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-4">
          {userInvoices.length === 0 && !showLoadingSkeleton ? (
            <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('dashboard:gettingStarted.title')}</p>
              <h2 className="mt-2 text-xl font-extrabold text-slate-900">{t('dashboard:gettingStarted.subtitle')}</h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="rounded-lg border border-cyan-200 bg-white px-3 py-2">
                  1. {t('dashboard:gettingStarted.step1')} <Link to="/instellingen" className="font-semibold text-cyan-700 hover:underline">{t('navigation:nav.settings')}</Link>
                </li>
                <li className="rounded-lg border border-cyan-200 bg-white px-3 py-2">
                  2. {t('dashboard:gettingStarted.step2')} <Link to="/klanten" className="font-semibold text-cyan-700 hover:underline">{t('navigation:nav.customers')}</Link>
                </li>
                <li className="rounded-lg border border-cyan-200 bg-white px-3 py-2">
                  3. {t('dashboard:gettingStarted.step3')} <Link to="/facturen/nieuw" className="font-semibold text-cyan-700 hover:underline">{t('dashboard:actions.newInvoice')}</Link>
                </li>
              </ol>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('dashboard:today.title')}</p>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{t('dashboard:today.priorities')}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t('common:drafts')}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{conceptInvoices.length}</p>
                <p className="mt-1 text-xs text-slate-600">{t('dashboard:today.draftsDescription')}</p>
                <Link
                  to="/facturen"
                  className="mt-3 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  {t('common:check')}
                </Link>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t('dashboard:today.followUp')}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{openInvoices.length}</p>
                <p className="mt-1 text-xs text-slate-600">{t('dashboard:today.followUpDescription')}</p>
                <Link
                  to="/facturen"
                  className="mt-3 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  {t('common:remind')}
                </Link>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t('dashboard:today.growth')}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{monthlyInvoiceCount}</p>
                <p className="mt-1 text-xs text-slate-600">{t('dashboard:stats.thisMonth')}</p>
                <Link
                  to="/facturen/nieuw"
                  className="mt-3 inline-flex rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-100"
                >
                  {t('dashboard:actions.newInvoice')}
                </Link>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Aandacht nodig</p>
            <div className="mt-4 space-y-3">
              {overdueInvoices.length > 0 ? (
                <article className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-rose-800">Vervallen facturen</p>
                      <p className="text-xs text-rose-700">
                        {overdueInvoices.length} facturen zijn verlopen en vragen directe opvolging.
                      </p>
                    </div>
                    <Link
                      to="/facturen"
                      className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
                    >
                      Nu opvolgen
                    </Link>
                  </div>
                </article>
              ) : null}
              {conceptInvoices.length > 0 ? (
                <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Concepten klaarzetten</p>
                      <p className="text-xs text-amber-700">{conceptInvoices.length} conceptfacturen zijn nog niet verzonden.</p>
                    </div>
                    <Link
                      to="/facturen"
                      className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-100"
                    >
                      Verzenden
                    </Link>
                  </div>
                </article>
              ) : null}
              {hasQuotaAttention ? (
                <article className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-cyan-800">Maandlimiet in zicht</p>
                      <p className="text-xs text-cyan-700">
                        Je hebt {monthlyQuota.usedThisMonth} van {monthlyQuota.limit} facturen gebruikt deze maand.
                      </p>
                    </div>
                    <Link
                      to="/instellingen"
                      className="rounded-lg border border-cyan-300 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-100"
                    >
                      Bekijk plan
                    </Link>
                  </div>
                </article>
              ) : null}
              {!hasActionItems ? (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Alles staat er goed voor. Er zijn geen directe actiepunten.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Recente facturen</p>
              <Link to="/facturen" className="text-xs font-semibold text-cyan-700 hover:underline">
                Alles bekijken
              </Link>
            </div>
            {recentInvoices.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {recentInvoices.map((invoice) => {
                  const displayStatus = getInvoiceDisplayStatus(invoice)
                  return (
                    <li
                      key={invoice.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-slate-500">{invoice.clientName || t('common:unknownUser')} · {formatDate(invoice.issueDate, language)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(displayStatus)}`}>
                            {statusLabel(displayStatus, t)}
                          </span>
                          <span className="text-sm font-semibold text-slate-800">{formatCurrency(invoice.total, language)}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : !showLoadingSkeleton ? (
              <p className="mt-4 text-sm text-slate-600">Nog geen facturen beschikbaar.</p>
            ) : null}

            {showLoadingSkeleton ? (
              <div className="mt-4 space-y-2">
                <Skeleton lines={2} />
                <Skeleton lines={2} />
                <Skeleton lines={2} />
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-4">
          <RelatedSupport context="dashboard" />
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Trend</p>
              <span className="text-xs text-slate-500">Betaald laatste 6 maanden</span>
            </div>
            <div className="mt-4 grid grid-cols-6 items-end gap-2">
              {trend.map((entry) => {
                const barHeight = Math.max(10, Math.round((entry.paidTotal / maxTrendValue) * 72))
                return (
                  <div key={entry.month} className="flex flex-col items-center gap-1">
                    <div className="h-20 w-full rounded-md bg-slate-100 p-1">
                      <div
                        className="w-full rounded bg-cyan-600/80"
                        style={{ height: `${barHeight}px`, marginTop: `${80 - barHeight - 8}px` }}
                        title={`${formatMonth(entry.month, language)}: ${formatCurrency(entry.paidTotal, language)}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {formatMonth(entry.month, language)}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Abonnement</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold">{PLAN_CONFIGS[planId].name}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {planId === 'free' ? 'Starter' : 'Actief'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {monthlyQuota.limit === null
                ? 'Onbeperkt facturen per maand.'
                : `${monthlyQuota.usedThisMonth}/${monthlyQuota.limit} facturen gebruikt deze maand.`}
            </p>
            {monthlyQuota.limit !== null ? (
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-cyan-600" style={{ width: `${quotaUsedPercent}%` }} />
              </div>
            ) : null}
            {planId === 'free' ? (
              <p className="mt-3 text-xs text-slate-500">
                Upgrade naar{' '}
                <a href="/instellingen" className="font-semibold text-cyan-700 hover:underline">
                  Pro
                </a>{' '}
                voor onbeperkte facturen en extra functies.
              </p>
            ) : null}
          </section>

          {isDemoMode ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Demo modus</p>
              <p className="mt-1 text-sm text-amber-800">
                Je test lokaal met browseropslag. Koppel Supabase voor echte gebruikers en synchronisatie.
              </p>
            </section>
          ) : null}
        </div>
      </section>

      {isDev ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">🛠 Dev tools</p>
          <p className="mt-1 text-xs text-amber-600">Alleen zichtbaar tijdens ontwikkeling (import.meta.env.DEV)</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (userId) {
                  void setUserPlan(userId, 'free')
                }
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                planId === 'free'
                  ? 'border-amber-400 bg-amber-400 text-white'
                  : 'border-amber-300 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => {
                if (userId) {
                  void setUserPlan(userId, 'pro')
                }
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                planId === 'pro'
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50'
              }`}
            >
              Pro
            </button>
          </div>
        </section>
      ) : null}
    </main>
  )
}
