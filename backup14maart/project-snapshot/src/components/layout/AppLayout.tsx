import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-cyan-700 text-white'
      : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-800'
  }`

export default function AppLayout() {
  const navigate = useNavigate()
  const { email, isDemoMode, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Link to="/dashboard" className="block text-xl font-extrabold text-cyan-800">
            SmartInvoice
          </Link>
          <p className="mt-1 text-xs text-slate-500">Fase 2 - Auth + Dashboard</p>

          <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/facturen" className={navLinkClass}>
              Facturen
            </NavLink>
            <NavLink to="/facturen/nieuw" className={navLinkClass}>
              Nieuwe factuur
            </NavLink>
            <NavLink to="/instellingen" className={navLinkClass}>
              Instellingen
            </NavLink>
          </nav>
        </aside>

        <div className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ingelogd als</p>
              <p className="text-sm font-semibold text-slate-800">{email ?? 'Onbekende gebruiker'}</p>
              <p className="mt-1 text-xs text-slate-500">
                {isDemoMode ? 'Lokale testmodus zonder Supabase' : 'Verbonden met Supabase'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Uitloggen
            </button>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
