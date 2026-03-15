import { PLAN_CONFIGS, canCreateInvoiceThisMonth } from '../lib/billing'
import { useAuthStore } from '../stores/authStore'
import { useBillingStore } from '../stores/billingStore'
import { getInvoiceDisplayStatus, useInvoiceStore } from '../stores/invoiceStore'

const isDev = import.meta.env.DEV

const statCardClass =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)

export default function DashboardPage() {
  const { isDemoMode, userId } = useAuthStore()
  const invoices = useInvoiceStore((state) => state.invoices)
  const planId = useBillingStore((state) => state.getUserPlan(userId))
  const setUserPlan = useBillingStore((state) => state.setUserPlan)

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)
  const openAmount = userInvoices
    .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'verzonden')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const paidAmount = userInvoices
    .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'betaald')
    .reduce((sum, invoice) => sum + invoice.total, 0)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyInvoiceCount = userInvoices.filter((invoice) => invoice.issueDate.startsWith(currentMonth)).length
  const monthlyQuota = canCreateInvoiceThisMonth(planId, invoices, userId)

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Dashboard</p>
        <h1 className="mt-2 text-2xl font-extrabold">Welkom terug</h1>
        <p className="mt-2 text-sm text-slate-600">
          Overzicht van je factuuractiviteit.
        </p>
        {isDemoMode ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Je test nu lokaal met browseropslag. Voor echte gebruikers, synchronisatie en databasegegevens koppel je later Supabase.
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className={statCardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Openstaand</p>
          <p className="mt-2 text-2xl font-extrabold">{formatCurrency(openAmount)}</p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Facturen deze maand</p>
          <p className="mt-2 text-2xl font-extrabold">{monthlyInvoiceCount}</p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Betaald</p>
          <p className="mt-2 text-2xl font-extrabold">{formatCurrency(paidAmount)}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Abonnement</p>
        <h2 className="mt-2 text-xl font-extrabold">{PLAN_CONFIGS[planId].name}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {monthlyQuota.limit === null
            ? 'Onbeperkt facturen per maand.'
            : `${monthlyQuota.usedThisMonth}/${monthlyQuota.limit} facturen gebruikt deze maand.`}
        </p>
        {monthlyQuota.limit !== null ? (
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-cyan-600"
              style={{ width: `${Math.min(100, (monthlyQuota.usedThisMonth / monthlyQuota.limit) * 100)}%` }}
            />
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
