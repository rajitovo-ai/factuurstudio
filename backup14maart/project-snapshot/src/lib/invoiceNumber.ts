import type { StoredInvoice } from '../stores/invoiceStore'

export const getNextInvoiceNumber = (invoices: StoredInvoice[], userId: string | null) => {
  const year = new Date().getFullYear()

  if (!userId) {
    return `${year}-0001`
  }

  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)

  const yearNumbers = userInvoices
    .map((invoice) => {
      const [invoiceYear, sequence] = invoice.invoiceNumber.split('-')
      if (Number(invoiceYear) !== year) return null
      const parsedSequence = Number(sequence)
      return Number.isNaN(parsedSequence) ? null : parsedSequence
    })
    .filter((value): value is number => value !== null)

  const highestSequence = yearNumbers.length ? Math.max(...yearNumbers) : 0
  const nextSequence = String(highestSequence + 1).padStart(4, '0')

  return `${year}-${nextSequence}`
}
