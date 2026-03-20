import { useEffect, useMemo, useState } from 'react'
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

  const showMessage = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage(null), 2500)
  }

  const loadAdminData = async () => {
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
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAdminData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

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
    </main>
  )
}
