import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { extractInvoiceDataFromPdf } from '../lib/invoiceImport'
import { useAuthStore } from '../stores/authStore'
import { useCustomerStore } from '../stores/customerStore'
import type { InvoiceStatus } from '../stores/invoiceStore'
import { useInvoiceStore } from '../stores/invoiceStore'
import { defaultCompanyProfile, useProfileStore } from '../stores/profileStore'

type ImportRow = {
  id: string
  fileName: string
  parseWarnings: string[]
  parseError: string | null
  importCustomer: boolean
  importInvoice: boolean
  status: InvoiceStatus
  invoiceNumber: string
  companyName: string
  clientName: string
  clientEmail: string
  clientAddress: string
  clientKvkNumber: string
  clientBtwNumber: string
  clientIban: string
  issueDate: string
  dueDate: string
  hasDueDate: boolean
  currencyCode: string
  subtotal: number
  vatTotal: number
  total: number
  invoiceDescription: string
  usedOcr: boolean
}

const toTodayIso = () => new Date().toISOString().slice(0, 10)

const buildFallbackInvoiceNumber = (existingNumbers: Set<string>, preferred: string, index: number) => {
  const base = preferred.trim() || `IMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${index + 1}`
  if (!existingNumbers.has(base)) {
    existingNumbers.add(base)
    return base
  }

  let counter = 2
  let candidate = `${base}-${counter}`
  while (existingNumbers.has(candidate)) {
    counter += 1
    candidate = `${base}-${counter}`
  }

  existingNumbers.add(candidate)
  return candidate
}

