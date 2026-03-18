import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { downloadInvoicePdf } from '../lib/pdf'
import { useAuthStore } from '../stores/authStore'
import { getInvoiceDisplayStatus, useInvoiceStore } from '../stores/invoiceStore'

const formatCurrency = (amount: number, currencyCode = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const statusClassName: Record<string, string> = {
  concept: 'bg-slate-100 text-slate-700 border-slate-300',
  verzonden: 'bg-amber-50 text-amber-800 border-amber-200',
  betaald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  vervallen: 'bg-rose-50 text-rose-800 border-rose-200',
}

export default function InvoicesPage() {
  const userId = useAuthStore((state) => state.userId)
  const invoices = useInvoiceStore((state) => state.invoices)
  const isLoading = useInvoiceStore((state) => state.isLoading)
  const storeError = useInvoiceStore((state) => state.error)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const markInvoiceSent = useInvoiceStore((state) => state.markInvoiceSent)
  const markInvoicePaid = useInvoiceStore((state) => state.markInvoicePaid)
  const removeInvoice = useInvoiceStore((state) => state.removeInvoice)

  useEffect(() => {
    if (userId) {
      void loadInvoices(userId)
    }
  }, [loadInvoices, userId])

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Factuurbeheer</p>
            <h1 className="mt-2 text-2xl font-extrabold">Alle facturen</h1>
            <p className="mt-2 text-sm text-slate-600">
              Concept opstellen, verzenden, PDF downloaden en daarna als betaald markeren.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/facturen/importeren"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Importeer PDF
            </Link>
            <Link
              to="/facturen/nieuw"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Nieuwe factuur
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {userInvoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Nog geen facturen opgeslagen. Maak je eerste testfactuur aan via 'Nieuwe factuur'.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 font-semibold">Factuurnummer</th>
                    <th className="pb-3 font-semibold">Klant</th>
                    <th className="pb-3 font-semibold">Datum</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 text-right font-semibold">Totaal</th>
                    <th className="pb-3 text-right font-semibold">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {userInvoices.map((invoice) => {
                    const displayStatus = getInvoiceDisplayStatus(invoice)
                    const canSend = displayStatus === 'concept'
                    const canMarkPaid = displayStatus === 'verzonden' || displayStatus === 'vervallen'
                    const canDelete = displayStatus === 'concept'
                    const canEdit = displayStatus === 'concept'
                    return (
                      <tr key={invoice.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 font-semibold text-slate-900">
                          <div className="inline-flex items-center gap-2">
                            <span>{invoice.invoiceNumber}</span>
                            {invoice.isImported ? (
                              <span
                                title="Geimporteerde factuur"
                                className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-slate-500"
                              >
                                IMP
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium text-slate-900">{invoice.clientName}</p>
                          <p className="text-slate-500">{invoice.clientEmail || 'Geen e-mail'}</p>
                        </td>
                        <td className="py-4 text-slate-600">{invoice.issueDate}</td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName[displayStatus]}`}>{displayStatus}</span>
                        </td>
                        <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(invoice.total, invoice.currencyCode ?? 'EUR')}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2 flex-wrap">
                            {canEdit ? <Link to={`/facturen/${invoice.id}/bewerken`} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Bewerken</Link> : null}
                            <button type="button" onClick={() => downloadInvoicePdf(invoice)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">PDF</button>
                            <button type="button" onClick={() => void markInvoiceSent(invoice.id)} disabled={!canSend} className="rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50">Verzonden</button>
                            <button type="button" onClick={() => void markInvoicePaid(invoice.id)} disabled={!canMarkPaid} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">Betaald</button>
                            <button type="button" onClick={() => void removeInvoice(invoice.id)} disabled={!canDelete} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">Verwijder</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {userInvoices.map((invoice) => {
                const displayStatus = getInvoiceDisplayStatus(invoice)
                const canSend = displayStatus === 'concept'
                const canMarkPaid = displayStatus === 'verzonden' || displayStatus === 'vervallen'
                const canDelete = displayStatus === 'concept'
                const canEdit = displayStatus === 'concept'
                return (
                  <div key={invoice.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="inline-flex items-center gap-2">
                          <p className="font-bold text-slate-900">{invoice.invoiceNumber}</p>
                          {invoice.isImported ? (
                            <span
                              title="Geimporteerde factuur"
                              className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-slate-500"
                            >
                              IMP
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium text-slate-700">{invoice.clientName}</p>
                        <p className="text-xs text-slate-500">{invoice.issueDate}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClassName[displayStatus]}`}>{displayStatus}</span>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(invoice.total, invoice.currencyCode ?? 'EUR')}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {canEdit ? <Link to={`/facturen/${invoice.id}/bewerken`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Bewerken</Link> : null}
                      <button type="button" onClick={() => downloadInvoicePdf(invoice)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">PDF</button>
                      <button type="button" onClick={() => void markInvoiceSent(invoice.id)} disabled={!canSend} className="rounded-lg border border-cyan-200 px-3 py-1.5 text-xs font-semibold text-cyan-700 disabled:opacity-40">Verzonden</button>
                      <button type="button" onClick={() => void markInvoicePaid(invoice.id)} disabled={!canMarkPaid} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-40">Betaald</button>
                      <button type="button" onClick={() => void removeInvoice(invoice.id)} disabled={!canDelete} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-40">Verwijder</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Facturen laden...</p> : null}
        {storeError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{storeError}</p> : null}
      </section>
    </main>
  )
}
