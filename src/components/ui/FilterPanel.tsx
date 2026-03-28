import { useState, useEffect } from 'react'

interface FilterOption {
  label: string
  value: string
}

interface FilterPanelProps {
  filters: {
    status: string[]
    dateRange: { start: string; end: string } | null
    minAmount: string
    maxAmount: string
  }
  onChange: (filters: {
    status: string[]
    dateRange: { start: string; end: string } | null
    minAmount: string
    maxAmount: string
  }) => void
  onClear: () => void
  resultCount: number
  className?: string
}

const STATUS_OPTIONS: FilterOption[] = [
  { label: 'Concept', value: 'concept' },
  { label: 'Verzonden', value: 'verzonden' },
  { label: 'Betaald', value: 'betaald' },
  { label: 'Vervallen', value: 'vervallen' },
]

export default function FilterPanel({ filters, onChange, onClear, resultCount, className = '' }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  useEffect(() => {
    const hasFilters = 
      filters.status.length > 0 ||
      filters.dateRange !== null ||
      filters.minAmount !== '' ||
      filters.maxAmount !== ''
    setHasActiveFilters(hasFilters)
  }, [filters])

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onChange({ ...filters, status: newStatus })
  }

  const setDateRange = (start: string, end: string) => {
    onChange({
      ...filters,
      dateRange: start || end ? { start: start || end, end: end || start } : null
    })
  }

  return (
    <div className={`${className}`}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition flex items-center gap-2 ${
          hasActiveFilters
            ? 'border-cyan-300 bg-cyan-50 text-cyan-700'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="ml-1 rounded-full bg-cyan-200 px-2 py-0.5 text-xs text-cyan-800">
            {filters.status.length + (filters.dateRange ? 1 : 0) + (filters.minAmount || filters.maxAmount ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Filter facturen</h3>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-xs font-medium text-cyan-600 hover:text-cyan-800"
              >
                Wis alle filters
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    filters.status.includes(option.value)
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Datumbereik</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => setDateRange(e.target.value, filters.dateRange?.end || '')}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Van"
              />
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => setDateRange(filters.dateRange?.start || '', e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Tot"
              />
            </div>
          </div>

          {/* Amount Filter */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">Bedrag (€)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => onChange({ ...filters, minAmount: e.target.value })}
                placeholder="Min"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
              <span className="flex items-center text-slate-400">-</span>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => onChange({ ...filters, maxAmount: e.target.value })}
                placeholder="Max"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Result count */}
          <div className="border-t border-slate-200 pt-3">
            <p className="text-center text-sm text-slate-600">
              <span className="font-semibold text-cyan-700">{resultCount}</span> facturen gevonden
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Toepassen
          </button>
        </div>
      )}
    </div>
  )
}
