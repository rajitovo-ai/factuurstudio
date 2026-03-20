import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ResetPasswordPage() {
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
      setLocalError('Wachtwoord moet minimaal 8 tekens bevatten.')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Wachtwoorden komen niet overeen.')
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
        <h1 className="mt-2 text-3xl font-extrabold">Nieuw wachtwoord</h1>
        <p className="mt-2 text-sm text-slate-600">Stel hieronder een nieuw wachtwoord in voor je account.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nieuw wachtwoord</span>
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
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {isLoading ? 'Bezig...' : 'Wachtwoord wijzigen'}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Terug naar{' '}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Inloggen
          </Link>
        </p>
      </form>
    </main>
  )
}
