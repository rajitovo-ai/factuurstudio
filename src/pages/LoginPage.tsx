import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common'])
  const { signIn, isLoading, isAuthenticated, isDemoMode, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    await signIn(email, password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('common:appName')}</p>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">{t('auth:login.title')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('auth:login.subtitle')}</p>

        {isDemoMode ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Lokale testmodus actief. Registreer eerst een demo-account; daarna kun je volledig lokaal inloggen.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{t('auth:login.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('auth:login.emailPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{t('auth:login.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('auth:login.passwordPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
        </div>

        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {isLoading ? t('common:loadingDots') : t('auth:login.submit')}
        </button>

        <p className="mt-3 text-right text-sm">
          <Link to="/wachtwoord-vergeten" className="font-semibold text-cyan-700 hover:text-cyan-800">
            {t('auth:login.forgotPassword')}
          </Link>
        </p>

        <p className="mt-4 text-sm text-slate-600">
          {t('auth:login.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
            {t('auth:login.register')}
          </Link>
        </p>
      </form>
    </main>
  )
}
