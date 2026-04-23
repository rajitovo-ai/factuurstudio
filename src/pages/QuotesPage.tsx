import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadQuotePdf } from '../lib/quotePdf'
import { useAuthStore } from '../stores/authStore'
import { defaultCompanyProfile, useProfileStore } from '../stores/profileStore'
import { getQuoteDisplayStatus, useQuoteStore } from '../stores/quoteStore'

const formatCurrency = (amount: number, currencyCode = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const statusClassName: Record<string, string> = {
  concept: 'bg-slate-100 text-slate-700 border-slate-300',
  verzonden: 'bg-amber-50 text-amber-800 border-amber-200',
  goedgekeurd: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  afgewezen: 'bg-rose-50 text-rose-800 border-rose-200',
  vervallen: 'bg-orange-50 text-orange-800 border-orange-200',
}

const getDefaultSellerName = (email: string | null): string => {
  if (!email) return ''
  const localPart = email.split('@')[0]?.trim()
  if (!localPart) return ''
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function QuotesPage() {
  const userId = useAuthStore((state) => state.userId)
  const email = useAuthStore((state) => state.email)
  const quotes = useQuoteStore((state) => state.quotes)
  const isLoading = useQuoteStore((state) => state.isLoading)
  const storeError = useQuoteStore((state) => state.error)
  const loadQuotes = useQuoteStore((state) => state.loadQuotes)
  const markQuoteSent = useQuoteStore((state) => state.markQuoteSent)
  const markQuoteRejected = useQuoteStore((state) => state.markQuoteRejected)
  const markQuoteApproved = useQuoteStore((state) => state.markQuoteApproved)
  const removeQuote = useQuoteStore((state) => state.removeQuote)
  const clearError = useQuoteStore((state) => state.clearError)
  const [actionQuoteId, setActionQuoteId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const profiles = useProfileStore((state) => state.profiles)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const profile = userId ? profiles[userId] ?? defaultCompanyProfile : defaultCompanyProfile

  useEffect(() => {
    if (userId) {
      void loadQuotes(userId)
      void loadProfile(userId)
    }
  }, [loadProfile, loadQuotes, userId])

  const userQuotes = useMemo(
    () => quotes.filter((quote) => quote.userId === userId),
    [quotes, userId],
  )

  const runQuoteAction = async (quoteId: string, action: () => Promise<boolean>, successText?: string) => {
    setSuccessMessage(null)
    clearError()
    setActionQuoteId(quoteId)

    try {
      const ok = await action()
      if (ok && successText) {
        setSuccessMessage(successText)
      }
    } finally {
      setActionQuoteId(null)
    }
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Offertebeheer</p>
            <h1 className="mt-2 text-2xl font-extrabold">Alle offertes</h1>
            <p className="mt-2 text-sm text-slate-600">
              Volg de keten offerte &gt; goedgekeurd &gt; factuur &gt; betaald. Bij goedkeuren maken we automatisch een conceptfactuur aan.
            </p>
          </div>
          <Link
            to="/offertes/nieuw"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Nieuwe offerte
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {userQuotes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Nog geen offertes. Maak je eerste offerte aan.
          </div>
        ) : (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="pb-3 font-semibold">Offertenummer</th>
                  <th className="pb-3 font-semibold">Klant</th>
                  <th className="pb-3 font-semibold">Datum</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Totaal</th>
                  <th className="pb-3 text-right font-semibold">Acties</th>
                </tr>
              </thead>
              <tbody>
                {userQuotes.map((quote) => {
                  const displayStatus = getQuoteDisplayStatus(quote)
                  const isActing = actionQuoteId === quote.id
                  const canSend = quote.status === 'concept'
                  const canApprove = quote.status === 'verzonden'
                  const canReject = quote.status === 'verzonden'
                  const canEdit = quote.status === 'concept'
                  const canDelete = quote.status === 'concept'

                  return (
                    <tr key={quote.id} className="border-b border-slate-100 align-top">
                      <td className="py-4 font-semibold text-slate-900">{quote.quoteNumber}</td>
                      <td className="py-4">
                        <p className="font-medium text-slate-900">{quote.clientName}</p>
                        <p className="text-slate-500">{quote.clientEmail || 'Geen e-mail'}</p>
                      </td>
                      <td className="py-4 text-slate-600">{quote.issueDate}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName[displayStatus]}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(quote.total, quote.currencyCode)}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2 flex-wrap">
                          {canEdit ? (
                            <Link
                              to={`/offertes/${quote.id}/bewerken`}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Bewerken
                            </Link>
                          ) : null}
                          <button
                            type="button"
                            onClick={async () =>
                              await downloadQuotePdf(quote, {
                                companyProfile: profile,
                                sellerName: quote.sellerName?.trim() || getDefaultSellerName(email),
                                sellerEmail: quote.sellerEmail?.trim() || email,
                                sellerPhone: quote.sellerPhone?.trim() || undefined,
                                sellerKvk: quote.sellerKvk?.trim() || profile.kvkNumber,
                                sellerIban: quote.sellerIban?.trim() || profile.iban,
                              })
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void runQuoteAction(
                                quote.id,
                                () => markQuoteSent(quote.id),
                                `Offerte ${quote.quoteNumber} is op verzonden gezet.`,
                              )
                            }}
                            disabled={!canSend || isActing}
                            className="rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isActing ? 'Bezig...' : 'Verzenden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void runQuoteAction(
                                quote.id,
                                () => markQuoteApproved(quote.id),
                                `Offerte ${quote.quoteNumber} is goedgekeurd en omgezet naar conceptfactuur.`,
                              )
                            }}
                            disabled={!canApprove || isActing}
                            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Goedkeuren -&gt; Factuur
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void runQuoteAction(
                                quote.id,
                                () => markQuoteRejected(quote.id),
                                `Offerte ${quote.quoteNumber} is afgewezen.`,
                              )
                            }}
                            disabled={!canReject || isActing}
                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Afwijzen
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void runQuoteAction(
                                quote.id,
                                () => removeQuote(quote.id),
                                `Offerte ${quote.quoteNumber} is verwijderd.`,
                              )
                            }}
                            disabled={!canDelete || isActing}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Verwijderen
                          </button>
                          {quote.convertedInvoiceId ? (
                            <Link
                              to="/facturen"
                              className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                            >
                              Factuur aangemaakt
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Offertes laden...</p> : null}
        {successMessage ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p> : null}
        {storeError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{storeError}</p> : null}
      </section>
    </main>
  )
}
