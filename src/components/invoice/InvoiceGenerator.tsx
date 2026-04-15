import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
const hasUsedGuestDownload = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem(GUEST_DL_KEY))
}
const markGuestDownloadUsed = (): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(GUEST_DL_KEY, '1')
}
const EMPTY_CUSTOMERS: CustomerProfile[] = []

// Types
type InvoiceLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

// Utility functions
const formatCurrency = (amount: number, currencyCode = 'EUR'): string =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)

const formatDate = (isoDate: string): string => {
  if (!isoDate) return '-'
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

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

const buildDefaultPaymentInstructions = (params: {
  invoiceNumber: string
  sellerIban: string
  hasDueDate: boolean
  dueDate: string
}) => {
  const reference = params.invoiceNumber.trim() || '[factuurnummer]'
  const iban = params.sellerIban.trim() || '[jouw IBAN]'
  const dueDateText = params.hasDueDate && params.dueDate
    ? `Graag betalen voor ${formatDate(params.dueDate)}.`
    : ''

  return [
    `Gelieve het openstaande bedrag over te maken naar ${iban}.`,
    `Vermeld bij betaling: ${reference}.`,
    dueDateText,
    'Bij vragen over deze factuur kun je contact opnemen via e-mail.',
  ]
    .filter(Boolean)
    .join('\n')
}

const currencyOptions = ['EUR', 'USD', 'GBP']

type Props = {
  editInvoice?: StoredInvoice
  guestMode?: boolean
}

export default function InvoiceGenerator({ editInvoice, guestMode = false }: Props = {}) {
  const { t } = useTranslation(['invoiceGenerator', 'common', 'invoices'])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userId = useAuthStore((state) => state.userId)
  const email = useAuthStore((state) => state.email)
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
  const [paymentInstructions, setPaymentInstructions] = useState(editInvoice?.paymentInstructions ?? '')
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
  const [sellerName, setSellerName] = useState(
    editInvoice?.sellerName ?? getDefaultSellerName(email),
  )
  const [sellerEmail, setSellerEmail] = useState(editInvoice?.sellerEmail ?? (email ?? ''))
  const [sellerIban, setSellerIban] = useState(editInvoice?.sellerIban ?? profile.iban)
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
  const hasInitializedSenderDefaults = useRef(false)
  const [lines, setLines] = useState<InvoiceLine[]>(
    editInvoice
      ? editInvoice.lines
      : [{ id: 1, description: t('invoiceGenerator:defaultLine'), quantity: 1, unitPrice: 750, vatRate: 21 }],
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
    if (editInvoice || hasInitializedSenderDefaults.current) {
      return
    }

    if (!email && !profile.iban) {
      return
    }

    if (!sellerName.trim() && email) {
      setSellerName(getDefaultSellerName(email))
    }
    if (!sellerEmail.trim() && email) {
      setSellerEmail(email)
    }
    if (!sellerIban.trim() && profile.iban) {
      setSellerIban(profile.iban)
    }

    hasInitializedSenderDefaults.current = true
  }, [editInvoice, email, profile.iban, sellerEmail, sellerIban, sellerName])

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
        paymentInstructions: string
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
        sellerName: string
        sellerEmail: string
        sellerIban: string
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
        if (typeof draft.paymentInstructions === 'string') setPaymentInstructions(draft.paymentInstructions)
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
        if (typeof draft.sellerName === 'string') setSellerName(draft.sellerName)
        if (typeof draft.sellerEmail === 'string') setSellerEmail(draft.sellerEmail)
        if (typeof draft.sellerIban === 'string') setSellerIban(draft.sellerIban)
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
      paymentInstructions,
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
      sellerName,
      sellerEmail,
      sellerIban,
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
      paymentInstructions,
      pricingMode,
      sellerEmail,
      sellerIban,
      sellerName,
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

  const fillDefaultPaymentInstructions = () => {
    setPaymentInstructions(
      buildDefaultPaymentInstructions({
        invoiceNumber,
        sellerIban,
        hasDueDate,
        dueDate,
      }),
    )
  }

  const downloadCurrentInvoicePdf = () => {
    const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
    if (!clientName.trim()) {
      setSaveError(t('invoiceGenerator:errors.noClientName'))
      return false
    }
    if (!hasValidLine) {
      setSaveError(t('invoiceGenerator:errors.noValidLine'))
      return false
    }

    const resolvedDueDate = hasDueDate ? dueDate : issueDate
    if (!resolvedDueDate) {
      setSaveError(t('invoiceGenerator:errors.noIssueDate'))
      return false
    }

    const tempInvoice: StoredInvoice = {
      id: editInvoice?.id ?? 'preview',
      userId: userId ?? 'preview',
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
      paymentInstructions,
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

    setSaveError(null)
    await downloadInvoicePdf(tempInvoice, {
      sellerProfile: {
        companyName,
        address: profile.address,
        kvkNumber: profile.kvkNumber,
        btwNumber: profile.btwNumber,
        iban: profile.iban,
      },
      sellerName,
      sellerEmail,
      sellerIban,
    })

    return true
  }

  const saveInvoice = async () => {
    setSaveError(null)

    if (guestMode) {
      if (showUpsell) {
        // Already used the free download — scroll to upsell
        return
      }
      const didDownload = downloadCurrentInvoicePdf()
      if (!didDownload) {
        return
      }
      markGuestDownloadUsed()
      setShowUpsell(true)
      return
    }

    if (!userId) {
      setSaveError(t('invoiceGenerator:errors.noUser'))
      return
    }

    if (!clientName.trim()) {
      setSaveError(t('invoiceGenerator:errors.noClientName'))
      return
    }

    const hasValidLine = lines.some((line) => line.description.trim() && line.quantity > 0)
    if (!hasValidLine) {
      setSaveError(t('invoiceGenerator:errors.noValidLine'))
      return
    }

    if (!issueDate) {
      setSaveError(t('invoiceGenerator:errors.noIssueDate'))
      return
    }

    const resolvedDueDate = hasDueDate ? dueDate : issueDate
    if (!resolvedDueDate) {
      setSaveError(t('invoiceGenerator:errors.noDueDate'))
      return
    }

    const savedLines = lines.map((line) => ({ ...line, vatRate: noVat ? 0 : line.vatRate }))

    if (editInvoice) {
      const ok = await updateInvoice(editInvoice.id, {
        invoiceNumber,
        sellerName,
        sellerEmail,
        sellerIban,
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
        paymentInstructions,
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
        setSaveError(t('invoiceGenerator:errors.updateFailed'))
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
          t('invoiceGenerator:errors.quotaExceeded', { plan: PLAN_CONFIGS[planId].name, limit: quota.limit }),
        )
        return
      }

      const ok = await createInvoice({
        userId,
        invoiceNumber: safeInvoiceNumber,
        sellerName,
        sellerEmail,
        sellerIban,
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
        paymentInstructions,
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
        setSaveError(t('invoiceGenerator:errors.saveFailed'))
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
      setCustomerProfileError(t('invoiceGenerator:errors.customerNoUser'))
      return
    }

    if (!clientName.trim() && !clientContactName.trim()) {
      setCustomerProfileError(t('invoiceGenerator:errors.customerNoName'))
      return
    }

    const created = await createCustomer(userId, buildCustomerProfileInput())
    if (!created) {
      setCustomerProfileError(t('invoiceGenerator:errors.customerSaveFailed'))
      return
    }

    setSelectedCustomerId(created.id)
    setCustomerProfileMessage(t('invoiceGenerator:customerProfile.saveNew'))
  }

  const updateSelectedCustomerProfile = async () => {
    setCustomerProfileError(null)
    setCustomerProfileMessage(null)

    if (!userId || !selectedCustomerId) {
      setCustomerProfileError(t('invoiceGenerator:errors.selectCustomer'))
      return
    }

    const updated = await updateCustomer(selectedCustomerId, userId, buildCustomerProfileInput())
    if (!updated) {
      setCustomerProfileError(t('invoiceGenerator:errors.customerUpdateFailed'))
      return
    }

    setCustomerProfileMessage(t('invoiceGenerator:customerProfile.updateSelected'))
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
            {guestMode ? t('invoiceGenerator:header.guestTitle') : editInvoice ? t('invoiceGenerator:header.editTitle') : t('invoiceGenerator:header.newTitle')}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            {editInvoice ? t('invoiceGenerator:header.editInvoice', { number: editInvoice.invoiceNumber }) : t('invoiceGenerator:header.generator')}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            {guestMode
              ? t('invoiceGenerator:header.guestSubtitle')
              : editInvoice
                ? t('invoiceGenerator:header.editSubtitle')
                : t('invoiceGenerator:header.newSubtitle')}
          </p>
          {showUpsell && guestMode ? (
            <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="font-bold text-cyan-900">{t('invoiceGenerator:upsell.title')}</p>
              <p className="mt-1 text-sm text-cyan-800">
                {t('invoiceGenerator:upsell.description')}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  {t('invoiceGenerator:upsell.createAccount')}
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {t('invoiceGenerator:upsell.haveAccount')}
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
                {guestMode ? t('invoiceGenerator:buttons.downloadPdf') : editInvoice ? t('invoiceGenerator:buttons.saveChanges') : t('invoiceGenerator:buttons.saveInvoice')}
              </button>
              {!guestMode ? (
                <button
                  type="button"
                  onClick={downloadCurrentInvoicePdf}
                  className="rounded-lg border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                >
                  PDF voorbeeld
                </button>
              ) : null}
              {!guestMode ? (
                <button
                  type="button"
                  onClick={() => navigate('/facturen')}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {t('invoiceGenerator:buttons.toOverview')}
                </button>
              ) : (
                <Link
                  to="/register"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {t('invoiceGenerator:buttons.createAccount')}
                </Link>
              )}
            </div>
          )}
          {!guestMode ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <p className="text-slate-500">
                {lastAutoSavedAt
                  ? t('invoiceGenerator:autosave.savedAt', { time: new Date(lastAutoSavedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) })
                  : t('invoiceGenerator:autosave.active')}
              </p>
              <Link to="/support" className="font-semibold text-cyan-700 hover:underline">
                {t('invoiceGenerator:supportLink')}
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
            <h2 className="text-xl font-bold">{t('invoiceGenerator:invoiceInput.title')}</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">
                Afzender = jouw gegevens. Klant = gegevens van degene die de factuur ontvangt.
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.invoiceNumber')}</span>
                <input
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
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
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Jouw bedrijfsnaam (afzender)</span>
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Jouw e-mail op PDF (optioneel)</span>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(event) => setSellerEmail(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Jouw IBAN op PDF (optioneel)</span>
                <input
                  value={sellerIban}
                  onChange={(event) => setSellerIban(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <div className="sm:col-span-2 mt-1 border-t border-slate-200 pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Factuur instellingen</p>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.issueDate')}</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => onIssueDateChange(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.dueDate')}</span>
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
                  {t('invoiceGenerator:invoiceInput.noDueDate')}
                </span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.pricingMode')}</span>
                <select
                  value={pricingMode}
                  onChange={(event) => setPricingMode(event.target.value as 'excl' | 'incl')}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                >
                  <option value="excl">{t('invoiceGenerator:invoiceInput.pricingExcl')}</option>
                  <option value="incl">{t('invoiceGenerator:invoiceInput.pricingIncl')}</option>
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={noVat}
                  onChange={(event) => setNoVat(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                />
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.noVat')}</span>
              </label>
              {noVat ? (
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    {t('invoiceGenerator:invoiceInput.vatExemptionReason')}
                  </span>
                  <input
                    value={vatExemptionReason}
                    onChange={(event) => setVatExemptionReason(event.target.value)}
                    placeholder={t('invoiceGenerator:invoiceInput.vatPlaceholder')}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                  />
                </label>
              ) : null}
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.currency')}</span>
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
              <div className="sm:col-span-2 mt-1 border-t border-slate-200 pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Klant (ontvanger)</p>
              </div>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Klantnaam of bedrijfsnaam</span>
                <input
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder={t('invoiceGenerator:invoiceInput.clientNamePlaceholder')}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.clientEmail')}</span>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder={t('invoiceGenerator:invoiceInput.emailPlaceholder')}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:invoiceInput.description')}</span>
                <textarea
                  value={invoiceDescription}
                  onChange={(event) => setInvoiceDescription(event.target.value)}
                  rows={3}
                  placeholder={t('invoiceGenerator:invoiceInput.descriptionPlaceholder')}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-700">Betaalinstructies op PDF (optioneel)</span>
                  <button
                    type="button"
                    onClick={fillDefaultPaymentInstructions}
                    className="rounded-lg border border-cyan-200 px-2.5 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
                  >
                    Vul standaardtekst in
                  </button>
                </div>
                <textarea
                  value={paymentInstructions}
                  onChange={(event) => setPaymentInstructions(event.target.value)}
                  rows={2}
                  placeholder="Bijv. Gelieve binnen 14 dagen over te maken naar NL00BANK0123456789 o.v.v. factuurnummer."
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                />
              </label>
              {!guestMode ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.title')}</span>
                      <select
                        value={selectedCustomerId}
                        onChange={(event) => onCustomerSelectionChange(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                      >
                        <option value="">{t('invoiceGenerator:customerProfile.manualEntry')}</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.companyName || customer.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.contactName')}</span>
                      <input
                        value={clientContactName}
                        onChange={(event) => setClientContactName(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.contactPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.phone')}</span>
                      <input
                        value={clientPhone}
                        onChange={(event) => setClientPhone(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.phonePlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.address')}</span>
                      <input
                        value={clientAddress}
                        onChange={(event) => setClientAddress(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.addressPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.postalCode')}</span>
                      <input
                        value={clientPostalCode}
                        onChange={(event) => setClientPostalCode(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.postalPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.city')}</span>
                      <input
                        value={clientCity}
                        onChange={(event) => setClientCity(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.cityPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.country')}</span>
                      <input
                        value={clientCountry}
                        onChange={(event) => setClientCountry(event.target.value.toUpperCase())}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 uppercase outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.countryPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.iban')}</span>
                      <input
                        value={clientIban}
                        onChange={(event) => setClientIban(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.ibanPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.kvk')}</span>
                      <input
                        value={clientKvkNumber}
                        onChange={(event) => setClientKvkNumber(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.kvkPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.vat')}</span>
                      <input
                        value={clientBtwNumber}
                        onChange={(event) => setClientBtwNumber(event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.vatPlaceholder')}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.paymentTerm')}</span>
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
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.paymentTermNA')}</span>
                    </label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-sm font-medium text-slate-700">{t('invoiceGenerator:customerProfile.notes')}</span>
                      <textarea
                        value={clientNotes}
                        onChange={(event) => setClientNotes(event.target.value)}
                        rows={2}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-600 transition focus:ring-2"
                        placeholder={t('invoiceGenerator:customerProfile.notesPlaceholder')}
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
                      {t('invoiceGenerator:customerProfile.saveNew')}
                    </button>
                    <button
                      type="button"
                      disabled={!selectedCustomerId}
                      onClick={() => {
                        void updateSelectedCustomerProfile()
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('invoiceGenerator:customerProfile.updateSelected')}
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
                <h3 className="text-lg font-bold">{t('invoiceGenerator:invoiceLines.title')}</h3>
                <button
                  type="button"
                  onClick={addLine}
                  className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  {t('invoiceGenerator:invoiceLines.addLine')}
                </button>
              </div>

              <div className="space-y-3">
                {lines.map((line) => (
                  <div key={line.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3">
                    <input
                      value={line.description}
                      onChange={(event) => updateLine(line.id, 'description', event.target.value)}
                      placeholder={t('invoiceGenerator:invoiceLines.description')}
                      className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <label className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-500">{t('invoiceGenerator:invoiceLines.quantity')}</span>
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
                        <span className="text-xs text-slate-500">{t('invoiceGenerator:invoiceLines.price')}</span>
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
                        <span className="text-xs text-slate-500">{t('invoiceGenerator:invoiceLines.vat')}</span>
                        <select
                          value={noVat ? 0 : line.vatRate}
                          onChange={(event) => updateLine(line.id, 'vatRate', event.target.value)}
                          disabled={noVat}
                          className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                        >
                          <option value={21}>{t('invoiceGenerator:invoiceLines.vat21')}</option>
                          <option value={9}>{t('invoiceGenerator:invoiceLines.vat9')}</option>
                          <option value={0}>{t('invoiceGenerator:invoiceLines.vat0')}</option>
                        </select>
                      </label>
                      <div className="flex flex-col justify-end">
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="rounded-lg border border-rose-200 px-2 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          {t('invoiceGenerator:invoiceLines.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold">{t('invoiceGenerator:preview.title')}</h2>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('invoiceGenerator:preview.from')}</p>
                  <p className="mt-1 text-lg font-bold">{companyName || t('invoiceGenerator:preview.yourCompany')}</p>
                  {sellerName.trim() ? <p className="mt-1 text-sm text-slate-700">Contact: {sellerName}</p> : null}
                  {sellerEmail.trim() ? <p className="text-sm text-slate-600">E-mail: {sellerEmail}</p> : null}
                  {sellerIban.trim() ? <p className="text-sm text-slate-600">IBAN: {sellerIban}</p> : null}
                  {companyLogoDataUrl ? (
                    <img
                      src={companyLogoDataUrl}
                      alt={t('invoiceGenerator:preview.logoAlt')}
                      className="mt-2 max-h-14 w-auto rounded border border-slate-200 bg-white p-1"
                    />
                  ) : null}
                </div>
                <div className="text-sm text-slate-600 sm:text-right">
                  <p>
                    {t('invoiceGenerator:preview.invoiceNumber')}: <span className="font-semibold text-slate-900">{invoiceNumber}</span>
                  </p>
                  <p>{t('invoiceGenerator:preview.date')}: {formatDate(issueDate)}</p>
                  <p>{t('invoiceGenerator:preview.dueDate')}: {hasDueDate ? formatDate(dueDate) : t('invoiceGenerator:preview.na')}</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('invoiceGenerator:preview.to')}</p>
                <p className="mt-1 font-semibold text-slate-900">{clientName || t('invoiceGenerator:preview.clientMissing')}</p>
                <p className="text-sm text-slate-600">{clientEmail || t('invoiceGenerator:preview.emailMissing')}</p>
              </div>

              {invoiceDescription.trim() ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('invoiceGenerator:preview.description')}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{invoiceDescription}</p>
                </div>
              ) : null}

              {noVat && vatExemptionReason.trim() ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('invoiceGenerator:preview.vatExemption')}</p>
                  <p className="mt-1 text-sm text-slate-700">{vatExemptionReason}</p>
                </div>
              ) : null}

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="pb-2 font-semibold">{t('invoiceGenerator:preview.descriptionHeader')}</th>
                      <th className="pb-2 font-semibold">{t('invoiceGenerator:preview.quantityHeader')}</th>
                      <th className="pb-2 font-semibold">{t('invoiceGenerator:preview.priceHeader')}</th>
                      <th className="pb-2 font-semibold">{t('invoiceGenerator:preview.vatHeader')}</th>
                      <th className="pb-2 text-right font-semibold">{t('invoiceGenerator:preview.totalHeader')}</th>
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
                  <span className="text-slate-600">{t('invoiceGenerator:preview.subtotal')}</span>
                  <span>{formatCurrency(totals.subtotal, currencyCode)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t('invoiceGenerator:preview.vat')}</span>
                  <span>{formatCurrency(totals.vatTotal, currencyCode)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-extrabold">
                  <span>{t('invoiceGenerator:preview.total')}</span>
                  <span>{formatCurrency(totals.total, currencyCode)}</span>
                </div>
              </div>

              {paymentInstructions.trim() ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Betaalinstructies</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{paymentInstructions}</p>
                </div>
              ) : null}
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
              {guestMode ? t('invoiceGenerator:buttons.mobileDownload') : editInvoice ? t('invoiceGenerator:buttons.mobileSave') : t('invoiceGenerator:buttons.mobileSaveInvoice')}
            </button>
            {!guestMode ? (
              <button
                type="button"
                onClick={() => navigate('/facturen')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {t('invoiceGenerator:buttons.mobileOverview')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}
