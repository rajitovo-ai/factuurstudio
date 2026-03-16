import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InvoiceGenerator from '../components/invoice/InvoiceGenerator'
import { useAuthStore } from '../stores/authStore'
import { useInvoiceStore } from '../stores/invoiceStore'

export default function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.userId)
  const invoices = useInvoiceStore((state) => state.invoices)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const loadedForUserId = useInvoiceStore((state) => state.loadedForUserId)
  const isLoading = useInvoiceStore((state) => state.isLoading)

  useEffect(() => {
    if (userId) {
      void loadInvoices(userId)
    }
  }, [loadInvoices, userId])

  const invoice = invoices.find(
    (inv) => inv.id === id && inv.userId === userId && inv.status === 'concept',
  )

  useEffect(() => {
    if (isLoading || loadedForUserId !== userId) {
      return
    }

    if (!invoice) {
      navigate('/facturen', { replace: true })
    }
  }, [invoice, isLoading, loadedForUserId, navigate, userId])

  if (isLoading || loadedForUserId !== userId) return null
  if (!invoice) return null

  return <InvoiceGenerator editInvoice={invoice} />
}
