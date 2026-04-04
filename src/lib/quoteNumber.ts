type QuoteNumberCandidate = {
  userId: string
  quoteNumber: string
}

export const getNextQuoteNumber = (quotes: QuoteNumberCandidate[], userId: string | null) => {
  const year = new Date().getFullYear()

  if (!userId) {
    return `OFF-${year}-0001`
  }

  const userQuotes = quotes.filter((quote) => quote.userId === userId)

  const yearNumbers = userQuotes
    .map((quote) => {
      const [prefix, quoteYear, sequence] = quote.quoteNumber.split('-')
      if (prefix !== 'OFF' || Number(quoteYear) !== year) return null
      const parsedSequence = Number(sequence)
      return Number.isNaN(parsedSequence) ? null : parsedSequence
    })
    .filter((value): value is number => value !== null)

  const highestSequence = yearNumbers.length ? Math.max(...yearNumbers) : 0
  const nextSequence = String(highestSequence + 1).padStart(4, '0')

  return `OFF-${year}-${nextSequence}`
}
