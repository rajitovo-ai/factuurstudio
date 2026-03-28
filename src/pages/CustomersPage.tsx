import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import type { CustomerProfile } from '../stores/customerStore'
import { useCustomerStore } from '../stores/customerStore'

const EMPTY_CUSTOMERS: CustomerProfile[] = []

export default function CustomersPage() {
  const { t } = useTranslation(['customers', 'common'])
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

    setMessage(t('customers:messages.deleted'))
    setTimeout(() => setMessage(null), 2500)
  }

  const onCreate = async () => {
    setCreateError(null)
    setMessage(null)

    if (!userId) {
      setCreateError(t('customers:messages.noActiveUser'))
      return
    }

    if (!contactName.trim() && !companyName.trim()) {
      setCreateError(t('customers:messages.fillRequired'))
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
      setCreateError(t('customers:messages.saveFailed'))
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
    setMessage(t('customers:messages.saved'))
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{t('customers:management')}</p>
            <h1 className="mt-2 text-2xl font-extrabold">{t('customers:customerProfiles')}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {t('customers:description')}
            </p>
          </div>
          <Link
            to="/facturen/nieuw"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            {t('customers:newInvoice')}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900">{t('customers:newCustomer')}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {t('customers:addDirectly')}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.contactName')}</span>
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.contactPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.companyName')}</span>
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.companyPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.emailPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.phone')}</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.phonePlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.address')}</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.addressPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.postalCode')}</span>
            <input
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.postalCodePlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.city')}</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.cityPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.country')}</span>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value.toUpperCase())}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
              placeholder={t('customers:form.countryPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.paymentTerm')}</span>
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
            <span className="text-sm font-medium text-slate-700">{t('customers:form.paymentTermNotApplicable')}</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.kvk')}</span>
            <input
              value={kvkNumber}
              onChange={(event) => setKvkNumber(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.kvkPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.vatNumber')}</span>
            <input
              value={btwNumber}
              onChange={(event) => setBtwNumber(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.vatPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.iban')}</span>
            <input
              value={iban}
              onChange={(event) => setIban(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.ibanPlaceholder')}
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">{t('customers:form.notes')}</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder={t('customers:form.notesPlaceholder')}
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
            {t('customers:form.saveProfile')}
          </button>
          {createError ? <p className="text-sm text-rose-700">{createError}</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900">{t('customers:existingCustomers')}</h2>
        <p className="mt-1 text-sm text-slate-600">{t('customers:overview')}</p>

        {customers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {t('customers:messages.empty')}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {customers.map((customer) => (
              <article key={customer.id} className="rounded-xl border border-slate-200 p-4">
                <h2 className="text-base font-bold text-slate-900">{customer.companyName || customer.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{t('customers:customerCard.contact')}: {customer.name || '-'}</p>
                <p className="text-sm text-slate-600">{t('customers:customerCard.email')}: {customer.email || '-'}</p>
                <p className="text-sm text-slate-600">{t('customers:customerCard.phone')}: {customer.phone || '-'}</p>
                <p className="text-sm text-slate-600">{t('customers:customerCard.address')}: {customer.address || '-'}</p>
                <p className="text-sm text-slate-600">
                  {t('customers:customerCard.city')}: {customer.postalCode || '-'} {customer.city || '-'} ({customer.country || 'NL'})
                </p>
                <p className="text-sm text-slate-600">{t('customers:customerCard.iban')}: {customer.iban || '-'}</p>
                <p className="text-sm text-slate-600">
                  {t('customers:customerCard.paymentTerm')}: {customer.paymentTermDays > 0 ? `${customer.paymentTermDays} ${t('customers:customerCard.days')}` : t('customers:customerCard.notApplicable')}
                </p>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Link
                    to={`/facturen/nieuw?customerId=${encodeURIComponent(customer.id)}`}
                    className="rounded-lg border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                  >
                    {t('customers:customerCard.useInInvoice')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void onDelete(customer.id)
                    }}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    {t('customers:customerCard.delete')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {isLoading ? <p className="mt-4 text-sm text-slate-500">{t('customers:loading')}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      </section>
    </main>
  )
}
