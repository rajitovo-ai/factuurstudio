import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RelatedSupport from '../components/support/RelatedSupport'
import { downloadInvoicePdf } from '../lib/pdf'
import ExportButton from '../components/ui/ExportButton'
import FilterPanel from '../components/ui/FilterPanel'
import SearchInput from '../components/ui/SearchInput'
import { filterInvoices } from '../lib/searchUtils'
import { TableSkeleton } from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'
import { getInvoiceDisplayStatus, useInvoiceStore } from '../stores/invoiceStore'
import { defaultCompanyProfile, useProfileStore } from '../stores/profileStore'

const formatCurrency = (amount: number, language: string, currencyCode = 'EUR') =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : 'nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const statusClassName: Record<string, string> = {
  concept: 'bg-slate-100 text-slate-700 border-slate-300',
  verzonden: 'bg-amber-50 text-amber-800 border-amber-200',
  betaald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  vervallen: 'bg-rose-50 text-rose-800 border-rose-200',
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

const statusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'concept': return t('common:draft')
    case 'verzonden': return t('common:sent')
    case 'betaald': return t('common:paid')
    case 'vervallen': return t('common:overdue')
    default: return status
  }
}

export default function InvoicesPage() {
  const { t, i18n } = useTranslation(['invoices', 'common'])
  const language = i18n.language
  const userId = useAuthStore((state) => state.userId)
  const email = useAuthStore((state) => state.email)
  const invoices = useInvoiceStore((state) => state.invoices)
  const isLoading = useInvoiceStore((state) => state.isLoading)
  const storeError = useInvoiceStore((state) => state.error)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const markInvoiceSent = useInvoiceStore((state) => state.markInvoiceSent)
  const markInvoicePaid = useInvoiceStore((state) => state.markInvoicePaid)
  const removeInvoice = useInvoiceStore((state) => state.removeInvoice)
  const profiles = useProfileStore((state) => state.profiles)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([])
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
  const [undoState, setUndoState] = useState<{ ids: string[]; label: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: null as { start: string; end: string } | null,
    minAmount: '',
    maxAmount: '',
  })
  const deleteTimersRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (userId) {
      void loadInvoices(userId)
      void loadProfile(userId)
    }
  }, [loadInvoices, loadProfile, userId])

  useEffect(() => {
    const timers = deleteTimersRef.current
    return () => {
      for (const timerId of Object.values(timers)) {
        window.clearTimeout(timerId)
      }
    }
  }, [])

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)
  const profile = userId ? profiles[userId] ?? defaultCompanyProfile : defaultCompanyProfile

  const downloadPdfForInvoice = async (invoice: (typeof userInvoices)[number]) => {
    await downloadInvoicePdf(invoice, {
      sellerProfile: profile,
      sellerName: invoice.sellerName !== undefined ? invoice.sellerName : getDefaultSellerName(email),
      sellerEmail: invoice.sellerEmail !== undefined ? invoice.sellerEmail : email,
      sellerIban: invoice.sellerIban !== undefined ? invoice.sellerIban : profile.iban,
    })
  }
  
  // Apply search filter
  const searchFilteredInvoices = useMemo(() => {
    return filterInvoices(userInvoices, searchQuery)
  }, [userInvoices, searchQuery])
  
  // Apply advanced filters
  const filteredInvoices = useMemo(() => {
    return searchFilteredInvoices.filter((invoice) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(invoice.status)) {
        return false
      }
      
      // Date range filter
      if (filters.dateRange) {
        if (invoice.issueDate < filters.dateRange.start || invoice.issueDate > filters.dateRange.end) {
          return false
        }
      }
      
      // Amount filter
      if (filters.minAmount && invoice.total < parseFloat(filters.minAmount)) {
        return false
      }
      if (filters.maxAmount && invoice.total > parseFloat(filters.maxAmount)) {
        return false
      }
      
      return true
    })
  }, [searchFilteredInvoices, filters])

  const selectableInvoices = filteredInvoices.filter(
    (invoice) => getInvoiceDisplayStatus(invoice) === 'concept'
  )
  const selectableInvoiceIds = selectableInvoices.map((invoice) => invoice.id)

  const visibleInvoices = filteredInvoices
  const allSelected = selectableInvoices.length > 0 && selectableInvoices.every((invoice) => selectedInvoiceIds.includes(invoice.id))

  const queueDeleteInvoices = (invoiceIds: string[]) => {
    const uniqueIds = [...new Set(invoiceIds)].filter((id) => !pendingDeleteIds.includes(id))
    if (uniqueIds.length === 0) return

    setPendingDeleteIds((current) => [...new Set([...current, ...uniqueIds])])
    setSelectedInvoiceIds((current) => current.filter((id) => !uniqueIds.includes(id)))
    setUndoState({
      ids: uniqueIds,
      label: uniqueIds.length === 1 ? t('invoices:undo.deleteSingle') : t('invoices:undo.deleteMultiple', { count: uniqueIds.length }),
    })

    uniqueIds.forEach((invoiceId) => {
      deleteTimersRef.current[invoiceId] = window.setTimeout(() => {
        void removeInvoice(invoiceId)
        delete deleteTimersRef.current[invoiceId]
        setPendingDeleteIds((current) => current.filter((id) => id !== invoiceId))
        setUndoState((current) => {
          if (!current) return null
          const remaining = current.ids.filter((id) => id !== invoiceId)
          if (remaining.length === 0) return null
          return { ...current, ids: remaining }
        })
      }, 5000)
    })
  }

  const undoQueuedDelete = () => {
    if (!undoState) return

    undoState.ids.forEach((invoiceId) => {
      const timerId = deleteTimersRef.current[invoiceId]
      if (timerId) {
        window.clearTimeout(timerId)
        delete deleteTimersRef.current[invoiceId]
      }
    })

    setPendingDeleteIds((current) => current.filter((id) => !undoState.ids.includes(id)))
    setUndoState(null)
  }

  const handleRemoveInvoice = async (invoiceId: string) => {
    const invoice = userInvoices.find((entry) => entry.id === invoiceId)
    if (!invoice) return

    const isPaid = getInvoiceDisplayStatus(invoice) === 'betaald'
    const warningMessage = isPaid
      ? t('invoices:deleteConfirm.paidWarning', { number: invoice.invoiceNumber })
      : t('invoices:deleteConfirm.message', { number: invoice.invoiceNumber })

    if (!window.confirm(warningMessage)) {
      return
    }

    queueDeleteInvoices([invoiceId])
  }

  const runBulkMarkSent = async () => {
    const candidates = visibleInvoices.filter((invoice) => selectedInvoiceIds.includes(invoice.id))
    await Promise.all(
      candidates
        .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'concept')
        .map((invoice) => markInvoiceSent(invoice.id)),
    )
    setSelectedInvoiceIds([])
  }

  const runBulkMarkPaid = async () => {
    const candidates = visibleInvoices.filter((invoice) => selectedInvoiceIds.includes(invoice.id))
    await Promise.all(
      candidates
        .filter((invoice) => {
          const status = getInvoiceDisplayStatus(invoice)
          return status === 'verzonden' || status === 'vervallen'
        })
        .map((invoice) => markInvoicePaid(invoice.id)),
    )
    setSelectedInvoiceIds([])
  }

  const runBulkDelete = () => {
    const candidates = visibleInvoices.filter((invoice) => selectedInvoiceIds.includes(invoice.id))
    if (candidates.length === 0) return

    if (!window.confirm(t('invoices:deleteConfirm.bulkConfirm', { count: candidates.length }))) {
      return
    }

    queueDeleteInvoices(candidates.map((invoice) => invoice.id))
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('invoices:management')}</p>
            <h1 className="mt-2 text-2xl font-extrabold">{t('invoices:allInvoices')}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {t('invoices:managementDescription')}
            </p>
            <Link to="/support" className="mt-2 inline-flex text-xs font-semibold text-cyan-700 hover:underline">
              {t('invoices:help')}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportButton invoices={visibleInvoices} selectedIds={selectedInvoiceIds} />
            <Link
              to="/facturen/importeren"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t('invoices:importPDF')}
            </Link>
            <Link
              to="/facturen/nieuw"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              {t('invoices:actions.newInvoice')}
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <RelatedSupport context="invoices" />
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <SearchInput
            placeholder={t('invoices:search')}
            onSearch={setSearchQuery}
            className="max-w-md flex-1"
          />
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({ status: [], dateRange: null, minAmount: '', maxAmount: '' })}
            resultCount={visibleInvoices.length}
          />
        </div>
        
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3">
            <p className="text-sm text-cyan-800">
              {filteredInvoices.length} {t('invoices:searchResults')} "{searchQuery}"
            </p>
          </div>
        )}
        {selectedInvoiceIds.length > 0 ? (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
            <p className="text-sm font-semibold text-cyan-800">{selectedInvoiceIds.length} {t('invoices:actions.selected')}</p>
            <button
              type="button"
              onClick={() => {
                void runBulkMarkSent()
              }}
              className="rounded-lg border border-cyan-300 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100"
            >
              {t('invoices:actions.markSent')}
            </button>
            <button
              type="button"
              onClick={() => {
                void runBulkMarkPaid()
              }}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              {t('invoices:actions.markPaid')}
            </button>
            <button
              type="button"
              onClick={runBulkDelete}
              className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              {t('invoices:actions.bulkDelete')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedInvoiceIds([])}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {t('invoices:actions.deselect')}
            </button>
          </div>
        ) : null}

        {visibleInvoices.length === 0 && !searchQuery ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {t('invoices:empty.description')}
          </div>
        ) : visibleInvoices.length === 0 && searchQuery ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {t('invoices:empty.noSearchResults')} "{searchQuery}". {t('invoices:empty.tryDifferent')}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 pr-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedInvoiceIds(selectableInvoiceIds)
                          } else {
                            setSelectedInvoiceIds([])
                          }
                        }}
                        className="h-4 w-4"
                        aria-label={t('invoices:table.selectAll')}
                      />
                    </th>
                    <th className="pb-3 font-semibold">{t('invoices:table.number')}</th>
                    <th className="pb-3 font-semibold">{t('invoices:table.customer')}</th>
                    <th className="pb-3 font-semibold">{t('invoices:table.date')}</th>
                    <th className="pb-3 font-semibold">{t('invoices:table.status')}</th>
                    <th className="pb-3 text-right font-semibold">{t('common:total')}</th>
                    <th className="pb-3 text-right font-semibold">{t('invoices:table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleInvoices.map((invoice) => {
                    const displayStatus = getInvoiceDisplayStatus(invoice)
                    const canSend = displayStatus === 'concept'
                    const canMarkPaid = displayStatus === 'verzonden' || displayStatus === 'vervallen'
                    const canDelete = true
                    const canEdit = displayStatus === 'concept'
                    const selected = selectedInvoiceIds.includes(invoice.id)
                    return (
                      <tr key={invoice.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 pr-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(event) => {
                              setSelectedInvoiceIds((current) =>
                                event.target.checked
                                  ? [...new Set([...current, invoice.id])]
                                  : current.filter((id) => id !== invoice.id),
                              )
                            }}
                            className="h-4 w-4"
                            aria-label={t('invoices:table.selectAll', { number: invoice.invoiceNumber })}
                          />
                        </td>
                        <td className="py-4 font-semibold text-slate-900">
                          <div className="inline-flex items-center gap-2">
                            <span>{invoice.invoiceNumber}</span>
                            {invoice.isImported ? (
                              <span
                                title={t('invoices:table.imported')}
                                className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-slate-500"
                              >
                                IMP
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium text-slate-900">{invoice.clientName}</p>
                          <p className="text-slate-500">{invoice.clientEmail || t('invoices:table.noEmail')}</p>
                        </td>
                        <td className="py-4 text-slate-600">{invoice.issueDate}</td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName[displayStatus]}`}>{statusLabel(displayStatus, t)}</span>
                        </td>
                        <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(invoice.total, language, invoice.currencyCode ?? 'EUR')}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2 flex-wrap">
                            {canEdit ? <Link to={`/facturen/${invoice.id}/bewerken`} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{t('common:edit')}</Link> : null}
                            <button type="button" onClick={() => downloadPdfForInvoice(invoice)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">PDF</button>
                            <button type="button" onClick={() => void markInvoiceSent(invoice.id)} disabled={!canSend} className="rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50">{t('common:sent')}</button>
                            <button type="button" onClick={() => void markInvoicePaid(invoice.id)} disabled={!canMarkPaid} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">{t('common:paid')}</button>
                            <button type="button" onClick={() => void handleRemoveInvoice(invoice.id)} disabled={!canDelete} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">{t('common:delete')}</button>
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
              {visibleInvoices.map((invoice) => {
                const displayStatus = getInvoiceDisplayStatus(invoice)
                const canSend = displayStatus === 'concept'
                const canMarkPaid = displayStatus === 'verzonden' || displayStatus === 'vervallen'
                const canDelete = true
                const canEdit = displayStatus === 'concept'
                const selected = selectedInvoiceIds.includes(invoice.id)
                return (
                  <div key={invoice.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(event) => {
                              setSelectedInvoiceIds((current) =>
                                event.target.checked
                                  ? [...new Set([...current, invoice.id])]
                                  : current.filter((id) => id !== invoice.id),
                              )
                            }}
                            className="h-4 w-4"
                          />
                          Selecteren
                        </label>
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
                      <button type="button" onClick={() => downloadPdfForInvoice(invoice)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">PDF</button>
                      <button type="button" onClick={() => void markInvoiceSent(invoice.id)} disabled={!canSend} className="rounded-lg border border-cyan-200 px-3 py-1.5 text-xs font-semibold text-cyan-700 disabled:opacity-40">Verzonden</button>
                      <button type="button" onClick={() => void markInvoicePaid(invoice.id)} disabled={!canMarkPaid} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-40">Betaald</button>
                      <button type="button" onClick={() => void handleRemoveInvoice(invoice.id)} disabled={!canDelete} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-40">Verwijder</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {isLoading && userInvoices.length === 0 ? (
          <TableSkeleton rows={5} columns={7} />
        ) : null}
        {isLoading && userInvoices.length === 0 ? <p className="mt-4 text-sm text-slate-500">{t('invoices:loading')}</p> : null}
        {storeError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{storeError}</p> : null}

        {undoState ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">{undoState.label} {t('invoices:undo.confirmDelete')}</p>
            <button
              type="button"
              onClick={undoQueuedDelete}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              {t('invoices:undo.undoAction')}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
