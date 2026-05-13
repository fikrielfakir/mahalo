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

// Admin
import { AuthProvider } from './admin/context/AuthContext'
import AdminLayout from './admin/components/AdminLayout'
import LoginPage from './admin/pages/LoginPage'
import Dashboard from './admin/pages/Dashboard'
import PropertiesPage from './admin/pages/PropertiesPage'
import ProjectsPage from './admin/pages/ProjectsPage'
import AgentsPage from './admin/pages/AgentsPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import FeaturesPage from './admin/pages/FeaturesPage'
import FacilitiesPage from './admin/pages/FacilitiesPage'
import InvestorsPage from './admin/pages/InvestorsPage'
import ConsultsPage from './admin/pages/ConsultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/neighborhoods" element={<Neighborhoods />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/list-property" element={<ListProperty />} />

          {/* Admin login (no auth required) */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin dashboard (auth-protected) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="projects"   element={<ProjectsPage />} />
            <Route path="agents"     element={<AgentsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="features"   element={<FeaturesPage />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="investors"  element={<InvestorsPage />} />
            <Route path="consults"   element={<ConsultsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
