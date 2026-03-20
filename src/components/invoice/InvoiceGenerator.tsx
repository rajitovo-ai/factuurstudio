import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { canCreateInvoiceThisMonth, PLAN_CONFIGS } from '../../lib/billing'
import { downloadInvoicePdf } from '../../lib/pdf'
import { getNextInvoiceNumber } from '../../lib/invoiceNumber'
import RelatedSupport from '../support/RelatedSupport'
import { useAuthStore } from '../../stores/authStore'
import { useBillingStore } from '../../stores/billingStore'
import type { CustomerProfile } from '../../stores/customerStore'
import { useCustomerStore } from '../../stores/customerStore'
import type { StoredInvoice } from '../../stores/invoiceStore'
import { useInvoiceStore } from '../../stores/invoiceStore'
import { defaultCompanyProfile, useProfileStore } from '../../stores/profileStore'

const GUEST_DL_KEY = 'factuurstudio.guest.hasDownloaded'
const hasUsedGuestDownload = () => Boolean(localStorage.getItem(GUEST_DL_KEY))
const markGuestDownloadUsed = () => localStorage.setItem(GUEST_DL_KEY, '1')
const EMPTY_CUSTOMERS: CustomerProfile[] = []

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

const createDueDateFromIssueDate = (issueDate: string, termDays: number) => {
  const base = issueDate ? new Date(`${issueDate}T00:00:00`) : new Date()
  const safeDays = Math.max(0, Math.round(termDays))
  base.setDate(base.getDate() + safeDays)
  return base.toISOString().slice(0, 10)
}

const currencyOptions = ['EUR', 'USD', 'GBP']

type Props = {
  editInvoice?: StoredInvoice
  guestMode?: boolean
}

