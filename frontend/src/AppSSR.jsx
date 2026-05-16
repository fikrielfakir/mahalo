import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CompareProvider } from './context/CompareContext'
import { UserAuthProvider } from './context/UserAuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { VerifyEmailProvider } from './context/VerifyEmailContext'

import Home from './pages/Home'
import Properties from './pages/Properties'
import Projects from './pages/Projects'
import Neighborhoods from './pages/Neighborhoods'
import Agents from './pages/Agents'
import PropertyDetail from './pages/PropertyDetail'
import ProjectDetail from './pages/ProjectDetail'
import AgentDetail from './pages/AgentDetail'
import About from './pages/About'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

class SSRBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.error('[SSR] Boundary caught:', err.message)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

const AdminNoIndex = () => (
  <Helmet>
    <meta name="robots" content="noindex,nofollow" />
  </Helmet>
)

export default function AppSSR() {
  return (
    <CompareProvider>
      <UserAuthProvider>
        <VerifyEmailProvider>
          <FavoritesProvider>
            <AuthModalProvider>
              <SSRBoundary>
                <Routes>
                  <Route path="/"                  element={<Home />} />
                  <Route path="/properties"        element={<Properties />} />
                  <Route path="/properties/:slug"  element={<PropertyDetail />} />
                  <Route path="/projects"          element={<Projects />} />
                  <Route path="/projects/:slug"    element={<ProjectDetail />} />
                  <Route path="/neighborhoods"     element={<Neighborhoods />} />
                  <Route path="/agents"            element={<Agents />} />
                  <Route path="/agents/:id"        element={<AgentDetail />} />
                  <Route path="/about"             element={<About />} />
                  <Route path="/privacy"           element={<PrivacyPage />} />
                  <Route path="/terms"             element={<TermsPage />} />
                  <Route path="/admin/*"           element={<AdminNoIndex />} />
                  <Route path="/profile"           element={<AdminNoIndex />} />
                  <Route path="/messages"          element={<AdminNoIndex />} />
                  <Route path="/agent-dashboard"   element={<AdminNoIndex />} />
                  <Route path="*"                  element={null} />
                </Routes>
              </SSRBoundary>
            </AuthModalProvider>
          </FavoritesProvider>
        </VerifyEmailProvider>
      </UserAuthProvider>
    </CompareProvider>
  )
}
