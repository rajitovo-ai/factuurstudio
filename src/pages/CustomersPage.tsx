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
  const createCustomer = useCustomerStore((state) => state.createCustomer)
  const removeCustomer = useCustomerStore((state) => state.removeCustomer)
  const customers = useMemo(
    () => (userId ? (customersByUser[userId] ?? EMPTY_CUSTOMERS) : EMPTY_CUSTOMERS),
    [customersByUser, userId],
  )
  const [message, setMessage] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [contactName, setContactName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('NL')
  const [kvkNumber, setKvkNumber] = useState('')
  const [btwNumber, setBtwNumber] = useState('')
  const [iban, setIban] = useState('')
  const [paymentTermDays, setPaymentTermDays] = useState(14)
  const [paymentTermNotApplicable, setPaymentTermNotApplicable] = useState(false)
  const [notes, setNotes] = useState('')

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

  const onCreate = async () => {
    setCreateError(null)
    setMessage(null)

    if (!userId) {
      setCreateError('Geen actieve gebruiker gevonden. Log opnieuw in.')
      return
    }

    if (!contactName.trim() && !companyName.trim()) {
      setCreateError('Vul minimaal een contactnaam of bedrijfsnaam in.')
      return
    }

    const created = await createCustomer(userId, {
      name: contactName,
      companyName,
      email,
      phone,
      address,
      postalCode,
      city,
      country,
      kvkNumber,
      btwNumber,
      iban,
      paymentTermDays: paymentTermNotApplicable ? 0 : paymentTermDays,
      notes,
    })

    if (!created) {
      setCreateError('Klantprofiel opslaan is mislukt. Probeer opnieuw.')
      return
    }

    setContactName('')
    setCompanyName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setPostalCode('')
    setCity('')
    setCountry('NL')
    setKvkNumber('')
    setBtwNumber('')
    setIban('')
    setPaymentTermDays(14)
    setPaymentTermNotApplicable(false)
    setNotes('')
    setMessage('Nieuw klantprofiel opgeslagen.')
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
        <h2 className="text-lg font-extrabold text-slate-900">Nieuw klantenprofiel</h2>
        <p className="mt-1 text-sm text-slate-600">
          Voeg hier direct een klant toe, zonder eerst via een factuur te werken.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Contactpersoon</span>
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Bijv. Lisa Jansen"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Bedrijfsnaam</span>
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Bijv. Studio Noord"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="contact@bedrijf.nl"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Telefoon</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="+31 6 12345678"
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Adres</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Straatnaam 12"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Postcode</span>
            <input
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="1234 AB"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Plaats</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Amsterdam"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Land</span>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value.toUpperCase())}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
              placeholder="NL"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Betaaltermijn (dagen)</span>
            <input
              type="number"
              min={0}
              value={paymentTermNotApplicable ? 0 : paymentTermDays}
              disabled={paymentTermNotApplicable}
              onChange={(event) => {
                const value = Number(event.target.value)
                setPaymentTermDays(Number.isNaN(value) ? 0 : value)
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
            <input
              type="checkbox"
              checked={paymentTermNotApplicable}
              onChange={(event) => setPaymentTermNotApplicable(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
            />
            <span className="text-sm font-medium text-slate-700">Betaaltermijn niet van toepassing</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">KvK</span>
            <input
              value={kvkNumber}
              onChange={(event) => setKvkNumber(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="12345678"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">BTW-nummer</span>
            <input
              value={btwNumber}
              onChange={(event) => setBtwNumber(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="NL123456789B01"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">IBAN</span>
            <input
              value={iban}
              onChange={(event) => setIban(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="NL00BANK0123456789"
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notities</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Interne notitie of extra afspraken"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void onCreate()
            }}
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Klantprofiel opslaan
          </button>
          {createError ? <p className="text-sm text-rose-700">{createError}</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900">Bestaande klantenprofielen</h2>
        <p className="mt-1 text-sm text-slate-600">Overzicht van opgeslagen klanten.</p>

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
                <p className="text-sm text-slate-600">
                  Betaaltermijn: {customer.paymentTermDays > 0 ? `${customer.paymentTermDays} dagen` : 'n.v.t.'}
                </p>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Link
                    to={`/facturen/nieuw?customerId=${encodeURIComponent(customer.id)}`}
                    className="rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                  >
                    Gebruik in nieuwe factuur
                  </Link>
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
