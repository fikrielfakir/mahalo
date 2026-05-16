import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Projects from './pages/Projects'
import Neighborhoods from './pages/Neighborhoods'
import Agents from './pages/Agents'
import PropertyDetail from './pages/PropertyDetail'
import ProjectDetail from './pages/ProjectDetail'
import AgentDetail from './pages/AgentDetail'
import About from './pages/About'
import ListProperty from './pages/ListProperty'
import NotFoundPage from './pages/NotFoundPage'
import ForbiddenPage from './pages/ForbiddenPage'
import ServerErrorPage from './pages/ServerErrorPage'
import OfflinePage from './pages/OfflinePage'
import ErrorBoundary from './components/ErrorBoundary'
import CompareBar from './components/CompareBar'
import AuthModal from './components/AuthModal'
import { CompareProvider } from './context/CompareContext'
import { UserAuthProvider } from './context/UserAuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { VerifyEmailProvider } from './context/VerifyEmailContext'
import VerifyEmailBanner from './components/VerifyEmailBanner'
import VerifyEmailPopup from './components/VerifyEmailPopup'
import { useState, useEffect } from 'react'

// User auth pages
import UserLoginPage        from './pages/auth/LoginPage'
import RegisterPage         from './pages/auth/RegisterPage'
import ForgotPasswordPage   from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage    from './pages/auth/ResetPasswordPage'
import VerifyEmailPage      from './pages/auth/VerifyEmailPage'
import GoogleCallbackPage   from './pages/auth/GoogleCallbackPage'
import ProfilePage          from './pages/ProfilePage'
import AgentDashboardPage  from './pages/AgentDashboardPage'
import UserChatsPage        from './pages/UserChatsPage'

// Admin
import { AuthProvider }  from './admin/context/AuthContext'
import AdminLayout       from './admin/components/AdminLayout'
import AdminLoginPage          from './admin/pages/LoginPage'
import AdminGoogleCallbackPage from './admin/pages/GoogleCallbackPage'
import Dashboard         from './admin/pages/Dashboard'
import PropertiesPage    from './admin/pages/PropertiesPage'
import ProjectsPage      from './admin/pages/ProjectsPage'
import AgentsPage        from './admin/pages/AgentsPage'
import CategoriesPage    from './admin/pages/CategoriesPage'
import FeaturesPage      from './admin/pages/FeaturesPage'
import FacilitiesPage    from './admin/pages/FacilitiesPage'
import InvestorsPage     from './admin/pages/InvestorsPage'
import CitiesPage        from './admin/pages/CitiesPage'
import ConsultsPage      from './admin/pages/ConsultsPage'
import MediaPage         from './admin/pages/MediaPage'
import UsersPage         from './admin/pages/UsersPage'
import SettingsPage      from './admin/pages/SettingsPage'
import ProfessionalApplicationsPage from './admin/pages/ProfessionalApplicationsPage'

function OfflineGate({ children }) {
  const [offline, setOffline] = useState(!navigator.onLine)
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
        <BrowserRouter>
          <CompareProvider>
            <UserAuthProvider>
              <VerifyEmailProvider>
              <FavoritesProvider>
              <AuthModalProvider>
                <AuthProvider>
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

                    {/* Error pages — directly accessible */}
                    <Route path="/403"                    element={<ForbiddenPage />} />
                    <Route path="/500"                    element={<ServerErrorPage />} />
                    <Route path="/offline"                element={<OfflinePage />} />

                    {/* Admin */}
                    <Route path="/admin/login"                  element={<AdminLoginPage />} />
                    <Route path="/admin/auth/google/callback"   element={<AdminGoogleCallbackPage />} />
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
                    </Route>

                    {/* 404 — catches everything else */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>

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
        </BrowserRouter>
      </OfflineGate>
    </ErrorBoundary>
  )
}
