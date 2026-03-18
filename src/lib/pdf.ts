import { jsPDF } from 'jspdf'
import type { StoredInvoice } from '../stores/invoiceStore'

const currency = (amount: number, code = 'EUR') =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: code,
  }).format(amount)

const formatDate = (isoDate: string) => {
  if (!isoDate) return '-'
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

export const downloadInvoicePdf = (invoice: StoredInvoice) => {
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
  doc.text(invoice.companyName || 'Bedrijfsnaam', left, y)

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
  doc.text(`Factuurnummer: ${invoice.invoiceNumber}`, left, y)
  y += 5
  doc.text(`Factuurdatum: ${formatDate(invoice.issueDate)}`, left, y)
  y += 5
  doc.text(`Vervaldatum: ${invoice.hasDueDate ? formatDate(invoice.dueDate) : 'n.v.t.'}`, left, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Factuur voor', left, y)
  doc.setFont('helvetica', 'normal')
  if (invoice.clientContactName) {
    y += 5
    doc.text(invoice.clientContactName, left, y)
  }
  y += 5
  doc.text(invoice.clientName || '-', left, y)
  y += 5
  doc.text(invoice.clientEmail || '-', left, y)
  if (invoice.clientPhone) {
    y += 5
    doc.text(`Tel: ${invoice.clientPhone}`, left, y)
  }
  if (invoice.clientAddress) {
    y += 5
    doc.text(invoice.clientAddress, left, y)
  }
  const clientCityLine = [invoice.clientPostalCode, invoice.clientCity].filter(Boolean).join(' ')
  if (clientCityLine || invoice.clientCountry) {
    y += 5
    const location = [clientCityLine, invoice.clientCountry].filter(Boolean).join(' - ')
    doc.text(location || '-', left, y)
  }
  if (invoice.clientIban) {
    y += 5
    doc.text(`IBAN klant: ${invoice.clientIban}`, left, y)
  }
  if (invoice.clientKvkNumber || invoice.clientBtwNumber) {
    y += 5
    const regInfo = [
      invoice.clientKvkNumber ? `KvK: ${invoice.clientKvkNumber}` : '',
      invoice.clientBtwNumber ? `BTW: ${invoice.clientBtwNumber}` : '',
    ]
      .filter(Boolean)
      .join(' | ')
    doc.text(regInfo, left, y)
  }
  if (invoice.clientNotes) {
    y += 5
    doc.text(`Notitie: ${invoice.clientNotes}`, left, y)
  }

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
    doc.text(currency(line.unitPrice, invoice.currencyCode), 145, y, { align: 'right' })
    doc.text(`${line.vatRate}%`, 164, y, { align: 'right' })
    doc.text(currency(lineTotal, invoice.currencyCode), right, y, { align: 'right' })

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
  doc.text(currency(invoice.subtotal, invoice.currencyCode), right, y, { align: 'right' })
  y += 6
  doc.text('BTW', 160, y, { align: 'right' })
  doc.text(currency(invoice.vatTotal, invoice.currencyCode), right, y, { align: 'right' })
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Totaal te betalen', 160, y, { align: 'right' })
  doc.text(currency(invoice.total, invoice.currencyCode), right, y, { align: 'right' })

  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Betaalinstructie: maak het bedrag over onder vermelding van het factuurnummer.', left, y)
  y += 5
  doc.text(`Betaaltermijn klantprofiel: ${invoice.clientPaymentTermDays} dagen.`, left, y)
  y += 5
  doc.text('Deze factuur is zwart/wit en A4 printvriendelijk opgesteld.', left, y)

  doc.save(`factuur-${invoice.invoiceNumber}.pdf`)
}
