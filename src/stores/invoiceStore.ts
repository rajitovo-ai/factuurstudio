import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type InvoiceStatus = 'concept' | 'verzonden' | 'betaald' | 'vervallen'
export type PricingMode = 'excl' | 'incl'

export type StoredInvoiceLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

export type StoredInvoice = {
  id: string
  userId: string
  invoiceNumber: string
  companyName: string
  logoDataUrl?: string | null
  clientName: string
  clientEmail: string
  issueDate: string
  dueDate: string
  currencyCode: string
  pricingMode: PricingMode
  subtotal: number
  vatTotal: number
  total: number
  status: InvoiceStatus
  lines: StoredInvoiceLine[]
  createdAt: string
}

type CreateInvoiceInput = Omit<StoredInvoice, 'id' | 'createdAt'>
type UpdateInvoiceInput = Omit<StoredInvoice, 'id' | 'userId' | 'status' | 'createdAt'>

type InvoiceState = {
  invoices: StoredInvoice[]
  createInvoice: (invoice: CreateInvoiceInput) => void
  updateInvoice: (invoiceId: string, update: UpdateInvoiceInput) => void
  removeInvoice: (invoiceId: string) => void
  markInvoiceSent: (invoiceId: string) => void
  markInvoicePaid: (invoiceId: string) => void
}

export const getInvoiceDisplayStatus = (invoice: StoredInvoice): InvoiceStatus => {
  if (invoice.status === 'concept') {
    return 'concept'
  }

  if (invoice.status === 'betaald') {
    return 'betaald'
  }

  const today = new Date().toISOString().slice(0, 10)
  if (invoice.dueDate < today) {
    return 'vervallen'
  }

  return 'verzonden'
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoices: [],
      createInvoice: (invoice) => {
        set((state) => ({
          invoices: [
            {
              ...invoice,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.invoices,
          ],
        }))
      },
      updateInvoice: (invoiceId, update) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === invoiceId && invoice.status === 'concept'
              ? { ...invoice, ...update }
              : invoice,
          ),
        }))
      },
      removeInvoice: (invoiceId) => {
        set((state) => ({
          invoices: state.invoices.filter(
            (invoice) => !(invoice.id === invoiceId && invoice.status === 'concept'),
          ),
        }))
      },
      markInvoiceSent: (invoiceId) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === invoiceId && invoice.status === 'concept'
              ? { ...invoice, status: 'verzonden' }
              : invoice,
          ),
        }))
      },
      markInvoicePaid: (invoiceId) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === invoiceId && invoice.status !== 'concept'
              ? { ...invoice, status: 'betaald' }
              : invoice,
          ),
        }))
      },
    }),
    {
      name: 'factuurstudio.local.invoices',
    },
  ),
)
