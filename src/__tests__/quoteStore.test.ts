import { getQuoteDisplayStatus, type QuoteDisplayStatus } from '../lib/quoteStatus'

type QuoteStatusInput = {
  status: QuoteDisplayStatus
  expiresAt: string | null
  dueDate: string
}

const createQuote = (overrides: Partial<QuoteStatusInput> = {}): QuoteStatusInput => ({
  dueDate: '2099-01-01',
  expiresAt: null,
  status: 'verzonden',
  ...overrides,
})

describe('getQuoteDisplayStatus', () => {
  it('returns terminal statuses unchanged', () => {
    expect(getQuoteDisplayStatus(createQuote({ status: 'concept' }))).toBe('concept')
    expect(getQuoteDisplayStatus(createQuote({ status: 'goedgekeurd' }))).toBe('goedgekeurd')
    expect(getQuoteDisplayStatus(createQuote({ status: 'afgewezen' }))).toBe('afgewezen')
  })

  it('returns verzonden for active sent quotes', () => {
    expect(getQuoteDisplayStatus(createQuote({ status: 'verzonden', dueDate: '2099-01-01' }))).toBe('verzonden')
  })

  it('returns vervallen when due date is in the past', () => {
    expect(getQuoteDisplayStatus(createQuote({ status: 'verzonden', dueDate: '2000-01-01' }))).toBe('vervallen')
  })

  it('prefers expiresAt when available', () => {
    expect(
      getQuoteDisplayStatus(
        createQuote({ status: 'verzonden', dueDate: '2099-01-01', expiresAt: '2000-01-01' }),
      ),
    ).toBe('vervallen')
  })
})
