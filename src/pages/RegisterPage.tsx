import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useReferralStore } from '../stores/referralStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref')
  const { signUp, isLoading, isAuthenticated, isDemoMode, error, clearError } = useAuthStore()
  const setPendingReferralCode = useReferralStore((state) => state.setPendingReferralCode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError('Wachtwoord moet minimaal 8 tekens bevatten.')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Wachtwoorden komen niet overeen.')
      return
    }

    if (refCode) {
      setPendingReferralCode(refCode)
    }

    const result = await signUp(email, password)
    if (result.ok && result.requiresEmailConfirmation) {
      setSuccessMessage('Je account is aangemaakt. Controleer je e-mail en bevestig je account om in te loggen.')
      setPassword('')
      setConfirmPassword('')
      return
    }

    if (result.ok) {
      navigate('/dashboard')
      return
    }

    if (refCode) {
      setPendingReferralCode(null)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">FactuurStudio</p>
        <h1 className="mt-2 text-3xl font-extrabold">Registreren</h1>
        <p className="mt-2 text-sm text-slate-600">
          Maak een account voor je factuurdashboard.
          {refCode ? (
            <span className="ml-1 font-semibold text-cyan-700">Je wordt uitgenodigd via een referral-link.</span>
          ) : null}
        </p>

        {isDemoMode ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Je draait nu lokaal zonder Supabase. Dit account wordt alleen in je browser opgeslagen voor testdoeleinden.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">E-mailadres</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Wachtwoord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Herhaal wachtwoord</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
            />
          </label>
        </div>

        {localError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{localError}</p> : null}
        {successMessage ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {isLoading ? 'Bezig...' : 'Account maken'}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Al een account?{' '}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Inloggen
          </Link>
        </p>
      </form>
    </main>
  )
}
