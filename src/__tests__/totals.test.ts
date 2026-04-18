import { calculateTotalsWithDiscount } from '../lib/totals'

describe('calculateTotalsWithDiscount', () => {
  it('applies discount as a gross amount and reduces VAT proportionally', () => {
    const totals = calculateTotalsWithDiscount(
      [
        { quantity: 1, unitPrice: 100, vatRate: 21 },
        { quantity: 1, unitPrice: 100, vatRate: 9 },
      ],
      'excl',
      20,
    )

    expect(totals.subtotal).toBeCloseTo(200)
    expect(totals.total).toBeCloseTo(200 + 21 + 9 - 20)
    expect(totals.discountAmount).toBeCloseTo(20)
    expect(totals.vatTotal).toBeLessThan(30)
  })

  it('returns original totals when discount is zero', () => {
    const totals = calculateTotalsWithDiscount(
      [{ quantity: 2, unitPrice: 50, vatRate: 21 }],
      'excl',
      0,
    )

    expect(totals).toEqual({ subtotal: 100, vatTotal: 21, discountAmount: 0, total: 121 })
  })

  it('caps discount at the total gross amount', () => {
    const totals = calculateTotalsWithDiscount(
      [{ quantity: 1, unitPrice: 100, vatRate: 21 }],
      'excl',
      200,
    )

    expect(totals.total).toBe(0)
    expect(totals.discountAmount).toBe(121)
  })
})
