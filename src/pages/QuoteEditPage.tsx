import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuoteGenerator from '../components/quote/QuoteGenerator'
import { useAuthStore } from '../stores/authStore'
import { useQuoteStore } from '../stores/quoteStore'

export default function QuoteEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.userId)
  const quotes = useQuoteStore((state) => state.quotes)
  const loadQuotes = useQuoteStore((state) => state.loadQuotes)
  const loadedForUserId = useQuoteStore((state) => state.loadedForUserId)
  const isLoading = useQuoteStore((state) => state.isLoading)

  useEffect(() => {
    if (userId) {
      void loadQuotes(userId)
    }
  }, [loadQuotes, userId])

  const quote = quotes.find((entry) => entry.id === id && entry.userId === userId && entry.status === 'concept')

  useEffect(() => {
    if (isLoading || loadedForUserId !== userId) {
      return
    }

    if (!quote) {
      navigate('/offertes', { replace: true })
    }
  }, [isLoading, loadedForUserId, navigate, quote, userId])

  if (isLoading || loadedForUserId !== userId) return null
  if (!quote) return null

  return <QuoteGenerator editQuote={quote} />
}
