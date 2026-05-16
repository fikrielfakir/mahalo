import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import SiteModeGate from './components/SiteModeGate'
import CompareBar from './components/CompareBar'
import AuthModal from './components/AuthModal'
import { CompareProvider } from './context/CompareContext'
import { UserAuthProvider } from './context/UserAuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { VerifyEmailProvider } from './context/VerifyEmailContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import VerifyEmailBanner from './components/VerifyEmailBanner'
import VerifyEmailPopup from './components/VerifyEmailPopup'
import { useState, useEffect } from 'react'
import { AuthProvider } from './admin/context/AuthContext'

// ── Lazy: Public pages ──────────────────────────────────────────
const Home               = lazy(() => import('./pages/Home'))
const Properties         = lazy(() => import('./pages/Properties'))
const PropertyDetail     = lazy(() => import('./pages/PropertyDetail'))
const Projects           = lazy(() => import('./pages/Projects'))
const ProjectDetail      = lazy(() => import('./pages/ProjectDetail'))
const Neighborhoods      = lazy(() => import('./pages/Neighborhoods'))
const Agents             = lazy(() => import('./pages/Agents'))
const AgentDetail        = lazy(() => import('./pages/AgentDetail'))
const About              = lazy(() => import('./pages/About'))
const ListProperty       = lazy(() => import('./pages/ListProperty'))
const PrivacyPage        = lazy(() => import('./pages/PrivacyPage'))
const TermsPage          = lazy(() => import('./pages/TermsPage'))

// ── Lazy: Error / utility pages ─────────────────────────────────
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'))
const ForbiddenPage      = lazy(() => import('./pages/ForbiddenPage'))
const ServerErrorPage    = lazy(() => import('./pages/ServerErrorPage'))
const OfflinePage        = lazy(() => import('./pages/OfflinePage'))

// ── Lazy: User auth pages ────────────────────────────────────────
const UserLoginPage      = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage       = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage  = lazy(() => import('./pages/auth/ResetPasswordPage'))
const VerifyEmailPage    = lazy(() => import('./pages/auth/VerifyEmailPage'))
const GoogleCallbackPage = lazy(() => import('./pages/auth/GoogleCallbackPage'))

// ── Lazy: User account pages ─────────────────────────────────────
const ProfilePage        = lazy(() => import('./pages/ProfilePage'))
const AgentDashboardPage = lazy(() => import('./pages/AgentDashboardPage'))
const UserChatsPage      = lazy(() => import('./pages/UserChatsPage'))

// ── Lazy: Admin bundle (split separately for better caching) ─────
const AdminLayout                   = lazy(() => import('./admin/components/AdminLayout'))
const AdminLoginPage                = lazy(() => import('./admin/pages/LoginPage'))
const AdminGoogleCallbackPage       = lazy(() => import('./admin/pages/GoogleCallbackPage'))
const Dashboard                     = lazy(() => import('./admin/pages/Dashboard'))
const PropertiesPage                = lazy(() => import('./admin/pages/PropertiesPage'))
const ProjectsPage                  = lazy(() => import('./admin/pages/ProjectsPage'))
const AgentsPage                    = lazy(() => import('./admin/pages/AgentsPage'))
const CategoriesPage                = lazy(() => import('./admin/pages/CategoriesPage'))
const FeaturesPage                  = lazy(() => import('./admin/pages/FeaturesPage'))
const FacilitiesPage                = lazy(() => import('./admin/pages/FacilitiesPage'))
const InvestorsPage                 = lazy(() => import('./admin/pages/InvestorsPage'))
const CitiesPage                    = lazy(() => import('./admin/pages/CitiesPage'))
const ConsultsPage                  = lazy(() => import('./admin/pages/ConsultsPage'))
const MediaPage                     = lazy(() => import('./admin/pages/MediaPage'))
const UsersPage                     = lazy(() => import('./admin/pages/UsersPage'))
const SettingsPage                  = lazy(() => import('./admin/pages/SettingsPage'))
const ProfessionalApplicationsPage  = lazy(() => import('./admin/pages/ProfessionalApplicationsPage'))
const AppUpdatePage                 = lazy(() => import('./admin/pages/AppUpdatePage'))
const AnalyticsPage                 = lazy(() => import('./admin/pages/AnalyticsPage'))

