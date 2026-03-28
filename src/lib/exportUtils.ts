import type { StoredInvoice } from '../stores/invoiceStore'

export interface ExportOptions {
  dateRange?: {
    start: string
    end: string
  }
  statusFilter?: string[]
  format: 'csv' | 'json'
}

export function exportInvoicesToCSV(invoices: StoredInvoice[], options?: ExportOptions): string {
  // Filter invoices based on options
  let filteredInvoices = invoices
  
  if (options?.dateRange) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => invoice.issueDate >= options.dateRange!.start && 
                   invoice.issueDate <= options.dateRange!.end
    )
  }
  
  if (options?.statusFilter && options.statusFilter.length > 0) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => options.statusFilter!.includes(invoice.status)
    )
  }
  
  // CSV Header
  const headers = [
    'Factuurnummer',
    'Datum',
    'Vervaldatum',
    'Klantnaam',
    'Klant Email',
    'Status',
    'Subtotaal',
    'BTW',
    'Totaal',
    'Valuta',
    'Aangemaakt op'
  ]
  
  // CSV Rows
  const rows = filteredInvoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.issueDate,
    invoice.dueDate,
    invoice.clientName,
    invoice.clientEmail,
    invoice.status,
    invoice.subtotal.toString(),
    invoice.vatTotal.toString(),
    invoice.total.toString(),
    invoice.currencyCode,
    invoice.createdAt
  ])
  
  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => 
      row.map((cell) => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell)
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    )
  ].join('\n')
  
  return csvContent
}

export function exportInvoicesToJSON(invoices: StoredInvoice[], options?: ExportOptions): string {
  // Filter invoices based on options
  let filteredInvoices = invoices
  
  if (options?.dateRange) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => invoice.issueDate >= options.dateRange!.start && 
                   invoice.issueDate <= options.dateRange!.end
    )
  }
  
  if (options?.statusFilter && options.statusFilter.length > 0) {
    filteredInvoices = filteredInvoices.filter(
      (invoice) => options.statusFilter!.includes(invoice.status)
    )
  }
  
  // Create export data with metadata
  const exportData = {
    exportedAt: new Date().toISOString(),
    count: filteredInvoices.length,
    filters: options,
    invoices: filteredInvoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      subtotal: invoice.subtotal,
      vatTotal: invoice.vatTotal,
      total: invoice.total,
      currencyCode: invoice.currencyCode,
      lines: invoice.lines.map((line) => ({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        vatRate: line.vatRate
      }))
    }))
  }
  
  return JSON.stringify(exportData, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function generateExportFilename(format: 'csv' | 'json', prefix = 'facturen'): string {
  const date = new Date().toISOString().split('T')[0]
  return `${prefix}_${date}.${format}`
}
