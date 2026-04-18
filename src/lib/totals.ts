import type { PricingMode } from '../stores/invoiceStore'

export type DiscountTotals = {
  subtotal: number
  vatTotal: number
  discountAmount: number
  total: number
}

type BaseLine = {
  quantity: number
  unitPrice: number
  vatRate: 0 | 9 | 21
}

export function calculateTotalsWithDiscount(
  lines: BaseLine[],
  pricingMode: PricingMode,
  discountAmount?: number,
  noVat = false,
): DiscountTotals {
  const normalizedDiscount = Math.max(0, discountAmount ?? 0)

  const items = lines.map((line) => {
    const vatRate = noVat ? 0 : line.vatRate
    const lineBase =
      pricingMode === 'incl'
        ? (line.quantity * line.unitPrice) / (1 + vatRate / 100)
        : line.quantity * line.unitPrice
    const lineVat = lineBase * (vatRate / 100)
    return {
      lineBase,
      lineVat,
      lineGross: lineBase + lineVat,
      vatRate,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + item.lineBase, 0)
  const originalVatTotal = items.reduce((sum, item) => sum + item.lineVat, 0)
  const totalGross = subtotal + originalVatTotal

  if (normalizedDiscount <= 0 || totalGross <= 0) {
    return {
      subtotal,
      vatTotal: originalVatTotal,
      discountAmount: 0,
      total: totalGross,
    }
  }

  const effectiveDiscount = Math.min(normalizedDiscount, totalGross)
  let discountExVat = 0
  let discountVat = 0

  items.forEach((item) => {
    const share = item.lineGross / totalGross
    const lineDiscountGross = effectiveDiscount * share
    const lineDiscountExVat = item.vatRate === 0 ? lineDiscountGross : lineDiscountGross / (1 + item.vatRate / 100)
    discountExVat += lineDiscountExVat
    discountVat += lineDiscountGross - lineDiscountExVat
  })

  return {
    subtotal,
    vatTotal: Math.max(0, originalVatTotal - discountVat),
    discountAmount: effectiveDiscount,
    total: Math.max(0, totalGross - effectiveDiscount),
  }
}
