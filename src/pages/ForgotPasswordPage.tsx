import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    setSuccessMessage(null)

    const ok = await requestPasswordReset(email)
    if (!ok) return

    setSuccessMessage('Als dit e-mailadres bestaat, is er een reset-link verstuurd.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">FactuurStudio</p>
        <h1 className="mt-2 text-3xl font-extrabold">Wachtwoord vergeten</h1>
        <p className="mt-2 text-sm text-slate-600">Voer je e-mailadres in. Je ontvangt een link om je wachtwoord opnieuw in te stellen.</p>

        <label className="mt-6 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">E-mailadres</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-cyan-600 focus:ring-2"
          />
        </label>

        {successMessage ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {isLoading ? 'Bezig...' : 'Reset-link versturen'}
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
