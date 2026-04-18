import { downloadInvoicePdf } from './pdf'
import type { StoredInvoice } from '../stores/invoiceStore'
import type { CompanyProfile } from '../stores/profileStore'
import type { StoredQuote } from '../stores/quoteStore'

type QuotePdfContext = {
  companyProfile?: CompanyProfile
  sellerName?: string | null
  sellerEmail?: string | null
  sellerKvk?: string | null
  sellerIban?: string | null
  sellerPhone?: string | null
}

const toInvoiceLike = (quote: StoredQuote, context?: QuotePdfContext): StoredInvoice => ({
  id: quote.id,
  userId: quote.userId,
  invoiceNumber: quote.quoteNumber,
  companyName: context?.companyProfile?.companyName?.trim() || quote.companyName,
  logoDataUrl: quote.logoDataUrl ?? null,
  clientName: quote.clientName,
  clientEmail: quote.clientEmail,
  clientContactName: quote.clientContactName,
  clientPhone: quote.clientPhone,
  clientAddress: quote.clientAddress,
  clientPostalCode: quote.clientPostalCode,
  clientCity: quote.clientCity,
  clientCountry: quote.clientCountry,
  clientKvkNumber: quote.clientKvkNumber,
  clientBtwNumber: quote.clientBtwNumber,
  clientIban: quote.clientIban,
  clientPaymentTermDays: quote.clientPaymentTermDays,
  clientNotes: quote.clientNotes,
  invoiceDescription: quote.quoteDescription,
  discountDescription: quote.discountDescription,
  discountAmount: quote.discountAmount,
  paymentInstructions: '',
  hasDueDate: quote.hasDueDate,
  issueDate: quote.issueDate,
  dueDate: quote.dueDate,
  currencyCode: quote.currencyCode,
  pricingMode: quote.pricingMode,
  vatExemptionReason: quote.vatExemptionReason,
  subtotal: quote.subtotal,
  vatTotal: quote.vatTotal,
  total: quote.total,
  status: 'concept',
  lines: quote.lines,
  isImported: false,
  createdAt: quote.createdAt,
})

export const downloadQuotePdf = async (quote: StoredQuote, context?: QuotePdfContext) => {
  await downloadInvoicePdf(toInvoiceLike(quote, context), {
    variant: 'quote',
    filenamePrefix: 'offerte',
    sellerProfile: context?.companyProfile,
    sellerName: context?.sellerName,
    sellerEmail: context?.sellerEmail,
    sellerKvk: context?.sellerKvk,
    sellerIban: context?.sellerIban,
    sellerPhone: context?.sellerPhone,
  })
}
