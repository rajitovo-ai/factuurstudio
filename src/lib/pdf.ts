import { jsPDF } from 'jspdf'
import type { StoredInvoice } from '../stores/invoiceStore'

// PDF currency formatter using unicode euro sign
const pdfCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `\u20AC${formatted}`
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
    putOnlyUsedFonts: true,
    floatPrecision: 'smart',
  })

  // Add custom font with euro sign support for mobile PDF viewers
  try {
    // DejaVu Sans base64 - supports euro sign (€)
    const dejavuSansBase64 = 'AAEAAAATAQAABAAwR0RFRgARAAoAAAGwAAAALEdQT1NEdEx1AAACWAAAAVJHU1VCw4z8ngAAAsAAAABUT1MvMqCnsqMAAALQAAAAYGNtYXDq8uPdAAADHAAAAmZjdnQgAB8AAAAABNgAAAAwZnBnbZ42EcoAAATwAAAOFWdhc3AAHgAjAAAF0AAAAAxnbHlmk0r4LgAABdgAAB3CaGVhZAWsFKEAAB/EAAAANmhoZWEGsgThAAAgAAAAACRobXR4GkgAAAAAICQAAAAkbG9jYQxRBPIAACBUAAAAGm1heHABHA8DAAAgbAAAACBuYW1lCjcOMQAAIIwAAAGKcG9zdP+fADIAAAJAAAAAIXByZXCY2Pj2AAAiJAAAAIYAAQAAAAEAADj9N25fDzz1AAsIAAAAAADNRP7CAAAAAM1E/sL+Lf8NBHsEOQAAAAgAAgAAAAAAAAABAAAEOv8NAAAIiv4t/kgEewABAAAAAAAAAAAAAAAAAAABHQABAAABHQB4AAUAAAAAAAIAHAAgAE0AAAEuAFoAAwABAAEBCgGQAAACvAAFAAQAAQAAAAAAAAAAAAAAAAAAAAMAAQAAAAAAwP8AAMAAAAAAAAAAAAAAAAAAAQAAAAMAAAAcAAQAAQAMAAEABAAAAAIAAAABAAA3AAAAAAABBAECAAAAAgADAAEAAgAEAAUAAQAGAAcACAABAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AH4AfwCAAIEAggCDAIQAhQCGAIcAiACJAIoAiwCMAI0AjgCPAJAAkQCSAJMAlACVAJYAlwCYAJkAmgCbAJwAnQCeAJ8AoAChAKIAowCkAKUApgCnAKgAqQCqAKsArACtAK4ArwCwALEAsgCzALQAtQC2ALcAuAC5ALoAuwC8AL0AvgC/AMAAwQDCAMMAxADFAMYAxwDIAMkAygDLAMwAzQDOAM8A0ADRANIA0wDUANUA1gDXANgA2QDaANsA3ADdAN4A3wDgAOEA4gDjAOQA5QDmAOcA6ADpAOoA6wDsAO0A7gDvAPAA8QDyAPMA9AD1APYA9wD4APkA+gD7APwA/QD+AP8BAAEBAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYBVwFYAVkBWgFbAVwBXQFeAV8BYAFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAICAgkCCgILAgwCDQIOAg8CEAIRAhICEwIUAhUCFgIXAhgCGQIaAhsCHAIdAh4CHwIgAiECIgIjAiQCJQImAicCKAIpAioCKwIsAi0CLgIvAjACMQIyAjMCNAI1AjYCNwI4AjkCOgI7AjwCPQI+Aj8CQAJBAkICQwJEAkUCRgJHAkgCSQJKAksCTAJNAk4CTwJQAlECUgJTAlQCVQJWAlcCWAJZAloCWwJcAl0CXgJfAmACYQJiAmMCZAJlAmYCZwJoAmkCagJrAmwCbQJuAm8CcAJxAnICcwJ0AnUCdgJ3AngCeQJ6AnsCfAJ9An4CfwKAAoECggKDAoQChQKGAocCiAKJAooCiwKMAo0CjgKPApACkQKSApMClAKVApYClwKYApkCmgKbApwCnQKeAp8CoAKhAqICowKkAqUCpgKnAqgCqQKqAqsCrAKtAq4CrwKwArECsgKzArQCtQK2ArcCuAK5AroCuwK8Ar0CvgK/AsACwQLCAsMCxALFAsYCxwLIAskCygLLAswCzQLOAs8C0ALRAtIC0wLUAtUC1gLXAtgC2QLaAtsC3ALdAt4C3wLgAuEC4gLjAuQC5QLmAucC6ALpAuoC6wLsAu0C7gLvAvAC8QLyAvMC9AL1AvYC9wL4AvkC+gL7AvwC/QL+Av8DAAMBAwIDAwMEAwUDBgMHAwgDCQMKAwsDDAMNAw4DDwMQAxEDEgMTAxQDFQMWAxcDGAMZAxoDGwMcAx0DHgMfAyADIQMiAyMDJAMlAyYDJwMoAykDKgMrAywDLQMuAy8DMAMxAzIDMwM0AzUDNgM3AzgDOQM6AzsDPAM9Az4DPwNAA0EDQgNDA0QDRQNGA0cDSANJA0oDSwNMA00DTgNPA1ADUQNSA1MDVANVA1YDVwNYA1kDWgNbA1wDXQNeA18DYANhA2IDYwNkA2UDZgNnA2gDaQNqA2sDbANtA24DbwNwA3EDcgNzA3QDdQN2A3cDeAN5A3oDewN8A30DfgN/A4ADgQOCA4MDhAOFA4YDhwOIA4kDigOLA4wDjQOOA48DkAORA5IDkwOUA5UDlgOXA5gDmQOaA5sDnAOdA54DnwOgA6EDogOjA6QDpQOmA6cDqAOpA6oDqwOsA60DrgOvA7ADsQOyA7MDtAO1A7YDtwO4A7kDugO7A7wDvQO+A78DwAPBA8IDwwPEA8UDxgPHA8gDyQPKA8sDzAPNA84DzwPQA9ED0gPTA9QD1QPWA9cD2APZA9oD2wPcA90D3gPfA+AD4QPiA+MD5APlA+YD5wPoA+kD6gPrA+wD7QPuA+8D8APxA/ID8wP0A/UD9gP3A/gD+QP6A/sD/AP9A/4D/wQABAIEAwQEBAUEBgQHBASEAkQCggLDA0ODxAfEiMUJygrLC80OTxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='
    doc.addFileToVFS('DejaVuSans.ttf', dejavuSansBase64)
    doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal')
    doc.addFont('DejaVuSans.ttf', 'DejaVu', 'bold')
  } catch {
    // Fallback to default font if custom font fails
  }

  const left = 16
  const right = 194
  let y = 18

  doc.setTextColor(0, 0, 0)
  doc.setLineWidth(0.3)

  doc.setFont('DejaVu', 'bold')
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

  doc.setFont('DejaVu', 'normal')
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
