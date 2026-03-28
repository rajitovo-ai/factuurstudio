import type { StoredInvoice } from '../stores/invoiceStore'

export function filterInvoices(invoices: StoredInvoice[], query: string): StoredInvoice[] {
  if (!query.trim()) return invoices

  const lowercaseQuery = query.toLowerCase()
  
  return invoices.filter((invoice) => {
    // Search in invoice number
    if (invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery)) {
      return true
    }
    
    // Search in client name
    if (invoice.clientName?.toLowerCase().includes(lowercaseQuery)) {
      return true
    }
    
    // Search in client email
    if (invoice.clientEmail?.toLowerCase().includes(lowercaseQuery)) {
      return true
    }
    
    // Search in total amount
    if (invoice.total.toString().includes(lowercaseQuery)) {
      return true
    }
    
    // Search in status
    if (invoice.status.toLowerCase().includes(lowercaseQuery)) {
      return true
    }
    
    // Search in issue date
    if (invoice.issueDate?.toLowerCase().includes(lowercaseQuery)) {
      return true
    }
    
    return false
  })
}
