import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import ThemeToggle from '../ui/ThemeToggle'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
    isActive
      ? 'bg-cyan-700 text-white shadow-lg'
      : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-md'
  }`

export default function AppLayout() {
  const navigate = useNavigate()
  const { t } = useTranslation(['navigation', 'common'])
  const { email, signOut } = useAuthStore()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!email) {
        setIsAdminUser(false)
        return
      }

      void supabase
        .rpc('is_admin')
        .then(({ data, error }) => {
          if (error) {
            setIsAdminUser(false)
            return
          }
          setIsAdminUser(Boolean(data))
        })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [email])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:bg-slate-800 dark:border-slate-700">
        <Link to="/dashboard" className="text-lg font-extrabold text-cyan-800">
          Factuur Studio
        </Link>
        <button
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Menu"
        >
          {mobileNavOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Dashboard</NavLink>
            <NavLink to="/klanten" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Klanten</NavLink>
            <NavLink to="/facturen" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Facturen</NavLink>
            <NavLink to="/facturen/nieuw" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Nieuwe factuur</NavLink>
            <NavLink to="/facturen/importeren" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Importeer facturen</NavLink>
            <NavLink to="/referral" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Vrienden uitnodigen</NavLink>
            <NavLink to="/instellingen" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Instellingen</NavLink>
            <NavLink to="/support" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Support</NavLink>
            {isAdminUser ? (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>Admin</NavLink>
            ) : null}
          </nav>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">{email}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Uitloggen
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Desktop sidebar */}
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block dark:bg-slate-800 dark:border-slate-700">
          <Link to="/dashboard" className="block text-xl font-extrabold text-cyan-800">
            Factuur Studio
          </Link>
          <nav className="mt-6 flex flex-col gap-2">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/klanten" className={navLinkClass}>Klanten</NavLink>
            <NavLink to="/facturen" className={navLinkClass}>Facturen</NavLink>
            <NavLink to="/facturen/nieuw" className={navLinkClass}>Nieuwe factuur</NavLink>
            <NavLink to="/facturen/importeren" className={navLinkClass}>Importeer facturen</NavLink>
            <NavLink to="/referral" className={navLinkClass}>Vrienden uitnodigen</NavLink>
            <NavLink to="/instellingen" className={navLinkClass}>Instellingen</NavLink>
            <NavLink to="/support" className={navLinkClass}>Support</NavLink>
            {isAdminUser ? <NavLink to="/admin" className={navLinkClass}>Admin</NavLink> : null}
          </nav>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3 dark:text-slate-400">Thema</p>
            <ThemeToggle />
          </div>
        </aside>

        <div className="space-y-4">
          <header className="hidden flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm lg:flex dark:bg-slate-800 dark:border-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t('common:loggedInAs')}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{email ?? t('common:unknownUser')}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition-all duration-200 transform hover:scale-105 hover:bg-rose-50 hover:shadow-lg"
              >
                {t('common:logout')}
              </button>
            </div>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
