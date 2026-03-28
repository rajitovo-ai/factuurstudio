import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  getEffectiveTheme: () => {
    const { theme } = get()
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  },
}))

// Apply theme to document
export const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Initialize theme on app start
export const initializeTheme = () => {
  const store = useThemeStore.getState()
  const effectiveTheme = store.getEffectiveTheme()
  applyTheme(effectiveTheme)

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (store.theme === 'system') {
      const newTheme = mediaQuery.matches ? 'dark' : 'light'
      applyTheme(newTheme)
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}
