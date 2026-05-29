import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ErrorBoundary from './components/ErrorBoundary'
import { USER_LANG_KEY, ADMIN_LANG_KEY } from './i18n.js'
import SiteModeGate from './components/SiteModeGate'
import CompareBar from './components/CompareBar'
import AuthModal from './components/AuthModal'
import { CompareProvider } from './context/CompareContext'
import { UserAuthProvider } from './context/UserAuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { VerifyEmailProvider } from './context/VerifyEmailContext'
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext'
import VerifyEmailBanner from './components/VerifyEmailBanner'
import VerifyEmailPopup from './components/VerifyEmailPopup'
import { AuthProvider } from './admin/context/AuthContext'
import CookieBanner from './components/CookieBanner'
import OfflineBanner from './components/OfflineBanner'
import GlobalAiChat from './components/GlobalAiChat'

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
const CookiePolicyPage   = lazy(() => import('./pages/CookiePolicyPage'))
const ContactPage        = lazy(() => import('./pages/ContactPage'))
const HelpCenterPage     = lazy(() => import('./pages/HelpCenterPage'))
const MarketInsightsPage = lazy(() => import('./pages/MarketInsightsPage'))
const PropertyMatchPage  = lazy(() => import('./pages/PropertyMatchPage'))

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
const TranslationsPage              = lazy(() => import('./admin/pages/TranslationsPage'))
const LanguagesPage                 = lazy(() => import('./admin/pages/LanguagesPage'))

// ── Inline fallback spinner ──────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function LangSync() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const key = isAdmin ? ADMIN_LANG_KEY : USER_LANG_KEY
    const defaultLang = isAdmin ? 'en' : 'fr'
    const lang = localStorage.getItem(key) || defaultLang
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [isAdmin]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function CookieBannerWrapper() {
  const settings = useSiteSettings()
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return <CookieBanner settings={settings} />
}

function PublicOnlyOverlays() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return <GlobalAiChat />
}

function OfflineGate({ children }) {
  const isOnline   = typeof navigator !== 'undefined' ? navigator.onLine : true
  const [offline, setOffline] = useState(!isOnline)
  // Track whether the user has ever had a connection in this session.
  // If they load the page already offline, wasOnline stays false → full page.
  // If they drop mid-session, wasOnline is true → banner only.
  const wasOnline = useRef(isOnline)

  useEffect(() => {
    const goOnline = () => {
      wasOnline.current = true
      setOffline(false)
    }
    const goOffline = () => setOffline(true)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Offline from the very first load — show the full standalone page
  if (offline && !wasOnline.current) return <OfflinePage />

  // Mid-session drop — keep the page alive, show the banner on top
  return (
    <>
      <OfflineBanner offline={offline} />
      {children}
    </>
  )
}

export default function App() {
  return (
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
                <ErrorBoundary>
                  <LangSync />
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
                      <Route path="/find-my-property"       element={<PropertyMatchPage />} />

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
                      <Route path="/cookie-policy"          element={<CookiePolicyPage />} />
                      <Route path="/contact"                element={<ContactPage />} />
                      <Route path="/help"                   element={<HelpCenterPage />} />
                      <Route path="/market-insights"        element={<MarketInsightsPage />} />

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
                        <Route path="translations"              element={<TranslationsPage />} />
                        <Route path="languages"                 element={<LanguagesPage />} />
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
                  <CookieBannerWrapper />
                  <PublicOnlyOverlays />
                </ErrorBoundary>
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
  )
}
