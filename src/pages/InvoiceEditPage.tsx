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

  const invoice = invoices.find(
    (inv) => inv.id === id && inv.userId === userId && inv.status === 'concept',
  )

  useEffect(() => {
    if (!invoice) {
      navigate('/facturen', { replace: true })
    }
  }, [invoice, navigate])

  if (!invoice) return null

  return <InvoiceGenerator editInvoice={invoice} />
}
