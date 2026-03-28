import { exportInvoicesToCSV, exportInvoicesToJSON, downloadFile, generateExportFilename } from '../lib/exportUtils'
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
    lines: [
      { id: 1, description: 'Product A', quantity: 2, unitPrice: 50, vatRate: 21 }
    ],
    isImported: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
]

describe('exportInvoicesToCSV', () => {
  it('should export invoices to CSV format', () => {
    const csv = exportInvoicesToCSV(mockInvoices)
    expect(csv).toContain('Factuurnummer')
    expect(csv).toContain('INV-001')
    expect(csv).toContain('John Doe')
    expect(csv).toContain('121')
  })

  it('should filter by date range', () => {
    const csv = exportInvoicesToCSV(mockInvoices, {
      format: 'csv',
      dateRange: { start: '2024-01-01', end: '2024-01-31' }
    })
    expect(csv).toContain('INV-001')
  })

  it('should filter by status', () => {
    const csv = exportInvoicesToCSV(mockInvoices, {
      format: 'csv',
      statusFilter: ['betaald']
    })
    expect(csv).toContain('INV-001')
  })

  it('should return empty CSV with only headers when no invoices match', () => {
    const csv = exportInvoicesToCSV(mockInvoices, {
      format: 'csv',
      statusFilter: ['concept']
    })
    const lines = csv.split('\n')
    expect(lines).toHaveLength(1) // Only header
  })
})

describe('exportInvoicesToJSON', () => {
  it('should export invoices to JSON format', () => {
    const json = exportInvoicesToJSON(mockInvoices)
    const parsed = JSON.parse(json)
    expect(parsed.count).toBe(1)
    expect(parsed.invoices).toHaveLength(1)
    expect(parsed.invoices[0].invoiceNumber).toBe('INV-001')
    expect(parsed.exportedAt).toBeDefined()
  })

  it('should include invoice lines in JSON', () => {
    const json = exportInvoicesToJSON(mockInvoices)
    const parsed = JSON.parse(json)
    expect(parsed.invoices[0].lines).toHaveLength(1)
    expect(parsed.invoices[0].lines[0].description).toBe('Product A')
  })
})

describe('generateExportFilename', () => {
  it('should generate CSV filename with date', () => {
    const filename = generateExportFilename('csv')
    expect(filename).toMatch(/^facturen_\d{4}-\d{2}-\d{2}\.csv$/)
  })

  it('should generate JSON filename with date', () => {
    const filename = generateExportFilename('json')
    expect(filename).toMatch(/^facturen_\d{4}-\d{2}-\d{2}\.json$/)
  })

  it('should use custom prefix', () => {
    const filename = generateExportFilename('csv', 'export')
    expect(filename).toMatch(/^export_\d{4}-\d{2}-\d{2}\.csv$/)
  })
})

describe('downloadFile', () => {
  it('should create download link with correct attributes', () => {
    const mockCreateElement = jest.fn()
    const mockAppendChild = jest.fn()
    const mockRemoveChild = jest.fn()
    const mockClick = jest.fn()
    const mockRevokeObjectURL = jest.fn()
    const mockCreateObjectURL = jest.fn(() => 'blob:url')

    Object.defineProperty(globalThis, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
    })

    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
    }

    mockCreateElement.mockReturnValue(mockLink)

    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
    })
    Object.defineProperty(document.body, 'appendChild', {
      value: mockAppendChild,
    })
    Object.defineProperty(document.body, 'removeChild', {
      value: mockRemoveChild,
    })

    downloadFile('test content', 'test.csv', 'text/csv')

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalled()
  })
})
