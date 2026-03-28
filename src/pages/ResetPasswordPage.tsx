import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { updatePassword, isLoading, error, clearError } = useAuthStore()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError(t('resetPassword.errorMinLength'))
      return
    }

    if (password !== confirmPassword) {
      setLocalError(t('resetPassword.errorMatch'))
      return
    }

    const ok = await updatePassword(password)
    if (!ok) return

    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Factuur Studio</p>
        <h1 className="mt-2 text-3xl font-extrabold">{t('resetPassword.title')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('resetPassword.subtitle')}</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{t('resetPassword.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('resetPassword.passwordPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{t('resetPassword.passwordConfirm')}</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t('resetPassword.passwordConfirmPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
        </div>

        {localError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{localError}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {isLoading ? t('common:loading') : t('resetPassword.submit')}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          {t('common:backTo')}{' '}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            {t('common:login')}
          </Link>
        </p>
      </form>
    </main>
  )
}
