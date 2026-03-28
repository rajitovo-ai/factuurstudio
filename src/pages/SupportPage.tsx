import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '../lib/analytics'
import { supportArticles, supportCategories, supportQuickLinks } from '../lib/support'
import { supabase } from '../lib/supabase'

type CategoryFilter = (typeof supportCategories)[number]

type UserSupportTicket = {
  id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  admin_response: string | null
  responded_at: string | null
  created_at: string
}

export default function SupportPage() {
  const { t } = useTranslation(['support', 'common'])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Alle')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [ticketStatus, setTicketStatus] = useState<string | null>(null)
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [feedbackByArticle, setFeedbackByArticle] = useState<Record<string, 'yes' | 'no'>>({})
  const [myTickets, setMyTickets] = useState<UserSupportTicket[]>([])

  const loadMyTickets = async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id, subject, message, status, admin_response, responded_at, created_at')
      .order('created_at', { ascending: false })
      .limit(6)

    if (!error) {
      setMyTickets((data as UserSupportTicket[]) ?? [])
    }
  }

  useEffect(() => {
    trackEvent('support_opened')

    const timer = window.setTimeout(() => {
      void loadMyTickets()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!query.trim()) return
    const timer = window.setTimeout(() => {
      trackEvent('support_search_used', { query: query.trim() })
    }, 500)

    return () => window.clearTimeout(timer)
  }, [query])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return supportArticles.filter((article) => {
      if (category !== 'Alle' && article.category !== category) return false

      if (!normalizedQuery) return true

      const haystack = [article.title, article.summary, ...article.keywords].join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [category, query])

  const contactHref =
    'mailto:info@webdesignerstudio.nl?subject=Supportvraag%20Factuur%20Studio&body=Hoi%20supportteam%2C%0A%0AIk%20heb%20hulp%20nodig%20met%3A%0A%0A%28Omschrijf%20hier%20je%20vraag%29'

  const submitTicket = async () => {
    const normalizedSubject = subject.trim()
    const normalizedMessage = message.trim()

    if (normalizedSubject.length < 3) {
      setTicketError(t('support:messages.subjectMinChars'))
      return
    }

    if (normalizedMessage.length < 10) {
      setTicketError(t('support:messages.messageMinChars'))
      return
    }

    setTicketError(null)
    setTicketStatus(null)
    setIsSubmittingTicket(true)

    const { data, error } = await supabase.rpc('create_support_ticket', {
      p_subject: normalizedSubject,
      p_message: normalizedMessage,
      p_page_context: '/support',
    })

    setIsSubmittingTicket(false)

    if (error) {
      setTicketError(t('support:messages.ticketFailed'))
      return
    }

    trackEvent('support_ticket_submitted', {
      source: 'support_page_form',
      ticketId: typeof data === 'string' ? data : null,
    })
    setTicketStatus(t('support:messages.ticketSent'))
    setSubject('')
    setMessage('')
    await loadMyTickets()
  }

  const setArticleFeedback = (articleId: string, choice: 'yes' | 'no') => {
    setFeedbackByArticle((current) => ({
      ...current,
      [articleId]: choice,
    }))

    trackEvent(choice === 'yes' ? 'support_feedback_yes' : 'support_feedback_no', {
      articleId,
    })
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('support:support')}</p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">{t('support:helpCenter')}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('support:description')}
            </p>
          </div>
          <a
            href={contactHref}
            onClick={() => trackEvent('support_contact_started', { source: 'support_page_header' })}
            className="rounded-lg border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
          >
            {t('support:contactSupport')}
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('support:myTickets')}</p>
            <p className="mt-1 text-sm text-slate-600">{t('support:ticketsDescription')}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              void loadMyTickets()
            }}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {t('support:refresh')}
          </button>
        </div>

        {myTickets.length === 0 ? (
          <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {t('support:noTickets')}
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {myTickets.map((ticket) => (
              <article key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{ticket.subject}</p>
                  <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                    {ticket.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{ticket.message}</p>
                {ticket.admin_response ? (
                  <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">{t('support:adminResponse')}</p>
                    <p className="mt-1 text-sm text-emerald-900">{ticket.admin_response}</p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {ticket.responded_at ? new Date(ticket.responded_at).toLocaleString('nl-NL') : ''}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="w-full sm:max-w-lg">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t('support:search')}</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('support:searchPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {supportCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  category === item
                    ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {t('support:noResults')}
            </p>
          ) : (
            filtered.map((article) => (
              <details key={article.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer list-none">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{article.category}</p>
                  <h2 className="mt-1 text-base font-bold text-slate-900">{article.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{article.summary}</p>
                </summary>
                <ol className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-700">
                  {article.steps.map((step, index) => (
                    <li key={step}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
                  <span className="text-xs font-semibold text-slate-500">{t('support:wasThisHelpful')}</span>
                  <button
                    type="button"
                    onClick={() => setArticleFeedback(article.id, 'yes')}
                    className={`rounded-full border px-2 py-1 text-xs font-semibold transition ${
                      feedbackByArticle[article.id] === 'yes'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t('support:yes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleFeedback(article.id, 'no')}
                    className={`rounded-full border px-2 py-1 text-xs font-semibold transition ${
                      feedbackByArticle[article.id] === 'no'
                        ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t('support:no')}
                  </button>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('support:supportTicket')}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{t('support:sendMessage')}</h2>
          </div>
          <a
            href={contactHref}
            onClick={() => trackEvent('support_contact_started', { source: 'support_page_ticket_section' })}
            className="text-xs font-semibold text-cyan-700 hover:underline"
          >
            {t('support:emailDirect')}
          </a>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t('support:subject')}</span>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder={t('support:subjectPlaceholder')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t('support:message')}</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder={t('support:messagePlaceholder')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {ticketError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{ticketError}</p>
          ) : null}
          {ticketStatus ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ticketStatus}</p>
          ) : null}

          <div>
            <button
              type="button"
              onClick={() => {
                void submitTicket()
              }}
              disabled={isSubmittingTicket}
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingTicket ? t('support:submitting') : t('support:submit')}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('support:quickLinks')}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {supportQuickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
