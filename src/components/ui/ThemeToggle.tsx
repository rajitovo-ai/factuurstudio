import { useThemeStore } from '../../stores/themeStore'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    // Apply theme immediately
    const root = document.documentElement
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } else {
      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange('light')}
        className={`rounded-lg p-2 transition-all duration-200 transform hover:scale-105 ${
          theme === 'light' 
            ? 'bg-blue-500 text-white shadow-lg' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title="Licht thema"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
      
      <button
        onClick={() => handleThemeChange('dark')}
        className={`rounded-lg p-2 transition-all duration-200 transform hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800 text-white shadow-lg' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title="Donker thema"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
      
      <button
        onClick={() => handleThemeChange('system')}
        className={`rounded-lg p-2 transition-all duration-200 transform hover:scale-105 ${
          theme === 'system' 
            ? 'bg-green-500 text-white shadow-lg' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title="Systeem thema"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  )
}
