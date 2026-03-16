import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { canCreateInvoiceThisMonth, PLAN_CONFIGS } from '../../lib/billing'
import { downloadInvoicePdf } from '../../lib/pdf'
import { getNextInvoiceNumber } from '../../lib/invoiceNumber'
import { useAuthStore } from '../../stores/authStore'
import { useBillingStore } from '../../stores/billingStore'
import type { StoredInvoice } from '../../stores/invoiceStore'
import { useInvoiceStore } from '../../stores/invoiceStore'
import { defaultCompanyProfile, useProfileStore } from '../../stores/profileStore'

const GUEST_DL_KEY = 'factuurstudio.guest.hasDownloaded'
const hasUsedGuestDownload = () => Boolean(localStorage.getItem(GUEST_DL_KEY))
const markGuestDownloadUsed = () => localStorage.setItem(GUEST_DL_KEY, '1')

type InvoiceLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

const formatCurrency = (amount: number, currencyCode = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const formatDate = (isoDate: string) => {
  if (!isoDate) return '-'
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

const createDefaultDueDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

const currencyOptions = ['EUR', 'USD', 'GBP']

type Props = {
  editInvoice?: StoredInvoice
  guestMode?: boolean
}

export default function InvoiceGenerator({ editInvoice, guestMode = false }: Props = {}) {
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.userId)
  const invoices = useInvoiceStore((state) => state.invoices)
  const createInvoice = useInvoiceStore((state) => state.createInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const planId = useBillingStore((state) => state.getUserPlan(userId))
  const profiles = useProfileStore((state) => state.profiles)
  const loadProfile = useProfileStore((state) => state.loadProfile)
  const profile = userId ? profiles[userId] ?? defaultCompanyProfile : defaultCompanyProfile
  const [invoiceNumber, setInvoiceNumber] = useState(() =>
    editInvoice ? editInvoice.invoiceNumber : getNextInvoiceNumber(invoices, userId),
  )
  const [issueDate, setIssueDate] = useState(
    editInvoice ? editInvoice.issueDate : new Date().toISOString().slice(0, 10),
  )
  const [dueDate, setDueDate] = useState(editInvoice ? editInvoice.dueDate : createDefaultDueDate())
  const [pricingMode, setPricingMode] = useState<'excl' | 'incl'>(editInvoice?.pricingMode ?? 'excl')
  const [noVat, setNoVat] = useState(false)
  const [currencyCode, setCurrencyCode] = useState(editInvoice?.currencyCode ?? 'EUR')
  const [clientName, setClientName] = useState(editInvoice?.clientName ?? '')
  const [clientEmail, setClientEmail] = useState(editInvoice?.clientEmail ?? '')
  const [companyName, setCompanyName] = useState(
    editInvoice ? editInvoice.companyName : profile.companyName,
  )
  const [companyLogoDataUrl, setCompanyLogoDataUrl] = useState<string | null>(
    editInvoice ? (editInvoice.logoDataUrl ?? null) : profile.logoDataUrl,
  )
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showUpsell, setShowUpsell] = useState(() => guestMode && hasUsedGuestDownload())
  const [lines, setLines] = useState<InvoiceLine[]>(
    editInvoice
      ? editInvoice.lines
      : [{ id: 1, description: 'Webdesign en ontwikkeling', quantity: 1, unitPrice: 750, vatRate: 21 }],
  )

  useEffect(() => {
    if (!guestMode && userId) {
      void loadProfile(userId)
    }
  }, [guestMode, loadProfile, userId])

  useEffect(() => {
    if (editInvoice || guestMode) return

    if (!companyName && profile.companyName) {
      setCompanyName(profile.companyName)
    }

    if (!companyLogoDataUrl && profile.logoDataUrl) {
      setCompanyLogoDataUrl(profile.logoDataUrl)
    }
  }, [companyLogoDataUrl, companyName, editInvoice, guestMode, profile.companyName, profile.logoDataUrl])

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => {
      const vatRate = noVat ? 0 : line.vatRate
      const lineBase =
        pricingMode === 'incl'
          ? (line.quantity * line.unitPrice) / (1 + vatRate / 100)
          : line.quantity * line.unitPrice
      return sum + lineBase
    }, 0)

    const vatTotal = lines.reduce((sum, line) => {
      const vatRate = noVat ? 0 : line.vatRate
      const lineBase =
        pricingMode === 'incl'
          ? (line.quantity * line.unitPrice) / (1 + vatRate / 100)
          : line.quantity * line.unitPrice
      return sum + lineBase * (vatRate / 100)
    }, 0)

    const total =
      pricingMode === 'incl'
        ? lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
        : subtotal + vatTotal

    return {
      subtotal,
      vatTotal,
      total,
    }
  }, [lines, pricingMode, noVat])

  const updateLine = (id: number, field: keyof InvoiceLine, value: string) => {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line

        if (field === 'description') {
          return { ...line, description: value }
        }

        if (field === 'vatRate') {
          return { ...line, vatRate: Number(value) as 0 | 9 | 21 }
        }

        const parsed = Number(value)
        return { ...line, [field]: Number.isNaN(parsed) ? 0 : parsed }
      }),
    )
  }

  const addLine = () => {
    const nextId = lines.length ? Math.max(...lines.map((line) => line.id)) + 1 : 1
    setLines((current) => [
      ...current,
      { id: nextId, description: '', quantity: 1, unitPrice: 0, vatRate: 21 },
    ])
  }

  const removeLine = (id: number) => {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current))
  }

  const saveInvoice = async () => {
    setSaveError(null)

    if (guestMode) {
      if (showUpsell) {
        // Already used the free download — scroll to upsell
        return
      }
      if (!clientName.trim()) {
        setSaveError('Vul eerst een klantnaam in.')
        return
      }
      const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
      if (!hasValidLine) {
        setSaveError('Voeg minimaal een geldige factuurregel toe.')
        return
      }
      const tempInvoice: StoredInvoice = {
        id: 'guest',
        userId: 'guest',
        invoiceNumber,
        companyName,
        logoDataUrl: companyLogoDataUrl,
        clientName,
        clientEmail,
        issueDate,
        dueDate,
        currencyCode,
        pricingMode,
        subtotal: totals.subtotal,
        vatTotal: totals.vatTotal,
        total: totals.total,
        status: 'concept',
        lines: lines.map((line) => ({ ...line, vatRate: noVat ? 0 : line.vatRate })),
        createdAt: new Date().toISOString(),
      }
      downloadInvoicePdf(tempInvoice)
      markGuestDownloadUsed()
      setShowUpsell(true)
      return
    }

    if (!userId) {
      setSaveError('Geen actieve gebruiker gevonden. Log opnieuw in.')
      return
    }

    if (!clientName.trim()) {
      setSaveError('Vul eerst een klantnaam in.')
      return
    }

    const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
    if (!hasValidLine) {
      setSaveError('Voeg minimaal een geldige factuurregel toe.')
      return
    }

    const savedLines = lines.map((line) => ({ ...line, vatRate: noVat ? 0 : line.vatRate }))

    if (editInvoice) {
      const ok = await updateInvoice(editInvoice.id, {
        invoiceNumber,
        companyName,
        logoDataUrl: companyLogoDataUrl,
        clientName,
        clientEmail,
        issueDate,
        dueDate,
        currencyCode,
        pricingMode,
        subtotal: totals.subtotal,
        vatTotal: totals.vatTotal,
        total: totals.total,
        lines: savedLines,
      })

      if (!ok) {
        setSaveError('Opslaan van wijzigingen is mislukt. Probeer opnieuw.')
        return
      }
    } else {
      const quota = canCreateInvoiceThisMonth(planId, invoices, userId)
      if (!quota.allowed) {
        setSaveError(
          `Je ${PLAN_CONFIGS[planId].name}-plan heeft een limiet van ${quota.limit} facturen per maand. Upgrade naar Pro voor onbeperkt.`,
        )
        return
      }

      const ok = await createInvoice({
        userId,
        invoiceNumber,
        companyName,
        logoDataUrl: companyLogoDataUrl,
        clientName,
        clientEmail,
        issueDate,
        dueDate,
        currencyCode,
        pricingMode,
        subtotal: totals.subtotal,
        vatTotal: totals.vatTotal,
        total: totals.total,
        status: 'concept',
        lines: savedLines,
      })

      if (!ok) {
        setSaveError('Factuur opslaan is mislukt. Probeer opnieuw.')
        return
      }

      await loadInvoices(userId, true)
      setInvoiceNumber(getNextInvoiceNumber(useInvoiceStore.getState().invoices, userId))
    }

    navigate('/facturen')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-white px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
            {guestMode ? 'Gratis proberen' : editInvoice ? 'Factuur bewerken' : 'Nieuwe factuur'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            {editInvoice ? `Factuur ${editInvoice.invoiceNumber}` : 'FactuurStudio Generator'}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            {guestMode
              ? 'Vul je factuurgegevens in en download hem 1\u00d7 gratis als PDF. Geen account vereist.'
              : editInvoice
                ? 'Pas de gegevens aan en sla op. Alleen conceptfacturen kunnen worden bewerkt.'
                : 'Client-side formulier met automatische BTW-berekening (21/9/0) en live factuurpreview.'}
          </p>
          {showUpsell && guestMode ? (
            <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="font-bold text-cyan-900">Je gratis PDF is gedownload! ✅</p>
              <p className="mt-1 text-sm text-cyan-800">
                Maak een gratis account aan om onbeperkt facturen aan te maken, op te slaan en te
                downloaden — inclusief statusbeheer en klantoverzicht.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Account aanmaken →
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Al een account? Inloggen
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                  onClick={() => {
                    void saveInvoice()
                  }}
                className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
              >
                {guestMode ? 'PDF downloaden (1× gratis)' : editInvoice ? 'Wijzigingen opslaan' : 'Factuur opslaan'}
              </button>
              {!guestMode ? (
                <button
                  type="button"
                  onClick={() => navigate('/facturen')}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Naar overzicht
                </button>
              ) : (
                <Link
                  to="/register"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Account aanmaken
                </Link>
              )}
            </div>
          )}
          {saveError ? (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </p>
          ) : null}
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold">Factuur invoer</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Factuurnummer</span>
                <input
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Bedrijfsnaam</span>
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Factuurdatum</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Vervaldatum</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Prijsmodus</span>
                <select
                  value={pricingMode}
                  onChange={(event) => setPricingMode(event.target.value as 'excl' | 'incl')}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                >
                  <option value="excl">Prijzen exclusief BTW</option>
                  <option value="incl">Prijzen inclusief BTW</option>
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={noVat}
                  onChange={(event) => setNoVat(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                />
                <span className="text-sm font-medium text-slate-700">Geen BTW toepassen op deze factuur</span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Valuta</span>
                <select
                  value={currencyCode}
                  onChange={(event) => setCurrencyCode(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Klantnaam</span>
                <input
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Bijv. Studio Noord"
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Klant e-mail</span>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder="contact@bedrijf.nl"
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold">Factuurregels</h3>
                <button
                  type="button"
                  onClick={addLine}
                  className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Regel toevoegen
                </button>
              </div>

              <div className="space-y-3">
                {lines.map((line) => (
                  <div key={line.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3">
                    <input
                      value={line.description}
                      onChange={(event) => updateLine(line.id, 'description', event.target.value)}
                      placeholder="Omschrijving"
                      className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <label className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-500">Aantal</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={line.quantity}
                          onChange={(event) => updateLine(line.id, 'quantity', event.target.value)}
                          className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-500">Prijs</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(event) => updateLine(line.id, 'unitPrice', event.target.value)}
                          className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-500">BTW</span>
                        <select
                          value={noVat ? 0 : line.vatRate}
                          onChange={(event) => updateLine(line.id, 'vatRate', event.target.value)}
                          disabled={noVat}
                          className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                        >
                          <option value={21}>21%</option>
                          <option value={9}>9%</option>
                          <option value={0}>0%</option>
                        </select>
                      </label>
                      <div className="flex flex-col justify-end">
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="rounded-lg border border-rose-200 px-2 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold">Live Preview</h2>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Van</p>
                  <p className="mt-1 text-lg font-bold">{companyName || 'Jouw bedrijf'}</p>
                  {companyLogoDataUrl ? (
                    <img
                      src={companyLogoDataUrl}
                      alt="Bedrijfslogo"
                      className="mt-2 max-h-14 w-auto rounded border border-slate-200 bg-white p-1"
                    />
                  ) : null}
                </div>
                <div className="text-sm text-slate-600 sm:text-right">
                  <p>
                    Factuurnr: <span className="font-semibold text-slate-900">{invoiceNumber}</span>
                  </p>
                  <p>Datum: {formatDate(issueDate)}</p>
                  <p>Vervaldatum: {formatDate(dueDate)}</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aan</p>
                <p className="mt-1 font-semibold text-slate-900">{clientName || 'Klantnaam ontbreekt'}</p>
                <p className="text-sm text-slate-600">{clientEmail || 'E-mail ontbreekt'}</p>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="pb-2 font-semibold">Omschrijving</th>
                      <th className="pb-2 font-semibold">Aantal</th>
                      <th className="pb-2 font-semibold">Prijs</th>
                      <th className="pb-2 font-semibold">BTW</th>
                      <th className="pb-2 text-right font-semibold">Totaal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => {
                      const vatRate = noVat ? 0 : line.vatRate
                      const lineSubtotal =
                        pricingMode === 'incl'
                          ? (line.quantity * line.unitPrice) / (1 + vatRate / 100)
                          : line.quantity * line.unitPrice
                      const lineTotal = lineSubtotal + lineSubtotal * (vatRate / 100)

                      return (
                        <tr key={line.id} className="border-b border-slate-100">
                          <td className="py-2">{line.description || '-'}</td>
                          <td className="py-2">{line.quantity}</td>
                          <td className="py-2">{formatCurrency(line.unitPrice, currencyCode)}</td>
                          <td className="py-2">{vatRate}%</td>
                          <td className="py-2 text-right font-semibold">{formatCurrency(lineTotal, currencyCode)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Subtotaal</span>
                  <span>{formatCurrency(totals.subtotal, currencyCode)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">BTW</span>
                  <span>{formatCurrency(totals.vatTotal, currencyCode)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-extrabold">
                  <span>Totaal</span>
                  <span>{formatCurrency(totals.total, currencyCode)}</span>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
