import { getNextQuoteNumber } from '../lib/quoteNumber'

describe('getNextQuoteNumber', () => {
  it('returns first quote number for missing user', () => {
    const quoteNumber = getNextQuoteNumber([], null)
    expect(quoteNumber).toMatch(/^OFF-\d{4}-0001$/)
  })

  it('increments sequence for same year and user', () => {
    const currentYear = String(new Date().getFullYear())
    const userId = 'user-1'

    const quoteNumber = getNextQuoteNumber(
      [
        { userId, quoteNumber: `OFF-${currentYear}-0001` },
        { userId, quoteNumber: `OFF-${currentYear}-0004` },
      ],
      userId,
    )

    expect(quoteNumber).toBe(`OFF-${currentYear}-0005`)
  })

  it('ignores malformed and other-user quote numbers', () => {
    const currentYear = String(new Date().getFullYear())
    const userId = 'user-1'

    const quoteNumber = getNextQuoteNumber(
      [
        { userId: 'user-2', quoteNumber: `OFF-${currentYear}-0099` },
        { userId, quoteNumber: `BAD-${currentYear}-0009` },
        { userId, quoteNumber: `OFF-${Number(currentYear) - 1}-0009` },
      ],
      userId,
    )

    expect(quoteNumber).toBe(`OFF-${currentYear}-0001`)
  })
})
