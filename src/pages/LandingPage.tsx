import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import InvoiceGenerator from '../components/invoice/InvoiceGenerator'
import { useAuthStore } from '../stores/authStore'

const isDev = import.meta.env.DEV

export default function LandingPage() {
  const userId = useAuthStore((state) => state.userId)

  if (userId) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-white text-slate-900">
      {/* Minimal nav */}
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur sm:px-10">
        <span className="text-lg font-extrabold tracking-tight text-cyan-700">FactuurStudio</span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Inloggen
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Gratis account
          </Link>
        </div>
      </nav>

      {isDev ? (
        <section className="mx-auto mt-4 w-full max-w-6xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:px-6">
          <p className="font-semibold">Referral testen (dev)</p>
          <p className="mt-1 text-xs text-amber-700">
            1) Log in met account A 2) open referralpagina en kopieer/open je link 3) registreer account B via die link.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/referral"
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Naar referralpagina
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Inloggen
            </Link>
          </div>
        </section>
      ) : null}

      {/* Full generator in guest mode */}
      <InvoiceGenerator guestMode />
    </div>
  )
}
