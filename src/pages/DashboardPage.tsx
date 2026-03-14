import { useAuthStore } from '../stores/authStore'
import { getInvoiceDisplayStatus, useInvoiceStore } from '../stores/invoiceStore'

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

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)
  const openAmount = userInvoices
    .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'verzonden')
    .reduce((sum, invoice) => sum + invoice.total, 0)
  const paidAmount = userInvoices
    .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'betaald')
    .reduce((sum, invoice) => sum + invoice.total, 0)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyInvoiceCount = userInvoices.filter((invoice) => invoice.issueDate.startsWith(currentMonth)).length

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
    </main>
  )
}
