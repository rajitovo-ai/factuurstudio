import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import InvoiceCreatePage from './pages/InvoiceCreatePage'
import InvoiceEditPage from './pages/InvoiceEditPage'
import InvoicesPage from './pages/InvoicesPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ReferralPage from './pages/ReferralPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './stores/authStore'

function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    void init()
  }, [init])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/facturen" element={<InvoicesPage />} />
          <Route path="/facturen/nieuw" element={<InvoiceCreatePage />} />
          <Route path="/facturen/:id/bewerken" element={<InvoiceEditPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/instellingen" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
