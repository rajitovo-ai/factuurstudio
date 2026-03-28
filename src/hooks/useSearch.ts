import { useState, useCallback } from 'react'

export function useSearch() {
  const [query, setQuery] = useState('')

  const filteredItems = useCallback(<T,>(items: T[], searchFields: (keyof T)[]) => {
    if (!query.trim()) return items

    const lowercaseQuery = query.toLowerCase()
    
    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercaseQuery)
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowercaseQuery)
        }
        return false
      })
    })
  }, [query])

  const clearSearch = useCallback(() => {
    setQuery('')
  }, [])

  return {
    query,
    setQuery,
    filteredItems,
    clearSearch,
  }
}
