export type QuoteDisplayStatus = 'concept' | 'verzonden' | 'goedgekeurd' | 'afgewezen' | 'vervallen'

type QuoteStatusInput = {
  status: QuoteDisplayStatus
  expiresAt: string | null
  dueDate: string
}

export const getQuoteDisplayStatus = (quote: QuoteStatusInput): QuoteDisplayStatus => {
  if (quote.status === 'concept' || quote.status === 'goedgekeurd' || quote.status === 'afgewezen') {
    return quote.status
  }

  const referenceDate = quote.expiresAt ?? quote.dueDate
  if (referenceDate) {
    const today = new Date().toISOString().slice(0, 10)
    if (referenceDate < today) {
      return 'vervallen'
    }
  }

  return quote.status
}