// ── Inline fallback spinner ──────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function OfflineGate({ children }) {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false)
  useEffect(() => {
    const goOnline  = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])
  if (offline) return <OfflinePage />
  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <OfflineGate>
        <SiteModeGate>
        <BrowserRouter>
          <SiteSettingsProvider>
          <CompareProvider>
            <UserAuthProvider>
              <VerifyEmailProvider>
              <FavoritesProvider>
              <AuthModalProvider>
                <AuthProvider>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public site */}
                      <Route path="/"                       element={<Home />} />
                      <Route path="/properties"             element={<Properties />} />
                      <Route path="/properties/:slug"       element={<PropertyDetail />} />
                      <Route path="/projects"               element={<Projects />} />
                      <Route path="/projects/:slug"         element={<ProjectDetail />} />
                      <Route path="/neighborhoods"          element={<Neighborhoods />} />
                      <Route path="/agents"                 element={<Agents />} />
                      <Route path="/agents/:id"             element={<AgentDetail />} />
                      <Route path="/about"                  element={<About />} />
                      <Route path="/list-property"          element={<ListProperty />} />

                      {/* User profile */}
                      <Route path="/profile"                element={<ProfilePage />} />
                      <Route path="/messages"               element={<UserChatsPage />} />
                      <Route path="/agent-dashboard"        element={<AgentDashboardPage />} />

                      {/* User auth */}
                      <Route path="/login"                  element={<UserLoginPage />} />
                      <Route path="/register"               element={<RegisterPage />} />
                      <Route path="/forgot-password"        element={<ForgotPasswordPage />} />
                      <Route path="/reset-password"         element={<ResetPasswordPage />} />
                      <Route path="/email/verify/:id/:hash" element={<VerifyEmailPage />} />
                      <Route path="/auth/google/callback"   element={<GoogleCallbackPage />} />

                      {/* Legal / content pages */}
                      <Route path="/privacy"                element={<PrivacyPage />} />
                      <Route path="/terms"                  element={<TermsPage />} />

                      {/* Error pages — directly accessible */}
                      <Route path="/403"                    element={<ForbiddenPage />} />
                      <Route path="/500"                    element={<ServerErrorPage />} />
                      <Route path="/offline"                element={<OfflinePage />} />

                      {/* Admin */}
                      <Route path="/admin/login"                element={<AdminLoginPage />} />
                      <Route path="/admin/auth/google/callback" element={<AdminGoogleCallbackPage />} />
                      <Route path="/admin"                  element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard"   element={<Dashboard />} />
                        <Route path="properties"  element={<PropertiesPage />} />
                        <Route path="projects"    element={<ProjectsPage />} />
                        <Route path="agents"      element={<AgentsPage />} />
                        <Route path="categories"  element={<CategoriesPage />} />
                        <Route path="features"    element={<FeaturesPage />} />
                        <Route path="facilities"  element={<FacilitiesPage />} />
                        <Route path="investors"   element={<InvestorsPage />} />
                        <Route path="cities"      element={<CitiesPage />} />
                        <Route path="consults"    element={<ConsultsPage />} />
                        <Route path="media"       element={<MediaPage />} />
                        <Route path="users"                     element={<UsersPage />} />
                        <Route path="professional-applications" element={<ProfessionalApplicationsPage />} />
                        <Route path="settings"                  element={<SettingsPage />} />
                        <Route path="app-update"                element={<AppUpdatePage />} />
                        <Route path="analytics"                 element={<AnalyticsPage />} />
                      </Route>

                      {/* 404 — catches everything else */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>

                  {/* Global overlays */}
                  <CompareBar />
                  <AuthModal />
                  <VerifyEmailBanner />
                  <VerifyEmailPopup />
                </AuthProvider>
              </AuthModalProvider>
              </FavoritesProvider>
              </VerifyEmailProvider>
            </UserAuthProvider>
          </CompareProvider>
          </SiteSettingsProvider>
        </BrowserRouter>
        </SiteModeGate>
      </OfflineGate>
    </ErrorBoundary>
  )
}