export default function InvoiceGenerator({ editInvoice, guestMode = false }: Props = {}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userId = useAuthStore((state) => state.userId)
  const invoices = useInvoiceStore((state) => state.invoices)
  const createInvoice = useInvoiceStore((state) => state.createInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const planId = useBillingStore((state) => state.getUserPlan(userId))
  const customersByUser = useCustomerStore((state) => state.customersByUser)
  const loadCustomers = useCustomerStore((state) => state.loadCustomers)
  const createCustomer = useCustomerStore((state) => state.createCustomer)
  const updateCustomer = useCustomerStore((state) => state.updateCustomer)
  const customers = useMemo(
    () => (userId ? (customersByUser[userId] ?? EMPTY_CUSTOMERS) : EMPTY_CUSTOMERS),
    [customersByUser, userId],
  )
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
  const [hasDueDate, setHasDueDate] = useState(editInvoice?.hasDueDate ?? true)
  const [pricingMode, setPricingMode] = useState<'excl' | 'incl'>(editInvoice?.pricingMode ?? 'excl')
  const [noVat, setNoVat] = useState(false)
  const [vatExemptionReason, setVatExemptionReason] = useState(editInvoice?.vatExemptionReason ?? '')
  const [currencyCode, setCurrencyCode] = useState(editInvoice?.currencyCode ?? 'EUR')
  const [invoiceDescription, setInvoiceDescription] = useState(editInvoice?.invoiceDescription ?? '')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [clientName, setClientName] = useState(editInvoice?.clientName ?? '')
  const [clientEmail, setClientEmail] = useState(editInvoice?.clientEmail ?? '')
  const [clientContactName, setClientContactName] = useState(editInvoice?.clientContactName ?? '')
  const [clientPhone, setClientPhone] = useState(editInvoice?.clientPhone ?? '')
  const [clientAddress, setClientAddress] = useState(editInvoice?.clientAddress ?? '')
  const [clientPostalCode, setClientPostalCode] = useState(editInvoice?.clientPostalCode ?? '')
  const [clientCity, setClientCity] = useState(editInvoice?.clientCity ?? '')
  const [clientCountry, setClientCountry] = useState(editInvoice?.clientCountry ?? 'NL')
  const [clientKvkNumber, setClientKvkNumber] = useState(editInvoice?.clientKvkNumber ?? '')
  const [clientBtwNumber, setClientBtwNumber] = useState(editInvoice?.clientBtwNumber ?? '')
  const [clientIban, setClientIban] = useState(editInvoice?.clientIban ?? '')
  const [clientPaymentTermDays, setClientPaymentTermDays] = useState(
    editInvoice?.clientPaymentTermDays ?? 14,
  )
  const [clientPaymentTermNotApplicable, setClientPaymentTermNotApplicable] = useState(
    (editInvoice?.clientPaymentTermDays ?? 14) === 0,
  )
  const [clientNotes, setClientNotes] = useState(editInvoice?.clientNotes ?? '')
  const [companyName, setCompanyName] = useState(
    editInvoice ? editInvoice.companyName : profile.companyName,
  )
  const [companyLogoDataUrl] = useState<string | null>(
    editInvoice ? (editInvoice.logoDataUrl ?? null) : profile.logoDataUrl,
  )
  const [saveError, setSaveError] = useState<string | null>(null)
  const [customerProfileError, setCustomerProfileError] = useState<string | null>(null)
  const [customerProfileMessage, setCustomerProfileMessage] = useState<string | null>(null)
  const [showUpsell, setShowUpsell] = useState(() => guestMode && hasUsedGuestDownload())
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null)
  const hasAppliedQueryCustomer = useRef(false)
  const hasRestoredDraft = useRef(false)
  const [lines, setLines] = useState<InvoiceLine[]>(
    editInvoice
      ? editInvoice.lines
      : [{ id: 1, description: 'Mijn eerste opdracht', quantity: 1, unitPrice: 750, vatRate: 21 }],
  )

  const draftStorageKey = useMemo(() => {
    if (guestMode || !userId) return null
    return editInvoice
      ? `factuurstudio.draft.invoice.${userId}.${editInvoice.id}`
      : `factuurstudio.draft.invoice.${userId}.new`
  }, [editInvoice, guestMode, userId])

  const resolveUniqueInvoiceNumber = useCallback(
    (candidate: string) => {
      if (!userId || editInvoice) {
        return candidate.trim()
      }

      const trimmedCandidate = candidate.trim()
      const userInvoiceNumbers = new Set(
        invoices.filter((invoice) => invoice.userId === userId).map((invoice) => invoice.invoiceNumber),
      )

      if (trimmedCandidate && !userInvoiceNumbers.has(trimmedCandidate)) {
        return trimmedCandidate
      }

      return getNextInvoiceNumber(invoices, userId)
    },
    [editInvoice, invoices, userId],
  )

  useEffect(() => {
    if (!guestMode && userId) {
      void loadProfile(userId)
      void loadCustomers(userId)
    }
  }, [guestMode, loadCustomers, loadProfile, userId])

  useEffect(() => {
    if (!draftStorageKey || hasRestoredDraft.current) {
      return
    }

    const rawDraft = window.localStorage.getItem(draftStorageKey)
    if (!rawDraft) {
      hasRestoredDraft.current = true
      return
    }

    let restoreTimer = 0

    try {
      const draft = JSON.parse(rawDraft) as Partial<{
        invoiceNumber: string
        issueDate: string
        dueDate: string
        hasDueDate: boolean
        pricingMode: 'excl' | 'incl'
        noVat: boolean
        vatExemptionReason: string
        currencyCode: string
        invoiceDescription: string
        clientName: string
        clientEmail: string
        clientContactName: string
        clientPhone: string
        clientAddress: string
        clientPostalCode: string
        clientCity: string
        clientCountry: string
        clientKvkNumber: string
        clientBtwNumber: string
        clientIban: string
        clientPaymentTermDays: number
        clientPaymentTermNotApplicable: boolean
        clientNotes: string
        companyName: string
        lines: InvoiceLine[]
      }>

      restoreTimer = window.setTimeout(() => {
        if (typeof draft.invoiceNumber === 'string') {
          setInvoiceNumber(resolveUniqueInvoiceNumber(draft.invoiceNumber))
        }
        if (typeof draft.issueDate === 'string') setIssueDate(draft.issueDate)
        if (typeof draft.dueDate === 'string') setDueDate(draft.dueDate)
        if (typeof draft.hasDueDate === 'boolean') setHasDueDate(draft.hasDueDate)
        if (draft.pricingMode === 'excl' || draft.pricingMode === 'incl') setPricingMode(draft.pricingMode)
        if (typeof draft.noVat === 'boolean') setNoVat(draft.noVat)
        if (typeof draft.vatExemptionReason === 'string') setVatExemptionReason(draft.vatExemptionReason)
        if (typeof draft.currencyCode === 'string') setCurrencyCode(draft.currencyCode)
        if (typeof draft.invoiceDescription === 'string') setInvoiceDescription(draft.invoiceDescription)
        if (typeof draft.clientName === 'string') setClientName(draft.clientName)
        if (typeof draft.clientEmail === 'string') setClientEmail(draft.clientEmail)
        if (typeof draft.clientContactName === 'string') setClientContactName(draft.clientContactName)
        if (typeof draft.clientPhone === 'string') setClientPhone(draft.clientPhone)
        if (typeof draft.clientAddress === 'string') setClientAddress(draft.clientAddress)
        if (typeof draft.clientPostalCode === 'string') setClientPostalCode(draft.clientPostalCode)
        if (typeof draft.clientCity === 'string') setClientCity(draft.clientCity)
        if (typeof draft.clientCountry === 'string') setClientCountry(draft.clientCountry)
        if (typeof draft.clientKvkNumber === 'string') setClientKvkNumber(draft.clientKvkNumber)
        if (typeof draft.clientBtwNumber === 'string') setClientBtwNumber(draft.clientBtwNumber)
        if (typeof draft.clientIban === 'string') setClientIban(draft.clientIban)
        if (typeof draft.clientPaymentTermDays === 'number') setClientPaymentTermDays(draft.clientPaymentTermDays)
        if (typeof draft.clientPaymentTermNotApplicable === 'boolean') {
          setClientPaymentTermNotApplicable(draft.clientPaymentTermNotApplicable)
        }
        if (typeof draft.clientNotes === 'string') setClientNotes(draft.clientNotes)
        if (typeof draft.companyName === 'string') setCompanyName(draft.companyName)
        if (Array.isArray(draft.lines) && draft.lines.length > 0) {
          setLines(draft.lines.map((line) => ({
            id: line.id,
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            vatRate: line.vatRate,
          })))
        }
      }, 0)
    } catch {
      // Ignore invalid draft payload.
    }

    hasRestoredDraft.current = true

    return () => {
      if (restoreTimer) {
        window.clearTimeout(restoreTimer)
      }
    }
  }, [draftStorageKey, resolveUniqueInvoiceNumber])

  const draftPayload = useMemo(
    () => ({
      invoiceNumber,
      issueDate,
      dueDate,
      hasDueDate,
      pricingMode,
      noVat,
      vatExemptionReason,
      currencyCode,
      invoiceDescription,
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
      clientPaymentTermNotApplicable,
      clientNotes,
      companyName,
      lines,
    }),
    [
      clientAddress,
      clientBtwNumber,
      clientCity,
      clientContactName,
      clientCountry,
      clientEmail,
      clientIban,
      clientKvkNumber,
      clientName,
      clientNotes,
      clientPaymentTermDays,
      clientPaymentTermNotApplicable,
      clientPhone,
      clientPostalCode,
      companyName,
      currencyCode,
      dueDate,
      hasDueDate,
      invoiceDescription,
      invoiceNumber,
      issueDate,
      lines,
      noVat,
      pricingMode,
      vatExemptionReason,
    ],
  )

  useEffect(() => {
    if (!draftStorageKey) {
      return
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(draftPayload))
      setLastAutoSavedAt(new Date().toISOString())
    }, 700)

    return () => window.clearTimeout(timer)
  }, [draftPayload, draftStorageKey])

  const applyCustomerProfile = useCallback((customer: CustomerProfile) => {
    setClientName(customer.companyName || customer.name)
    setClientEmail(customer.email)
    setClientContactName(customer.name)
    setClientPhone(customer.phone)
    setClientAddress(customer.address)
    setClientPostalCode(customer.postalCode)
    setClientCity(customer.city)
    setClientCountry(customer.country || 'NL')
    setClientKvkNumber(customer.kvkNumber)
    setClientBtwNumber(customer.btwNumber)
    setClientIban(customer.iban)
    setClientPaymentTermDays(customer.paymentTermDays)
    setClientPaymentTermNotApplicable(customer.paymentTermDays === 0)
    setClientNotes(customer.notes)
    if (hasDueDate) {
      setDueDate(createDueDateFromIssueDate(issueDate, customer.paymentTermDays))
    }
  }, [hasDueDate, issueDate])

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  )

  const onIssueDateChange = (value: string) => {
    setIssueDate(value)
    if (!hasDueDate) {
      setDueDate(value)
      return
    }

    if (!selectedCustomer) {
      return
    }

    setDueDate(createDueDateFromIssueDate(value, selectedCustomer.paymentTermDays))
  }

  const onHasDueDateChange = (checked: boolean) => {
    setHasDueDate(checked)

    if (!checked) {
      setDueDate(issueDate)
      return
    }

    if (selectedCustomer) {
      setDueDate(createDueDateFromIssueDate(issueDate, selectedCustomer.paymentTermDays))
    }
  }

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

      const resolvedDueDate = hasDueDate ? dueDate : issueDate
      if (!resolvedDueDate) {
        setSaveError('Vul een geldige factuurdatum in.')
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
        clientContactName,
        clientPhone,
        clientAddress,
        clientPostalCode,
        clientCity,
        clientCountry,
        clientKvkNumber,
        clientBtwNumber,
        clientIban,
        clientPaymentTermDays: clientPaymentTermNotApplicable ? 0 : clientPaymentTermDays,
        clientNotes,
        invoiceDescription,
        hasDueDate,
        issueDate,
        dueDate: resolvedDueDate,
        currencyCode,
        pricingMode,
        vatExemptionReason,
        subtotal: totals.subtotal,
        vatTotal: totals.vatTotal,
        total: totals.total,
        status: 'concept',
        lines: lines.map((line) => ({ ...line, vatRate: noVat ? 0 : line.vatRate })),
        isImported: false,
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

    if (!issueDate) {
      setSaveError('Vul een factuurdatum in.')
      return
    }

    const resolvedDueDate = hasDueDate ? dueDate : issueDate
    if (!resolvedDueDate) {
      setSaveError('Vul een geldige vervaldatum in of kies geen vervaldatum.')
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
        clientContactName,
        clientPhone,
        clientAddress,
        clientPostalCode,
        clientCity,
        clientCountry,
        clientKvkNumber,
        clientBtwNumber,
        clientIban,
        clientPaymentTermDays: clientPaymentTermNotApplicable ? 0 : clientPaymentTermDays,
        clientNotes,
        invoiceDescription,
        hasDueDate,
        issueDate,
        dueDate: resolvedDueDate,
        currencyCode,
        pricingMode,
        vatExemptionReason,
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
      const safeInvoiceNumber = resolveUniqueInvoiceNumber(invoiceNumber)
      if (safeInvoiceNumber !== invoiceNumber) {
        setInvoiceNumber(safeInvoiceNumber)
      }

      const quota = canCreateInvoiceThisMonth(planId, invoices, userId)
      if (!quota.allowed) {
        setSaveError(
          `Je ${PLAN_CONFIGS[planId].name}-plan heeft een limiet van ${quota.limit} facturen per maand. Upgrade naar Pro voor onbeperkt.`,
        )
        return
      }

      const ok = await createInvoice({
        userId,
        invoiceNumber: safeInvoiceNumber,
        companyName,
        logoDataUrl: companyLogoDataUrl,
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
        clientPaymentTermDays: clientPaymentTermNotApplicable ? 0 : clientPaymentTermDays,
        clientNotes,
        invoiceDescription,
        hasDueDate,
        issueDate,
        dueDate: resolvedDueDate,
        currencyCode,
        pricingMode,
        vatExemptionReason,
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

      if (draftStorageKey) {
        window.localStorage.removeItem(draftStorageKey)
      }
    }

    navigate('/facturen')
  }

  const buildCustomerProfileInput = () => ({
    name: clientContactName,
    companyName: clientName,
    email: clientEmail,
    phone: clientPhone,
    address: clientAddress,
    postalCode: clientPostalCode,
    city: clientCity,
    country: clientCountry,
    kvkNumber: clientKvkNumber,
    btwNumber: clientBtwNumber,
    iban: clientIban,
    paymentTermDays: clientPaymentTermNotApplicable ? 0 : clientPaymentTermDays,
    notes: clientNotes,
  })

  const saveAsNewCustomerProfile = async () => {
    setCustomerProfileError(null)
    setCustomerProfileMessage(null)

    if (!userId) {
      setCustomerProfileError('Geen actieve gebruiker gevonden. Log opnieuw in.')
      return
    }

    if (!clientName.trim() && !clientContactName.trim()) {
      setCustomerProfileError('Vul minimaal klantnaam of contactpersoon in.')
      return
    }

    const created = await createCustomer(userId, buildCustomerProfileInput())
    if (!created) {
      setCustomerProfileError('Klantprofiel opslaan is mislukt. Probeer opnieuw.')
      return
    }

    setSelectedCustomerId(created.id)
    setCustomerProfileMessage('Nieuw klantprofiel opgeslagen.')
  }

  const updateSelectedCustomerProfile = async () => {
    setCustomerProfileError(null)
    setCustomerProfileMessage(null)

    if (!userId || !selectedCustomerId) {
      setCustomerProfileError('Selecteer eerst een bestaand klantprofiel.')
      return
    }

    const updated = await updateCustomer(selectedCustomerId, userId, buildCustomerProfileInput())
    if (!updated) {
      setCustomerProfileError('Klantprofiel bijwerken is mislukt. Probeer opnieuw.')
      return
    }

    setCustomerProfileMessage('Klantprofiel bijgewerkt.')
  }

  const onCustomerSelectionChange = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId)
    setCustomerProfileError(null)
    setCustomerProfileMessage(null)

    if (!customerId) {
      return
    }

    const customer = customers.find((value) => value.id === customerId)
    if (!customer) {
      return
    }

    applyCustomerProfile(customer)
  }, [applyCustomerProfile, customers])

  useEffect(() => {
    if (hasAppliedQueryCustomer.current || guestMode || editInvoice) {
      return
    }

    const customerIdFromQuery = searchParams.get('customerId')
    if (!customerIdFromQuery) {
      hasAppliedQueryCustomer.current = true
      return
    }

    const matchedCustomer = customers.find((customer) => customer.id === customerIdFromQuery)
    if (!matchedCustomer) {
      return
    }

    const timer = window.setTimeout(() => {
      onCustomerSelectionChange(matchedCustomer.id)
      hasAppliedQueryCustomer.current = true
    }, 0)

    return () => window.clearTimeout(timer)
  }, [customers, editInvoice, guestMode, onCustomerSelectionChange, searchParams])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-white px-4 py-8 pb-28 text-slate-900 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
            {guestMode ? 'Gratis proberen' : editInvoice ? 'Factuur bewerken' : 'Nieuwe factuur'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            {editInvoice ? `Factuur ${editInvoice.invoiceNumber}` : 'Factuur Studio Generator'}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            {guestMode
              ? 'Vul je factuurgegevens in en download hem 1\u00d7 gratis als PDF. Geen account vereist.'
              : editInvoice
                ? 'Pas de gegevens aan en sla op. Alleen conceptfacturen kunnen worden bewerkt.'
                : 'Vul hier je factuurgegevens in en controleer direct de preview.'}
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
          {!guestMode ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <p className="text-slate-500">
                {lastAutoSavedAt
                  ? `Laatst opgeslagen om ${new Date(lastAutoSavedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Autosave actief'}
              </p>
              <Link to="/support" className="font-semibold text-cyan-700 hover:underline">
                Hulp bij BTW, status of betaaltermijn
              </Link>
            </div>
          ) : null}
          {saveError ? (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </p>
          ) : null}
          {!guestMode ? <div className="mt-4"><RelatedSupport context="invoice-generator" /></div> : null}
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
                  onChange={(event) => onIssueDateChange(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Vervaldatum</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  disabled={!hasDueDate}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={!hasDueDate}
                  onChange={(event) => onHasDueDateChange(!event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                />
                <span className="text-sm font-medium text-slate-700">
                  Geen vervaldatum tonen of gebruiken
                </span>
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
              {noVat ? (
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Reden vrijstelling (optioneel)
                  </span>
                  <input
                    value={vatExemptionReason}
                    onChange={(event) => setVatExemptionReason(event.target.value)}
                    placeholder="Bijv. BTW verlegd of vrijstelling artikel 25"
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                  />
                </label>
              ) : null}
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
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Factuurbeschrijving (optioneel)</span>
                <textarea
                  value={invoiceDescription}
                  onChange={(event) => setInvoiceDescription(event.target.value)}
                  rows={3}
                  placeholder="Bijv. Projectomschrijving of extra toelichting voor deze factuur"
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              {!guestMode ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">Klantprofiel kiezen</span>
                      <select
                        value={selectedCustomerId}
                        onChange={(event) => onCustomerSelectionChange(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                      >
                        <option value="">Handmatige invoer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.companyName || customer.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Contactpersoon</span>
                      <input
                        value={clientContactName}
                        onChange={(event) => setClientContactName(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="Bijv. Lisa Jansen"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Telefoon</span>
                      <input
                        value={clientPhone}
                        onChange={(event) => setClientPhone(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="Bijv. +31 6 12345678"
                      />
                    </label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">Adres</span>
                      <input
                        value={clientAddress}
                        onChange={(event) => setClientAddress(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="Straatnaam 12"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Postcode</span>
                      <input
                        value={clientPostalCode}
                        onChange={(event) => setClientPostalCode(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="1234 AB"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Plaats</span>
                      <input
                        value={clientCity}
                        onChange={(event) => setClientCity(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="Amsterdam"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Land</span>
                      <input
                        value={clientCountry}
                        onChange={(event) => setClientCountry(event.target.value.toUpperCase())}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 uppercase outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="NL"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">IBAN klant</span>
                      <input
                        value={clientIban}
                        onChange={(event) => setClientIban(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="NL00BANK0123456789"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">KvK klant</span>
                      <input
                        value={clientKvkNumber}
                        onChange={(event) => setClientKvkNumber(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="12345678"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">BTW klant</span>
                      <input
                        value={clientBtwNumber}
                        onChange={(event) => setClientBtwNumber(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="NL123456789B01"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">Betaaltermijn (dagen)</span>
                      <input
                        type="number"
                        min={0}
                        value={clientPaymentTermNotApplicable ? 0 : clientPaymentTermDays}
                        disabled={clientPaymentTermNotApplicable}
                        onChange={(event) => {
                          const value = Number(event.target.value)
                          setClientPaymentTermDays(Number.isNaN(value) ? 0 : value)
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                      />
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={clientPaymentTermNotApplicable}
                        onChange={(event) => {
                          setClientPaymentTermNotApplicable(event.target.checked)
                          if (event.target.checked && hasDueDate) {
                            setDueDate(issueDate)
                          }
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                      />
                      <span className="text-sm font-medium text-slate-700">Betaaltermijn niet van toepassing</span>
                    </label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">Notities klantprofiel</span>
                      <textarea
                        value={clientNotes}
                        onChange={(event) => setClientNotes(event.target.value)}
                        rows={2}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder="Interne notitie, referentie of extra betaalafspraak"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void saveAsNewCustomerProfile()
                      }}
                      className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100"
                    >
                      Opslaan als nieuw profiel
                    </button>
                    <button
                      type="button"
                      disabled={!selectedCustomerId}
                      onClick={() => {
                        void updateSelectedCustomerProfile()
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Geselecteerd profiel bijwerken
                    </button>
                  </div>
                  {customerProfileError ? (
                    <p className="mt-2 text-xs text-rose-700">{customerProfileError}</p>
                  ) : null}
                  {customerProfileMessage ? (
                    <p className="mt-2 text-xs text-emerald-700">{customerProfileMessage}</p>
                  ) : null}
                </div>
              ) : null}
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
                  <p>Vervaldatum: {hasDueDate ? formatDate(dueDate) : 'n.v.t.'}</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aan</p>
                <p className="mt-1 font-semibold text-slate-900">{clientName || 'Klantnaam ontbreekt'}</p>
                <p className="text-sm text-slate-600">{clientEmail || 'E-mail ontbreekt'}</p>
              </div>

              {invoiceDescription.trim() ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Beschrijving</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{invoiceDescription}</p>
                </div>
              ) : null}

              {noVat && vatExemptionReason.trim() ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">BTW-vrijstelling</p>
                  <p className="mt-1 text-sm text-slate-700">{vatExemptionReason}</p>
                </div>
              ) : null}

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

      {!showUpsell ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_28px_-18px_rgba(15,23,42,0.6)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl gap-2">
            <button
              type="button"
              onClick={() => {
                void saveInvoice()
              }}
              className="flex-1 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white"
            >
              {guestMode ? 'PDF downloaden' : editInvoice ? 'Opslaan' : 'Factuur opslaan'}
            </button>
            {!guestMode ? (
              <button
                type="button"
                onClick={() => navigate('/facturen')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Overzicht
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}
