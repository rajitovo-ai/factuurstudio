import { filterInvoices } from '../lib/searchUtils'
import type { StoredInvoice } from '../stores/invoiceStore'

const mockInvoices: StoredInvoice[] = [
  {
    id: '1',
    userId: 'user1',
    invoiceNumber: 'INV-001',
    companyName: 'Test Company',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientContactName: '',
    clientPhone: '',
    clientAddress: '',
    clientPostalCode: '',
    clientCity: '',
    clientCountry: '',
    clientKvkNumber: '',
    clientBtwNumber: '',
    clientIban: '',
    clientPaymentTermDays: 14,
    clientNotes: '',
    invoiceDescription: '',
    hasDueDate: true,
    issueDate: '2024-01-15',
    dueDate: '2024-01-29',
    currencyCode: 'EUR',
    pricingMode: 'excl',
    vatExemptionReason: '',
    subtotal: 100,
    vatTotal: 21,
    total: 121,
    status: 'betaald',
    lines: [],
    isImported: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    invoiceNumber: 'INV-002',
    companyName: 'Test Company',
    clientName: 'Jane Smith',
    clientEmail: 'jane@test.com',
    clientContactName: '',
    clientPhone: '',
    clientAddress: '',
    clientPostalCode: '',
    clientCity: '',
    clientCountry: '',
    clientKvkNumber: '',
    clientBtwNumber: '',
    clientIban: '',
    clientPaymentTermDays: 14,
    clientNotes: '',
    invoiceDescription: '',
    hasDueDate: true,
    issueDate: '2024-02-20',
    dueDate: '2024-03-06',
    currencyCode: 'EUR',
    pricingMode: 'excl',
    vatExemptionReason: '',
    subtotal: 200,
    vatTotal: 42,
    total: 242,
    status: 'concept',
    lines: [],
    isImported: false,
    createdAt: '2024-02-20T10:00:00Z',
  },
]

describe('filterInvoices', () => {
  it('should return all invoices when query is empty', () => {
    const result = filterInvoices(mockInvoices, '')
    expect(result).toHaveLength(2)
  })

  it('should filter by invoice number', () => {
    const result = filterInvoices(mockInvoices, 'INV-001')
    expect(result).toHaveLength(1)
    expect(result[0].invoiceNumber).toBe('INV-001')
  })

  it('should filter by client name (case insensitive)', () => {
    const result = filterInvoices(mockInvoices, 'jane')
    expect(result).toHaveLength(1)
    expect(result[0].clientName).toBe('Jane Smith')
  })

  it('should filter by client email', () => {
    const result = filterInvoices(mockInvoices, 'john@example.com')
    expect(result).toHaveLength(1)
    expect(result[0].clientEmail).toBe('john@example.com')
  })

  it('should filter by total amount', () => {
    const result = filterInvoices(mockInvoices, '121')
    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(121)
  })

  it('should filter by status', () => {
    const result = filterInvoices(mockInvoices, 'concept')
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('concept')
  })

  it('should filter by date', () => {
    const result = filterInvoices(mockInvoices, '2024-01-15')
    expect(result).toHaveLength(1)
    expect(result[0].issueDate).toBe('2024-01-15')
  })

  it('should return empty array when no matches found', () => {
    const result = filterInvoices(mockInvoices, 'nonexistent')
    expect(result).toHaveLength(0)
  })
})
