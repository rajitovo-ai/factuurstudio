import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { CustomerProfile } from '../stores/customerStore'
import { useCustomerStore } from '../stores/customerStore'

const EMPTY_CUSTOMERS: CustomerProfile[] = []

export default function CustomersPage() {
  const userId = useAuthStore((state) => state.userId)
  const customersByUser = useCustomerStore((state) => state.customersByUser)
  const isLoading = useCustomerStore((state) => state.isLoading)
  const error = useCustomerStore((state) => state.error)
  const loadCustomers = useCustomerStore((state) => state.loadCustomers)
  const removeCustomer = useCustomerStore((state) => state.removeCustomer)
  const customers = useMemo(
    () => (userId ? (customersByUser[userId] ?? EMPTY_CUSTOMERS) : EMPTY_CUSTOMERS),
    [customersByUser, userId],
  )
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      void loadCustomers(userId)
    }
  }, [loadCustomers, userId])

  const onDelete = async (customerId: string) => {
    if (!userId) return

    const ok = await removeCustomer(customerId, userId)
    if (!ok) return

    setMessage('Klantprofiel verwijderd.')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Klantbeheer</p>
            <h1 className="mt-2 text-2xl font-extrabold">Klantenprofielen</h1>
            <p className="mt-2 text-sm text-slate-600">
              Beheer opgeslagen klanten en gebruik ze direct bij het maken van facturen.
            </p>
          </div>
          <Link
            to="/facturen/nieuw"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Nieuwe factuur
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {customers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Nog geen klantenprofielen. Maak een factuur aan en sla de klant op als profiel.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {customers.map((customer) => (
              <article key={customer.id} className="rounded-xl border border-slate-200 p-4">
                <h2 className="text-base font-bold text-slate-900">{customer.companyName || customer.name}</h2>
                <p className="mt-1 text-sm text-slate-600">Contact: {customer.name || '-'}</p>
                <p className="text-sm text-slate-600">E-mail: {customer.email || '-'}</p>
                <p className="text-sm text-slate-600">Telefoon: {customer.phone || '-'}</p>
                <p className="text-sm text-slate-600">Adres: {customer.address || '-'}</p>
                <p className="text-sm text-slate-600">
                  Plaats: {customer.postalCode || '-'} {customer.city || '-'} ({customer.country || 'NL'})
                </p>
                <p className="text-sm text-slate-600">IBAN: {customer.iban || '-'}</p>
                <p className="text-sm text-slate-600">Betaaltermijn: {customer.paymentTermDays} dagen</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      void onDelete(customer.id)
                    }}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Verwijder
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {isLoading ? <p className="mt-4 text-sm text-slate-500">Klanten laden...</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      </section>
    </main>
  )
}
