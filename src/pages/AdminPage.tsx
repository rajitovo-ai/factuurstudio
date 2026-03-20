import { useCallback, useEffect, useMemo, useState } from 'react'
import { PLAN_CONFIGS } from '../lib/billing'
import { supabase } from '../lib/supabase'

type AdminStats = {
  totalUsers: number
  totalInvoices: number
  paidInvoices: number
  openInvoices: number
  paidRevenue: number
  freeUsers: number
  proUsers: number
}

type RecentUser = {
  user_id: string
  email: string
  created_at: string
  plan: 'free' | 'pro'
  invoices: number
}

type AdminUser = {
  email: string
  created_at: string
}

type RewardSettings = {
  threshold: number
  reward_type: 'pro_month' | 'discount_percent' | 'credit_eur'
  reward_value: number
}

type SupportTicket = {
  id: string
  user_id: string
  user_email: string
  subject: string
  message: string
  page_context: string | null
  status: 'open' | 'in_progress' | 'resolved'
  admin_response: string | null
  responded_by_email: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
}

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  totalInvoices: 0,
  paidInvoices: 0,
  openInvoices: 0,
  paidRevenue: 0,
  freeUsers: 0,
  proUsers: 0,
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])

  const [rewardSettings, setRewardSettings] = useState<RewardSettings>({
    threshold: 3,
    reward_type: 'pro_month',
    reward_value: 1,
  })

  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])
  const [supportStatusFilter, setSupportStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({})

  const showMessage = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage(null), 2500)
  }

  const loadSupportTickets = useCallback(async (statusFilter: 'all' | 'open' | 'in_progress' | 'resolved') => {
    const { data, error: ticketsError } = await supabase.rpc('admin_list_support_tickets', {
      p_limit: 120,
      p_status: statusFilter === 'all' ? null : statusFilter,
    })

    if (ticketsError) {
      setError(ticketsError.message)
      return
    }

    setSupportTickets((data as SupportTicket[]) ?? [])
  }, [])

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [adminCheck, dashboardStats, usersResult, rewardResult, adminsResult] = await Promise.all([
      supabase.rpc('is_admin'),
      supabase.rpc('admin_dashboard_stats'),
      supabase.rpc('admin_recent_users', { p_limit: 20 }),
      supabase
        .from('referral_reward_settings')
        .select('threshold, reward_type, reward_value')
        .eq('id', true)
        .maybeSingle(),
      supabase.rpc('admin_list_admin_users'),
    ])

    if (adminCheck.error) {
      setIsAdmin(false)
      setError(adminCheck.error.message)
      setLoading(false)
      return
    }

    const allowed = Boolean(adminCheck.data)
    setIsAdmin(allowed)

    if (!allowed) {
      setLoading(false)
      return
    }

    if (dashboardStats.error) {
      setError(dashboardStats.error.message)
      setLoading(false)
      return
    }

    if (usersResult.error) {
      setError(usersResult.error.message)
      setLoading(false)
      return
    }

    if (adminsResult.error) {
      setError(adminsResult.error.message)
      setLoading(false)
      return
    }

    setStats((dashboardStats.data as AdminStats) ?? EMPTY_STATS)
    setRecentUsers((usersResult.data as RecentUser[]) ?? [])
    setAdmins((adminsResult.data as AdminUser[]) ?? [])
    await loadSupportTickets(supportStatusFilter)

    if (!rewardResult.error && rewardResult.data) {
      setRewardSettings({
        threshold: Math.max(1, rewardResult.data.threshold ?? 3),
        reward_type:
          rewardResult.data.reward_type === 'discount_percent'
            ? 'discount_percent'
            : rewardResult.data.reward_type === 'credit_eur'
              ? 'credit_eur'
              : 'pro_month',
        reward_value: Number(rewardResult.data.reward_value ?? 1),
      })
    }

    setLoading(false)
  }, [loadSupportTickets, supportStatusFilter])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAdminData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadAdminData])

  const statCards = useMemo(
    () => [
      { label: 'Gebruikers', value: String(stats.totalUsers) },
      { label: 'Facturen', value: String(stats.totalInvoices) },
      { label: 'Betaald', value: String(stats.paidInvoices) },
      { label: 'Openstaand', value: String(stats.openInvoices) },
      { label: 'Omzet betaald', value: formatCurrency(stats.paidRevenue) },
      { label: 'Pro plans', value: `${stats.proUsers} / ${stats.freeUsers + stats.proUsers}` },
    ],
    [stats],
  )

  const updateUserPlan = async (userId: string, nextPlan: 'free' | 'pro') => {
    const { error: setPlanError } = await supabase.rpc('admin_set_user_plan', {
      p_user_id: userId,
      p_plan: nextPlan,
    })

    if (setPlanError) {
      setError(setPlanError.message)
      return
    }

    setRecentUsers((current) =>
      current.map((user) => (user.user_id === userId ? { ...user, plan: nextPlan } : user)),
    )
    showMessage(`Plan gewijzigd naar ${PLAN_CONFIGS[nextPlan].name}.`)
  }

  const saveRewardSettings = async () => {
    const { error: rewardError } = await supabase.rpc('admin_upsert_reward_settings', {
      p_threshold: Math.max(1, Math.round(rewardSettings.threshold)),
      p_reward_type: rewardSettings.reward_type,
      p_reward_value: Math.max(0, rewardSettings.reward_value),
    })

    if (rewardError) {
      setError(rewardError.message)
      return
    }

    showMessage('Referral instellingen opgeslagen.')
  }

  const addAdmin = async () => {
    const email = newAdminEmail.trim().toLowerCase()
    if (!email) return

    const { error: addError } = await supabase.rpc('admin_add_admin_email', {
      p_email: email,
    })

    if (addError) {
      setError(addError.message)
      return
    }

    setNewAdminEmail('')
    await loadAdminData()
    showMessage('Admin toegevoegd.')
  }

  const removeAdmin = async (email: string) => {
    const { error: removeError } = await supabase.rpc('admin_remove_admin_email', {
      p_email: email,
    })

    if (removeError) {
      setError(removeError.message)
      return
    }

    await loadAdminData()
    showMessage('Admin verwijderd.')
  }

  const updateSupportTicket = async (
    ticketId: string,
    status: 'open' | 'in_progress' | 'resolved',
    responseOverride?: string,
  ) => {
    const response = (responseOverride ?? ticketReplies[ticketId] ?? '').trim()

    const { error: replyError } = await supabase.rpc('admin_reply_support_ticket', {
      p_ticket_id: ticketId,
      p_status: status,
      p_admin_response: response,
    })

    if (replyError) {
      setError(replyError.message)
      return
    }

    setTicketReplies((current) => ({
      ...current,
      [ticketId]: '',
    }))

    await loadSupportTickets(supportStatusFilter)
    showMessage('Supportticket bijgewerkt.')
  }

  if (loading) {
    return (
      <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Admin paneel laden...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h1 className="text-xl font-extrabold text-rose-800">Geen toegang</h1>
        <p className="mt-2 text-sm text-rose-700">Dit paneel is alleen beschikbaar voor admins.</p>
      </main>
    )
  }

  return (
    <main className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Admin</p>
        <h1 className="mt-2 text-2xl font-extrabold">Platformbeheer</h1>
        <p className="mt-2 text-sm text-slate-600">
          Snel overzicht van platformstatus, gebruikersplannen, referral-instellingen en admin-toegang.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-bold">Recente gebruikers</h2>
        <p className="mt-1 text-xs text-slate-500">Laatste 20 gebruikers met snel planbeheer.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b border-slate-200 text-left text-slate-500">
              <tr>
                <th className="py-2 font-semibold">E-mail</th>
                <th className="py-2 font-semibold">Aangemaakt</th>
                <th className="py-2 font-semibold">Facturen</th>
                <th className="py-2 font-semibold">Plan</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.user_id} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{user.email}</td>
                  <td className="py-2 pr-3">{new Date(user.created_at).toLocaleString('nl-NL')}</td>
                  <td className="py-2 pr-3">{user.invoices}</td>
                  <td className="py-2">
                    <select
                      value={user.plan}
                      onChange={(event) => {
                        void updateUserPlan(user.user_id, event.target.value as 'free' | 'pro')
                      }}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-bold">Referral beloning</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Threshold</span>
            <input
              type="number"
              min={1}
              value={rewardSettings.threshold}
              onChange={(event) =>
                setRewardSettings((current) => ({
                  ...current,
                  threshold: Number(event.target.value) || 1,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Type</span>
            <select
              value={rewardSettings.reward_type}
              onChange={(event) =>
                setRewardSettings((current) => ({
                  ...current,
                  reward_type: event.target.value as RewardSettings['reward_type'],
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="pro_month">Pro maand</option>
              <option value="discount_percent">Korting (%)</option>
              <option value="credit_eur">Krediet (EUR)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Waarde</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={rewardSettings.reward_value}
              onChange={(event) =>
                setRewardSettings((current) => ({
                  ...current,
                  reward_value: Number(event.target.value) || 0,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => {
            void saveRewardSettings()
          }}
          className="mt-3 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
        >
          Referral instellingen opslaan
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-bold">Admin toegang</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={newAdminEmail}
            onChange={(event) => setNewAdminEmail(event.target.value)}
            placeholder="nieuw-admin@domein.nl"
            className="min-w-[240px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              void addAdmin()
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voeg admin toe
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {admins.map((admin) => (
            <li key={admin.email} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <span className="text-sm text-slate-700">{admin.email}</span>
              <button
                type="button"
                onClick={() => {
                  void removeAdmin(admin.email)
                }}
                className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Verwijder
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Support tickets</h2>
            <p className="mt-1 text-xs text-slate-500">Beantwoord tickets en update status direct vanuit admin.</p>
          </div>
          <select
            value={supportStatusFilter}
            onChange={(event) =>
              setSupportStatusFilter(event.target.value as 'all' | 'open' | 'in_progress' | 'resolved')
            }
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="all">Alle statussen</option>
            <option value="open">Open</option>
            <option value="in_progress">In behandeling</option>
            <option value="resolved">Opgelost</option>
          </select>
        </div>

        {supportTickets.length === 0 ? (
          <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Geen support tickets voor deze filter.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {supportTickets.map((ticket) => (
              <article key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{ticket.subject}</p>
                    <p className="text-xs text-slate-600">{ticket.user_email}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(ticket.created_at).toLocaleString('nl-NL')}
                      {ticket.page_context ? ` · ${ticket.page_context}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                    {ticket.status}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{ticket.message}</p>

                {ticket.admin_response ? (
                  <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Laatste reactie</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-emerald-900">{ticket.admin_response}</p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {ticket.responded_by_email ?? 'Admin'} ·{' '}
                      {ticket.responded_at ? new Date(ticket.responded_at).toLocaleString('nl-NL') : '-'}
                    </p>
                  </div>
                ) : null}

                <label className="mt-3 block">
                  <span className="text-xs font-medium text-slate-600">Antwoord</span>
                  <textarea
                    rows={3}
                    value={ticketReplies[ticket.id] ?? ''}
                    onChange={(event) =>
                      setTicketReplies((current) => ({
                        ...current,
                        [ticket.id]: event.target.value,
                      }))
                    }
                    placeholder="Typ je reactie aan de klant"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void updateSupportTicket(ticket.id, 'in_progress')
                    }}
                    className="rounded-lg border border-cyan-300 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                  >
                    In behandeling
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void updateSupportTicket(ticket.id, 'resolved')
                    }}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Markeer opgelost
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void updateSupportTicket(ticket.id, 'open')
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Terug naar open
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
