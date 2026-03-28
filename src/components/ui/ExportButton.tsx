import { useState } from 'react'
import { exportInvoicesToCSV, exportInvoicesToJSON, downloadFile, generateExportFilename, type ExportOptions } from '../../lib/exportUtils'
import type { StoredInvoice } from '../../stores/invoiceStore'

interface ExportButtonProps {
  invoices: StoredInvoice[]
  selectedIds?: string[]
  className?: string
}

export default function ExportButton({ invoices, selectedIds = [], className = '' }: ExportButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [exportMode, setExportMode] = useState<'all' | 'selected'>('all')
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  // Filter invoices based on export mode
  const invoicesToExport = exportMode === 'selected' && selectedIds.length > 0
    ? invoices.filter(inv => selectedIds.includes(inv.id))
    : invoices

  const hasSelection = selectedIds.length > 0

  const handleExport = () => {
    const options: ExportOptions = {
      format,
      ...(dateRange && { dateRange }),
      ...(statusFilter.length > 0 && { statusFilter })
    }

    if (format === 'csv') {
      const csvContent = exportInvoicesToCSV(invoicesToExport, options)
      downloadFile(csvContent, generateExportFilename('csv'), 'text/csv;charset=utf-8;')
    } else {
      const jsonContent = exportInvoicesToJSON(invoicesToExport, options)
      downloadFile(jsonContent, generateExportFilename('json'), 'application/json')
    }

    setShowOptions(false)
  }

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center gap-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exporteren
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Exporteer facturen</h3>

          {/* Export Mode Selection - only show if there are selected invoices */}
          {hasSelection && (
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-slate-600">Te exporteren facturen</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setExportMode('all')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    exportMode === 'all'
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Alle ({invoices.length})
                </button>
                <button
                  onClick={() => setExportMode('selected')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    exportMode === 'selected'
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Geselecteerd ({selectedIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Format selection */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Formaat</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat('csv')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  format === 'csv'
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                CSV
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  format === 'json'
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          {/* Date range */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Datumbereik (optioneel)</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange?.start || ''}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    start: e.target.value,
                    end: prev?.end || e.target.value
                  }))
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Startdatum"
              />
              <input
                type="date"
                value={dateRange?.end || ''}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    start: prev?.start || e.target.value,
                    end: e.target.value
                  }))
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Einddatum"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Status filter (optioneel)</label>
            <div className="flex flex-wrap gap-2">
              {['concept', 'verzonden', 'betaald', 'vervallen'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    statusFilter.includes(status)
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Export button */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowOptions(false)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Annuleren
            </button>
            <button
              onClick={handleExport}
              disabled={invoicesToExport.length === 0}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                invoicesToExport.length === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-cyan-700 hover:bg-cyan-800'
              }`}
            >
              {invoicesToExport.length === 0 
                ? 'Geen facturen' 
                : `Exporteer ${invoicesToExport.length} facturen`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
