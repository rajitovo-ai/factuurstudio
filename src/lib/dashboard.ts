import { getInvoiceDisplayStatus, type StoredInvoice } from '../stores/invoiceStore'

export type DashboardMetrics = {
  userInvoices: StoredInvoice[]
  openInvoices: StoredInvoice[]
  overdueInvoices: StoredInvoice[]
  conceptInvoices: StoredInvoice[]
  recentInvoices: StoredInvoice[]
  openAmount: number
  paidAmount: number
  monthlyInvoiceCount: number
  paidThisMonthCount: number
  trend: Array<{ month: string; paidTotal: number }>
}

export const deriveDashboardMetrics = (
  invoices: StoredInvoice[],
  userId: string | null,
  currentMonth: string,
): DashboardMetrics => {
  const userInvoices = invoices.filter((invoice) => invoice.userId === userId)
  const openInvoices: StoredInvoice[] = []
  const overdueInvoices: StoredInvoice[] = []
  const conceptInvoices: StoredInvoice[] = []

  let openAmount = 0
  let paidAmount = 0
  let monthlyInvoiceCount = 0
  let paidThisMonthCount = 0

  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - (5 - index))
    return date.toISOString().slice(0, 7)
  })
  const trendMap = new Map<string, number>()
  for (const month of monthKeys) trendMap.set(month, 0)

  for (const invoice of userInvoices) {
    const displayStatus = getInvoiceDisplayStatus(invoice)
    const monthKey = invoice.issueDate.slice(0, 7)

    if (invoice.issueDate.startsWith(currentMonth)) {
      monthlyInvoiceCount += 1
      if (displayStatus === 'betaald') {
        paidThisMonthCount += 1
      }
    }

    if (displayStatus === 'verzonden') {
      openInvoices.push(invoice)
      openAmount += invoice.total
    } else if (displayStatus === 'vervallen') {
      overdueInvoices.push(invoice)
    } else if (displayStatus === 'betaald') {
      paidAmount += invoice.total
      if (trendMap.has(monthKey)) {
        trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + invoice.total)
      }
    } else {
      conceptInvoices.push(invoice)
    }
  }

  const recentInvoices = [...userInvoices]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const trend = monthKeys.map((month) => ({ month, paidTotal: trendMap.get(month) ?? 0 }))

  return {
    userInvoices,
    openInvoices,
    overdueInvoices,
    conceptInvoices,
    recentInvoices,
    openAmount,
    paidAmount,
    monthlyInvoiceCount,
    paidThisMonthCount,
    trend,
  }
}