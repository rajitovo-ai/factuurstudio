import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { downloadQuotePdf } from '../../lib/quotePdf'
import { useAuthStore } from '../../stores/authStore'
import type { CustomerProfile } from '../../stores/customerStore'
import { useCustomerStore } from '../../stores/customerStore'
import { defaultCompanyProfile, useProfileStore } from '../../stores/profileStore'
import type { StoredQuote } from '../../stores/quoteStore'
import { useQuoteStore } from '../../stores/quoteStore'
import { getNextQuoteNumber } from '../../lib/quoteNumber'

type QuoteLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

type Props = {
  editQuote?: StoredQuote
}

const EMPTY_CUSTOMERS: CustomerProfile[] = []

const createDefaultDueDate = (): string => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

const createDueDateFromIssueDate = (issueDate: string, termDays: number): string => {
  const base = issueDate ? new Date(`${issueDate}T00:00:00`) : new Date()
  const safeDays = Math.max(0, Math.round(termDays))
  base.setDate(base.getDate() + safeDays)
  return base.toISOString().slice(0, 10)
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

const formatCurrency = (amount: number, currencyCode = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const DEFAULT_QUOTE_DESCRIPTION =
  'Dank voor je aanvraag. Met deze offerte leveren we de afgesproken werkzaamheden en support zoals besproken. Na akkoord plannen we de start direct in.'

export default function QuoteGenerator({ editQuote }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userId = useAuthStore((state) => state.userId)
  const email = useAuthStore((state) => state.email)
  const quotes = useQuoteStore((state) => state.quotes)
  const createQuote = useQuoteStore((state) => state.createQuote)
  const updateQuote = useQuoteStore((state) => state.updateQuote)
  const customersByUser = useCustomerStore((state) => state.customersByUser)
  const loadCustomers = useCustomerStore((state) => state.loadCustomers)
  const profiles = useProfileStore((state) => state.profiles)
  const loadProfile = useProfileStore((state) => state.loadProfile)

  const profile = userId ? profiles[userId] ?? defaultCompanyProfile : defaultCompanyProfile
  const customers = useMemo(
    () => (userId ? (customersByUser[userId] ?? EMPTY_CUSTOMERS) : EMPTY_CUSTOMERS),
    [customersByUser, userId],
  )

  const [quoteNumber, setQuoteNumber] = useState(() =>
    editQuote ? editQuote.quoteNumber : getNextQuoteNumber(quotes, userId),
  )
  const [sellerName, setSellerName] = useState(editQuote?.sellerName ?? getDefaultSellerName(email))
  const [sellerEmail, setSellerEmail] = useState(editQuote?.sellerEmail ?? (email ?? ''))
  const [sellerPhone, setSellerPhone] = useState(editQuote?.sellerPhone ?? '')
  const [sellerKvk, setSellerKvk] = useState(editQuote?.sellerKvk ?? profile.kvkNumber)
  const [sellerIban, setSellerIban] = useState(editQuote?.sellerIban ?? profile.iban)
  const [showSellerIban, setShowSellerIban] = useState(
    editQuote ? Boolean(editQuote.sellerIban?.trim()) : Boolean(profile.iban),
  )
  const [companyName, setCompanyName] = useState(editQuote?.companyName ?? '')
  const [clientName, setClientName] = useState(editQuote?.clientName ?? '')
  const [clientEmail, setClientEmail] = useState(editQuote?.clientEmail ?? '')
  const [clientContactName, setClientContactName] = useState(editQuote?.clientContactName ?? '')
  const [clientPhone, setClientPhone] = useState(editQuote?.clientPhone ?? '')
  const [clientAddress, setClientAddress] = useState(editQuote?.clientAddress ?? '')
  const [clientPostalCode, setClientPostalCode] = useState(editQuote?.clientPostalCode ?? '')
  const [clientCity, setClientCity] = useState(editQuote?.clientCity ?? '')
  const [clientCountry, setClientCountry] = useState(editQuote?.clientCountry ?? 'NL')
  const [clientKvkNumber, setClientKvkNumber] = useState(editQuote?.clientKvkNumber ?? '')
  const [clientBtwNumber, setClientBtwNumber] = useState(editQuote?.clientBtwNumber ?? '')
  const [clientIban, setClientIban] = useState(editQuote?.clientIban ?? '')
  const [clientPaymentTermDays, setClientPaymentTermDays] = useState(editQuote?.clientPaymentTermDays ?? 14)
  const [clientNotes, setClientNotes] = useState(editQuote?.clientNotes ?? '')
  const [issueDate, setIssueDate] = useState(
    editQuote ? editQuote.issueDate : new Date().toISOString().slice(0, 10),
  )
  const [dueDate, setDueDate] = useState(editQuote?.dueDate ?? createDefaultDueDate())
  const [quoteDescription, setQuoteDescription] = useState(editQuote?.quoteDescription ?? DEFAULT_QUOTE_DESCRIPTION)
  const [discountDescription, setDiscountDescription] = useState(editQuote?.discountDescription ?? '')
  const [discountAmount, setDiscountAmount] = useState(editQuote?.discountAmount ?? 0)
  const [currencyCode, setCurrencyCode] = useState(editQuote?.currencyCode ?? 'EUR')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lines, setLines] = useState<QuoteLine[]>(
    editQuote?.lines ?? [{ id: 1, description: 'Werkzaamheden', quantity: 1, unitPrice: 750, vatRate: 21 }],
  )
  const hasAppliedQueryCustomer = useRef(false)

  useEffect(() => {
    if (userId) {
      void loadProfile(userId)
      void loadCustomers(userId)
    }
  }, [loadCustomers, loadProfile, userId])

  useEffect(() => {
    if (!editQuote && !companyName.trim() && profile.companyName.trim()) {
      setCompanyName(profile.companyName)
    }
  }, [companyName, editQuote, profile.companyName])

  useEffect(() => {
    if (!editQuote && !sellerName.trim()) {
      const defaultName = getDefaultSellerName(email)
      if (defaultName) {
        setSellerName(defaultName)
      }
    }
  }, [editQuote, email, sellerName])

  useEffect(() => {
    if (editQuote) {
      return
    }

    if (!sellerEmail.trim() && email) {
      setSellerEmail(email)
    }

    if (!sellerIban.trim() && profile.iban) {
      setSellerIban(profile.iban)
      setShowSellerIban(true)
    }
    if (!sellerKvk.trim() && profile.kvkNumber) {
      setSellerKvk(profile.kvkNumber)
    }
  }, [editQuote, email, profile.iban, profile.kvkNumber, sellerEmail, sellerIban, sellerKvk])

  useEffect(() => {
    if (editQuote || hasAppliedQueryCustomer.current) {
      return
    }

    const customerId = searchParams.get('customerId')
    if (!customerId) {
      hasAppliedQueryCustomer.current = true
      return
    }

    const selectedCustomer = customers.find((customer) => customer.id === customerId)
    if (!selectedCustomer) {
      return
    }

    setClientName(selectedCustomer.companyName || selectedCustomer.name)
    setClientEmail(selectedCustomer.email)
    setClientContactName(selectedCustomer.name)
    setClientPhone(selectedCustomer.phone)
    setClientAddress(selectedCustomer.address)
    setClientPostalCode(selectedCustomer.postalCode)
    setClientCity(selectedCustomer.city)
    setClientCountry(selectedCustomer.country || 'NL')
    setClientKvkNumber(selectedCustomer.kvkNumber)
    setClientBtwNumber(selectedCustomer.btwNumber)
    setClientIban(selectedCustomer.iban)
    setClientPaymentTermDays(selectedCustomer.paymentTermDays)
    setClientNotes(selectedCustomer.notes)
    setDueDate(createDueDateFromIssueDate(issueDate, selectedCustomer.paymentTermDays))

    hasAppliedQueryCustomer.current = true
  }, [customers, editQuote, issueDate, searchParams])

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
    const vatTotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * (line.vatRate / 100), 0)
    const discount = Math.max(0, discountAmount || 0)
    return {
      subtotal,
      vatTotal,
      discountAmount: discount,
      total: Math.max(0, subtotal + vatTotal - discount),
    }
  }, [lines, discountAmount])

  const updateLine = (id: number, field: keyof QuoteLine, value: string) => {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line
        if (field === 'description') return { ...line, description: value }
        if (field === 'vatRate') return { ...line, vatRate: Number(value) as 0 | 9 | 21 }
        const parsed = Number(value)
        return { ...line, [field]: Number.isNaN(parsed) ? 0 : parsed }
      }),
    )
  }

  const addLine = () => {
    const nextId = lines.length ? Math.max(...lines.map((line) => line.id)) + 1 : 1
    setLines((current) => [...current, { id: nextId, description: '', quantity: 1, unitPrice: 0, vatRate: 21 }])
  }

  const removeLine = (id: number) => {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current))
  }

  const downloadCurrentPdf = async () => {
    const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
    if (!clientName.trim() || !issueDate || !dueDate || !hasValidLine) {
      setSaveError('Vul eerst klant, offertedatum, geldig-tot datum en minimaal 1 regel in om PDF te downloaden.')
      return
    }

    const quoteForPdf: StoredQuote = {
      id: editQuote?.id ?? 'preview',
      userId: userId ?? 'preview',
      quoteNumber,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerKvk,
      sellerIban: showSellerIban ? sellerIban : '',
      companyName: companyName.trim() || 'Bedrijfsnaam',
      logoDataUrl: editQuote?.logoDataUrl ?? profile.logoDataUrl ?? null,
      clientName,
      clientEmail,
      clientContactName,
      clientPhone,
      clientAddress,
      clientPostalCode,
      clientCity,
      clientCountry,
      clientKvkNumber,
      clientBtwNumber,
      clientIban,
      clientPaymentTermDays,
      clientNotes,
      quoteDescription,
      discountDescription,
      hasDueDate: true,
      issueDate,
      dueDate,
      expiresAt: dueDate,
      currencyCode,
      pricingMode: 'excl',
      vatExemptionReason: '',
      subtotal: totals.subtotal,
      vatTotal: totals.vatTotal,
      discountAmount: totals.discountAmount,
      total: totals.total,
      status: 'concept',
      lines,
      convertedInvoiceId: editQuote?.convertedInvoiceId ?? null,
      approvedAt: editQuote?.approvedAt ?? null,
      rejectedAt: editQuote?.rejectedAt ?? null,
      rejectionReason: editQuote?.rejectionReason ?? '',
      createdAt: editQuote?.createdAt ?? new Date().toISOString(),
    }

    setSaveError(null)
    await downloadQuotePdf(quoteForPdf, {
      companyProfile: profile,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerKvk: profile.kvkNumber,
      sellerIban: showSellerIban ? sellerIban : '',
    })
  }

  const save = async () => {
    setSaveError(null)

    if (!userId) {
      setSaveError('Je moet ingelogd zijn.')
      return
    }

    if (!clientName.trim()) {
      setSaveError('Vul een klantnaam in.')
      return
    }

    if (!issueDate) {
      setSaveError('Vul een offertedatum in.')
      return
    }

    const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
    if (!hasValidLine) {
      setSaveError('Voeg minimaal een geldige regel toe.')
      return
    }

    if (!dueDate) {
      setSaveError('Vul een geldig-tot datum in.')
      return
    }

    const payload = {
      quoteNumber,
      sellerName,
      sellerEmail,
      sellerPhone,
      sellerKvk,
      sellerIban: showSellerIban ? sellerIban : '',
      companyName: companyName.trim() || 'Bedrijfsnaam',
      logoDataUrl: editQuote?.logoDataUrl ?? profile.logoDataUrl ?? null,
      clientName,
      clientEmail,
      clientContactName,
      clientPhone,
      clientAddress,
      clientPostalCode,
      clientCity,
      clientCountry,
      clientKvkNumber,
      clientBtwNumber,
      clientIban,
      clientPaymentTermDays,
      clientNotes,
      quoteDescription,
      discountDescription,
      hasDueDate: true,
      issueDate,
      dueDate,
      expiresAt: dueDate,
      currencyCode,
      pricingMode: 'excl' as const,
      vatExemptionReason: '',
      subtotal: totals.subtotal,
      vatTotal: totals.vatTotal,
      discountAmount: totals.discountAmount,
      total: totals.total,
      status: 'concept' as const,
      lines,
      rejectionReason: '',
    }

    const ok = editQuote
      ? await updateQuote(editQuote.id, payload)
      : await createQuote({ ...payload, userId })

    if (!ok) {
      setSaveError('Opslaan van offerte is mislukt.')
      return
    }

    navigate('/offertes')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-white px-4 py-8 pb-28 text-slate-900 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            {editQuote ? 'Offerte bewerken' : 'Nieuwe offerte'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Offertegenerator</h1>
          <p className="mt-2 text-sm text-slate-600">
            Stel een offerte op en zet deze na goedkeuring automatisch om naar een conceptfactuur.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void save()
              }}
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              {editQuote ? 'Wijzigingen opslaan' : 'Offerte opslaan'}
            </button>
            <button
              type="button"
              onClick={downloadCurrentPdf}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Download PDF
            </button>
            <Link
              to="/offertes"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Terug naar offertes
            </Link>
          </div>
          {saveError ? (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </p>
          ) : null}
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">
              Afzender = jouw gegevens. Klant = gegevens van degene die de offerte ontvangt.
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Offertenummer</span>
              <input
                value={quoteNumber}
                onChange={(event) => setQuoteNumber(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <div className="sm:col-span-2 mt-1 border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Afzender (jij)</p>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw naam (afzender)</span>
              <input
                value={sellerName}
                onChange={(event) => setSellerName(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw bedrijfsnaam (afzender)</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw e-mail op PDF (optioneel)</span>
              <input
                type="email"
                value={sellerEmail}
                onChange={(event) => setSellerEmail(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw telefoon op PDF (optioneel)</span>
              <input
                value={sellerPhone}
                onChange={(event) => setSellerPhone(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw KvK op PDF (optioneel)</span>
              <input
                value={sellerKvk}
                onChange={(event) => setSellerKvk(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jouw IBAN op PDF (optioneel)</span>
              <input
                value={sellerIban}
                onChange={(event) => setSellerIban(event.target.value)}
                disabled={!showSellerIban}
                className="rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={showSellerIban}
                onChange={(event) => setShowSellerIban(event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-700">Toon mijn IBAN op offerte-PDF</span>
            </label>
            <div className="sm:col-span-2 mt-1 border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Klant (ontvanger)</p>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Klantnaam of bedrijfsnaam</span>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Klant e-mail</span>
              <input
                type="email"
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Offertedatum</span>
              <input
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Geldig tot</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Omschrijving</span>
              <textarea
                rows={3}
                value={quoteDescription}
                onChange={(event) => setQuoteDescription(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Korting beschrijving (optioneel)</span>
              <input
                type="text"
                value={discountDescription}
                onChange={(event) => setDiscountDescription(event.target.value)}
                placeholder="Bijv. Seizoenskorting"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Korting bedrag</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(event) => setDiscountAmount(Number(event.target.value) || 0)}
                placeholder="0.00"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Valuta</span>
              <select
                value={currencyCode}
                onChange={(event) => setCurrencyCode(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Offerteregels</h2>
            <button
              type="button"
              onClick={addLine}
              className="rounded-lg border border-cyan-200 px-3 py-1.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
            >
              Regel toevoegen
            </button>
          </div>

          <div className="space-y-3">
            {lines.map((line) => (
              <div key={line.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-12">
                <input
                  value={line.description}
                  onChange={(event) => updateLine(line.id, 'description', event.target.value)}
                  placeholder="Omschrijving"
                  className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-5"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.quantity}
                  onChange={(event) => updateLine(line.id, 'quantity', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unitPrice}
                  onChange={(event) => updateLine(line.id, 'unitPrice', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
                />
                <select
                  value={line.vatRate}
                  onChange={(event) => updateLine(line.id, 'vatRate', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
                >
                  <option value={21}>21%</option>
                  <option value={9}>9%</option>
                  <option value={0}>0%</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 sm:col-span-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="flex items-center justify-between"><span>Subtotaal</span><span>{formatCurrency(totals.subtotal, currencyCode)}</span></p>
            <p className="flex items-center justify-between"><span>BTW</span><span>{formatCurrency(totals.vatTotal, currencyCode)}</span></p>
            {totals.discountAmount > 0 ? (
              <div className="space-y-1 rounded-lg bg-white p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>Korting</span><span>-{formatCurrency(totals.discountAmount, currencyCode)}</span></div>
                {discountDescription ? <p className="text-xs text-slate-500">{discountDescription}</p> : null}
              </div>
            ) : null}
            <p className="flex items-center justify-between text-base font-bold"><span>Totaal</span><span>{formatCurrency(totals.total, currencyCode)}</span></p>
          </div>
        </section>
      </div>
    </main>
  )
}
