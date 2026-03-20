import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'

export default function AdminRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return
    }

    let cancelled = false

    void supabase.rpc('is_admin').then(({ data, error }) => {
      if (cancelled) return

      if (error) {
        setIsAdmin(false)
        return
      }

      setIsAdmin(Boolean(data))
    })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Sessie laden...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasSupabaseConfig) {
    return <Navigate to="/dashboard" replace />
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Adminrechten controleren...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}