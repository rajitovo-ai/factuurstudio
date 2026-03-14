import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import InvoiceGenerator from '../components/invoice/InvoiceGenerator'
import { useAuthStore } from '../stores/authStore'

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

      {/* Full generator in guest mode */}
      <InvoiceGenerator guestMode />
    </div>
  )
}
