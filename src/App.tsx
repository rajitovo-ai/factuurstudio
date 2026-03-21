import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AdminRoute from './components/auth/AdminRoute'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import CustomersPage from './pages/CustomersPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import InvoiceCreatePage from './pages/InvoiceCreatePage'
import InvoiceEditPage from './pages/InvoiceEditPage'
import InvoicesPage from './pages/InvoicesPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PricingPage from './pages/PricingPage'
import ReferralPage from './pages/ReferralPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'
import { captureAttributionFromUrl, getAttributionPayload } from './lib/attribution'
import { useAuthStore } from './stores/authStore'
import { useInvoiceStore } from './stores/invoiceStore'
import { useProfileStore } from './stores/profileStore'

const InvoiceImportPage = lazy(() => import('./pages/InvoiceImportPage'))

function App() {
  const location = useLocation()
  const init = useAuthStore((state) => state.init)
  const userId = useAuthStore((state) => state.userId)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loadInvoices = useInvoiceStore((state) => state.loadInvoices)
  const loadProfile = useProfileStore((state) => state.loadProfile)

  useEffect(() => {
    void init()
  }, [init])

  useEffect(() => {
    if (isAuthenticated && userId) {
      void Promise.all([loadInvoices(userId), loadProfile(userId)])
    }
  }, [isAuthenticated, loadInvoices, loadProfile, userId])

  useEffect(() => {
    captureAttributionFromUrl()

    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (!gtag) return

    gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
      ...getAttributionPayload(),
    })
  }, [location.pathname, location.search])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />
      <Route path="/reset-wachtwoord" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/klanten" element={<CustomersPage />} />
          <Route path="/facturen" element={<InvoicesPage />} />
          <Route path="/facturen/nieuw" element={<InvoiceCreatePage />} />
          <Route
            path="/facturen/importeren"
            element={
              <Suspense fallback={null}>
                <InvoiceImportPage />
              </Suspense>
            }
          />
          <Route path="/facturen/:id/bewerken" element={<InvoiceEditPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/instellingen" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
