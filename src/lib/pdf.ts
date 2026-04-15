import { jsPDF } from 'jspdf'
import type { StoredInvoice } from '../stores/invoiceStore'

const currency = (amount: number, code = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: code,
  }).format(amount)

// PDF-safe currency formatter - uses EUR prefix instead of € symbol
// to prevent rendering issues on mobile PDF viewers
const pdfCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `EUR ${formatted}`
}

const formatDate = (isoDate: string) => {
  if (!isoDate) return '-'
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

type PdfVariant = 'invoice' | 'quote'

type SellerProfile = {
  companyName?: string
  address?: string
  kvkNumber?: string
  btwNumber?: string
  iban?: string
}

type DownloadPdfOptions = {
  variant?: PdfVariant
  filenamePrefix?: string
  sellerProfile?: SellerProfile
  sellerName?: string | null
  sellerEmail?: string | null
  sellerKvk?: string | null
  sellerIban?: string | null
  sellerPhone?: string | null
}

const addDaysIso = (isoDate: string, days: number): string => {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  date.setDate(date.getDate() + Math.max(0, Math.round(days)))
  return date.toISOString().slice(0, 10)
}

export const downloadInvoicePdf = (invoice: StoredInvoice, options: DownloadPdfOptions = {}) => {
  const variant = options.variant ?? 'invoice'
  const isQuote = variant === 'quote'
  const filenamePrefix = options.filenamePrefix ?? (isQuote ? 'offerte' : 'factuur')
  const numberLabel = isQuote ? 'Offertenummer' : 'Factuurnummer'
  const issueDateLabel = isQuote ? 'Offertedatum' : 'Factuurdatum'
  const dueDateLabel = isQuote ? 'Geldig tot' : 'Vervaldatum'
  const recipientLabel = isQuote ? 'Offerte voor' : 'Factuur voor'
  const sellerProfile = options.sellerProfile
  const sellerCompanyName = sellerProfile?.companyName?.trim() || invoice.companyName || 'Bedrijfsnaam'
  const sellerKvk = options.sellerKvk !== undefined
    ? (options.sellerKvk ?? '').trim()
    : (sellerProfile?.kvkNumber ?? '')
  const sellerIban = options.sellerIban !== undefined
    ? (options.sellerIban ?? '').trim()
    : (sellerProfile?.iban ?? '')
  const fallbackQuoteDueDate = addDaysIso(invoice.issueDate, invoice.clientPaymentTermDays || 14)
  const effectiveDueDate = isQuote
    ? (invoice.hasDueDate ? invoice.dueDate : fallbackQuoteDueDate)
    : (invoice.hasDueDate ? invoice.dueDate : '')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const left = 16
  const right = 194
  let y = 18

  doc.setTextColor(0, 0, 0)
  doc.setLineWidth(0.3)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(sellerCompanyName, left, y)

  if (invoice.logoDataUrl) {
    try {
      const imageType = invoice.logoDataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG'
      doc.addImage(invoice.logoDataUrl, imageType, 156, 14, 38, 18, undefined, 'FAST')
    } catch {
      // Ignore image parse issues and continue PDF generation.
    }
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 7
  doc.text(`${numberLabel}: ${invoice.invoiceNumber}`, left, y)
  y += 5
  doc.text(`${issueDateLabel}: ${formatDate(invoice.issueDate)}`, left, y)
  y += 5
  doc.text(`${dueDateLabel}: ${formatDate(effectiveDueDate)}`, left, y)

  const sellerDetails: string[] = []
  if (sellerProfile?.address) sellerDetails.push(sellerProfile.address)
  if (options.sellerName) sellerDetails.push(`Contact: ${options.sellerName}`)
  if (options.sellerEmail) sellerDetails.push(`E-mail: ${options.sellerEmail}`)
  if (options.sellerPhone) sellerDetails.push(`Tel: ${options.sellerPhone}`)
  if (sellerKvk) sellerDetails.push(`KvK: ${sellerKvk}`)
  if (sellerProfile?.btwNumber) sellerDetails.push(`BTW: ${sellerProfile.btwNumber}`)
  if (sellerIban) sellerDetails.push(`IBAN: ${sellerIban}`)

  if (sellerDetails.length > 0) {
    doc.setFontSize(9)
    let sellerY = 44
    sellerDetails.forEach((line) => {
      doc.text(line, right, sellerY, { align: 'right' })
      sellerY += 4.5
    })
    doc.setFontSize(10)
  }

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text(recipientLabel, left, y)

  const addRecipientField = (label: string, value: string) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return

    y += 5
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, left, y)
    doc.setFont('helvetica', 'normal')

    const wrappedValue = doc.splitTextToSize(trimmedValue, right - (left + 30))
    doc.text(wrappedValue, left + 30, y)
    if (wrappedValue.length > 1) {
      y += (wrappedValue.length - 1) * 4
    }
  }

  addRecipientField('Contactpersoon', invoice.clientContactName)
  addRecipientField('Bedrijf / naam', invoice.clientName || '-')
  addRecipientField('E-mail', invoice.clientEmail || '-')
  addRecipientField('Telefoon', invoice.clientPhone)
  addRecipientField('Adres', invoice.clientAddress)

  const clientCityLine = [invoice.clientPostalCode, invoice.clientCity].filter(Boolean).join(' ')
  const hasLocationDetails = Boolean(invoice.clientAddress || clientCityLine)
  const showCountry = Boolean(invoice.clientCountry) && (hasLocationDetails || invoice.clientCountry !== 'NL')
  if (clientCityLine || showCountry) {
    const location = [clientCityLine, showCountry ? invoice.clientCountry : ''].filter(Boolean).join(' - ')
    addRecipientField('Plaats', location || '-')
  }
  addRecipientField('KvK', invoice.clientKvkNumber)
  addRecipientField('BTW', invoice.clientBtwNumber)
  addRecipientField('IBAN klant', invoice.clientIban)
  addRecipientField('Notitie', invoice.clientNotes)

  if (invoice.invoiceDescription) {
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.text('Beschrijving', left, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const wrappedDescription = doc.splitTextToSize(invoice.invoiceDescription, 170)
    doc.text(wrappedDescription, left, y)
    y += wrappedDescription.length * 4
  }

  if (invoice.vatExemptionReason?.trim()) {
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.text('BTW-vrijstelling', left, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const wrappedExemption = doc.splitTextToSize(invoice.vatExemptionReason, 170)
    doc.text(wrappedExemption, left, y)
    y += wrappedExemption.length * 4
  }

  y += 10
  doc.line(left, y, right, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Omschrijving', left, y)
  doc.text('Aantal', 116, y, { align: 'right' })
  doc.text('Prijs', 145, y, { align: 'right' })
  doc.text('BTW', 164, y, { align: 'right' })
  doc.text('Totaal', right, y, { align: 'right' })

  y += 3
  doc.line(left, y, right, y)
  y += 6

  doc.setFont('helvetica', 'normal')

  invoice.lines.forEach((line) => {
    const lineExVat = line.quantity * line.unitPrice
    const lineVat = lineExVat * (line.vatRate / 100)
    const lineTotal = lineExVat + lineVat

    doc.text(line.description || '-', left, y)
    doc.text(String(line.quantity), 116, y, { align: 'right' })
    doc.text(pdfCurrency(line.unitPrice), 145, y, { align: 'right' })
    doc.text(`${line.vatRate}%`, 164, y, { align: 'right' })
    doc.text(pdfCurrency(lineTotal), right, y, { align: 'right' })

    y += 6

    if (y > 250) {
      doc.addPage()
      y = 20
    }
  })

  y += 2
  doc.line(126, y, right, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.text('Subtotaal', 160, y, { align: 'right' })
  doc.text(pdfCurrency(invoice.subtotal), right, y, { align: 'right' })
  y += 6
  doc.text('BTW', 160, y, { align: 'right' })
  doc.text(pdfCurrency(invoice.vatTotal), right, y, { align: 'right' })
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Totaal te betalen', 160, y, { align: 'right' })
  doc.text(pdfCurrency(invoice.total), right, y, { align: 'right' })

  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  if (!isQuote) {
    const instructions = invoice.paymentInstructions?.trim()
    if (instructions) {
      const wrappedInstructions = doc.splitTextToSize(instructions, 170)
      doc.text(wrappedInstructions, left, y)
      y += wrappedInstructions.length * 4
    }
  } else {
    if (y > 238) {
      doc.addPage()
      y = 24
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Voor akkoord', left, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.text('Datum:', left, y)
    doc.line(left + 18, y, left + 90, y)
    y += 10
    doc.text('Handtekening:', left, y)
    doc.line(left + 30, y, right, y)
  }

  doc.save(`${filenamePrefix}-${invoice.invoiceNumber}.pdf`)
}