export default function InvoiceImportPage() {
  const userId = useAuthStore((state) => state.userId)
  const invoices = useInvoiceStore((state) => state.invoices)
  const createInvoice = useInvoiceStore((state) => state.createInvoice)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const createCustomer = useCustomerStore((state) => state.createCustomer)
  const profiles = useProfileStore((state) => state.profiles)

  const profile = useMemo(() => {
    if (!userId) return defaultCompanyProfile
    return profiles[userId] ?? defaultCompanyProfile
  }, [profiles, userId])

  const [rows, setRows] = useState<ImportRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [useOcrFallback, setUseOcrFallback] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsParsing(true)
    setError(null)
    setSummary(null)

    const fileArray = Array.from(files)
    const parsedRows: ImportRow[] = []

    for (let index = 0; index < fileArray.length; index += 1) {
      const file = fileArray[index]

      try {
        const parsed = await extractInvoiceDataFromPdf(file, { useOcrFallback, maxOcrPages: 2 })

        parsedRows.push({
          id: `${file.name}-${Date.now()}-${index}`,
          fileName: file.name,
          parseWarnings: parsed.warnings,
          parseError: null,
          importCustomer: true,
          importInvoice: true,
          status: 'verzonden' as InvoiceStatus,
          invoiceNumber: parsed.invoiceNumber,
          companyName: parsed.companyName,
          clientName: parsed.clientName,
          clientEmail: parsed.clientEmail,
          clientAddress: parsed.clientAddress,
          clientKvkNumber: parsed.clientKvkNumber,
          clientBtwNumber: parsed.clientBtwNumber,
          clientIban: parsed.clientIban,
          issueDate: parsed.issueDate || toTodayIso(),
          dueDate: parsed.dueDate || toTodayIso(),
          hasDueDate: parsed.hasDueDate,
          currencyCode: parsed.currencyCode,
          subtotal: parsed.subtotal,
          vatTotal: parsed.vatTotal,
          total: parsed.total,
          invoiceDescription: parsed.invoiceDescription,
          usedOcr: parsed.usedOcr,
        })
      } catch (parseError) {
        parsedRows.push({
          id: `${file.name}-${Date.now()}-${index}`,
          fileName: file.name,
          parseWarnings: [],
          parseError: parseError instanceof Error ? parseError.message : 'Onbekende fout bij uitlezen PDF.',
          importCustomer: false,
          importInvoice: false,
          status: 'concept' as InvoiceStatus,
          invoiceNumber: '',
          companyName: '',
          clientName: '',
          clientEmail: '',
          clientAddress: '',
          clientKvkNumber: '',
          clientBtwNumber: '',
          clientIban: '',
          issueDate: toTodayIso(),
          dueDate: toTodayIso(),
          hasDueDate: false,
          currencyCode: 'EUR',
          subtotal: 0,
          vatTotal: 0,
          total: 0,
          invoiceDescription: `Import mislukt voor ${file.name}`,
          usedOcr: false,
        })
      }
    }

    setRows((current) => [...parsedRows, ...current])
    setIsParsing(false)
  }

  const updateRow = <K extends keyof ImportRow>(id: string, key: K, value: ImportRow[K]) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)))
  }

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id))
  }

  const runImport = async () => {
    setError(null)
    setSummary(null)

    if (!userId) {
      setError('Geen actieve gebruiker gevonden. Log opnieuw in.')
      return
    }

    const activeRows = rows.filter((row) => row.importCustomer || row.importInvoice)
    if (activeRows.length === 0) {
      setError('Selecteer minimaal 1 regel om te importeren.')
      return
    }

    setIsImporting(true)

    const existingNumbers = new Set(
      invoices.filter((invoice) => invoice.userId === userId).map((invoice) => invoice.invoiceNumber),
    )

    let customerCount = 0
    let invoiceCount = 0
    let failureCount = 0

    for (let index = 0; index < activeRows.length; index += 1) {
      const row = activeRows[index]

      if (row.importCustomer) {
        const createdCustomer = await createCustomer(userId, {
          name: row.clientName,
          companyName: row.clientName,
          email: row.clientEmail,
          phone: '',
          address: row.clientAddress,
          postalCode: '',
          city: '',
          country: 'NL',
          kvkNumber: row.clientKvkNumber,
          btwNumber: row.clientBtwNumber,
          iban: row.clientIban,
          paymentTermDays: row.hasDueDate ? 14 : 0,
          notes: 'Geimporteerd uit bestaande PDF-factuur.',
        })

        if (createdCustomer) {
          customerCount += 1
        } else {
          failureCount += 1
        }
      }

      if (row.importInvoice) {
        const invoiceNumber = buildFallbackInvoiceNumber(existingNumbers, row.invoiceNumber, index)
        const hasDueDate = row.hasDueDate && Boolean(row.dueDate)
        const issueDate = row.issueDate || toTodayIso()
        const dueDate = hasDueDate ? row.dueDate : issueDate
        const total = Number.isFinite(row.total) ? row.total : 0
        const subtotal = Number.isFinite(row.subtotal) ? row.subtotal : total
        const vatTotal = Number.isFinite(row.vatTotal) ? row.vatTotal : 0

        const ok = await createInvoice({
          userId,
          invoiceNumber,
          companyName: row.companyName || profile.companyName || 'Geimporteerde factuur',
          logoDataUrl: null,
          clientName: row.clientName || 'Onbekende klant',
          clientEmail: row.clientEmail,
          clientContactName: row.clientName,
          clientPhone: '',
          clientAddress: row.clientAddress,
          clientPostalCode: '',
          clientCity: '',
          clientCountry: 'NL',
          clientKvkNumber: row.clientKvkNumber,
          clientBtwNumber: row.clientBtwNumber,
          clientIban: row.clientIban,
          clientPaymentTermDays: hasDueDate ? 14 : 0,
          clientNotes: 'Geimporteerd uit bestaande PDF-factuur.',
          invoiceDescription: row.invoiceDescription,
          hasDueDate,
          issueDate,
          dueDate,
          currencyCode: row.currencyCode || 'EUR',
          pricingMode: 'excl',
          subtotal,
          vatTotal,
          total,
          status: row.status,
          lines: [
            {
              id: 1,
              description: row.invoiceDescription || `Geimporteerde factuur (${row.fileName})`,
              quantity: 1,
              unitPrice: total,
              vatRate: 0,
            },
          ],
        })

        if (ok) {
          invoiceCount += 1
        } else {
          failureCount += 1
        }
      }
    }

    await loadInvoices(userId, true)
    setIsImporting(false)

    setSummary(
      `Import afgerond. Klanten: ${customerCount}, facturen: ${invoiceCount}, fouten: ${failureCount}.`,
    )
  }

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Importeren</p>
            <h1 className="mt-2 text-2xl font-extrabold">PDF facturen importeren</h1>
            <p className="mt-2 text-sm text-slate-600">
              Upload meerdere bestaande PDF-facturen tegelijk. Controleer de gevonden gegevens en kies per bestand wat je wilt importeren.
            </p>
          </div>
          <Link
            to="/facturen"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Naar facturen
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Upload 1 of meerdere PDF-bestanden</span>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(event) => {
                void onFilesSelected(event.target.files)
                event.target.value = ''
              }}
              className="text-sm"
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            Fase 2: OCR fallback is beschikbaar voor scan-PDF's. Dit duurt langer maar verhoogt herkenning.
          </p>
          <label className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
            <input
              type="checkbox"
              checked={useOcrFallback}
              onChange={(event) => setUseOcrFallback(event.target.checked)}
            />
            <span className="text-sm text-slate-700">OCR fallback voor scans inschakelen</span>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isParsing || isImporting || rows.length === 0}
            onClick={() => {
              void runImport()
            }}
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? 'Importeren...' : 'Importeer geselecteerde gegevens'}
          </button>
          {isParsing ? <p className="text-sm text-slate-600">PDF's analyseren...</p> : null}
        </div>

        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {summary ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{summary}</p> : null}
      </section>

      <section className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Nog geen PDF's ingeladen.
          </div>
        ) : null}

        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{row.fileName}</p>
                {row.usedOcr ? <p className="mt-1 text-xs text-cyan-700">OCR gebruikt voor deze PDF.</p> : null}
                {row.parseWarnings.length > 0 ? (
                  <p className="mt-1 text-xs text-amber-700">Waarschuwingen: {row.parseWarnings.join(' ')}</p>
                ) : null}
                {row.parseError ? <p className="mt-1 text-xs text-rose-700">{row.parseError}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Verwijder
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
                <input
                  type="checkbox"
                  checked={row.importCustomer}
                  onChange={(event) => updateRow(row.id, 'importCustomer', event.target.checked)}
                />
                <span className="text-sm text-slate-700">Importeer klantgegevens</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
                <input
                  type="checkbox"
                  checked={row.importInvoice}
                  onChange={(event) => updateRow(row.id, 'importInvoice', event.target.checked)}
                />
                <span className="text-sm text-slate-700">Importeer factuurdata</span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Status</span>
                <select
                  value={row.status}
                  onChange={(event) => updateRow(row.id, 'status', event.target.value as InvoiceStatus)}
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                >
                  <option value="concept">concept</option>
                  <option value="verzonden">verzonden</option>
                  <option value="betaald">betaald</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Factuurnummer</span>
                <input
                  value={row.invoiceNumber}
                  onChange={(event) => updateRow(row.id, 'invoiceNumber', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Bedrijfsnaam op factuur</span>
                <input
                  value={row.companyName}
                  onChange={(event) => updateRow(row.id, 'companyName', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Klantnaam</span>
                <input
                  value={row.clientName}
                  onChange={(event) => updateRow(row.id, 'clientName', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Klant e-mail</span>
                <input
                  value={row.clientEmail}
                  onChange={(event) => updateRow(row.id, 'clientEmail', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs font-medium text-slate-600">Klant adres</span>
                <input
                  value={row.clientAddress}
                  onChange={(event) => updateRow(row.id, 'clientAddress', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">KvK</span>
                <input
                  value={row.clientKvkNumber}
                  onChange={(event) => updateRow(row.id, 'clientKvkNumber', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">BTW-nummer</span>
                <input
                  value={row.clientBtwNumber}
                  onChange={(event) => updateRow(row.id, 'clientBtwNumber', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">IBAN</span>
                <input
                  value={row.clientIban}
                  onChange={(event) => updateRow(row.id, 'clientIban', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Valuta</span>
                <input
                  value={row.currencyCode}
                  onChange={(event) => updateRow(row.id, 'currencyCode', event.target.value.toUpperCase())}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Factuurdatum</span>
                <input
                  type="date"
                  value={row.issueDate}
                  onChange={(event) => updateRow(row.id, 'issueDate', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Vervaldatum</span>
                <input
                  type="date"
                  value={row.dueDate}
                  disabled={!row.hasDueDate}
                  onChange={(event) => updateRow(row.id, 'dueDate', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
                <input
                  type="checkbox"
                  checked={row.hasDueDate}
                  onChange={(event) => updateRow(row.id, 'hasDueDate', event.target.checked)}
                />
                <span className="text-sm text-slate-700">Vervaldatum gebruiken</span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Subtotaal</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.subtotal}
                  onChange={(event) => updateRow(row.id, 'subtotal', Number(event.target.value) || 0)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">BTW totaal</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.vatTotal}
                  onChange={(event) => updateRow(row.id, 'vatTotal', Number(event.target.value) || 0)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-600">Totaalbedrag</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.total}
                  onChange={(event) => updateRow(row.id, 'total', Number(event.target.value) || 0)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs font-medium text-slate-600">Beschrijving</span>
                <textarea
                  value={row.invoiceDescription}
                  onChange={(event) => updateRow(row.id, 'invoiceDescription', event.target.value)}
                  rows={2}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
