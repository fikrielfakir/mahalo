import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, BadgeCheck, MapPin, Home, Phone, Mail, ArrowLeft, MessageCircle, Loader2, Building, Calendar, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import { Toast, useToast } from '../components/Toast'
import { agentsApi, consultsApi, userChatsApi } from '../api/client'
import { useUserAuth } from '../context/UserAuthContext'

const AVATAR_COLORS = ['#730D26', '#BA1932', '#9b1232', '#4f0919', '#d01e38', '#730D26']
const EMPTY_FORM = { name: '', phone: '', message: '' }

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

function ProjectMiniCard({ project }) {
  const imgUrl = project.image
    ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`)
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden relative">
        <img src={imgUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-gold/10 flex items-center justify-center">
            <Building size={11} className="text-gold" />
          </div>
          <span className="text-navy/50 text-xs">{project.investor?.name || 'Developer'}</span>
        </div>
        <h3 className="text-navy font-bold text-sm mb-1 group-hover:text-gold transition-colors line-clamp-1">{project.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="text-gold font-bold text-sm">From {formatPrice(project.price_from)}</div>
          {project.city?.name && (
            <div className="flex items-center gap-1 text-navy/35 text-xs">
              <MapPin size={10} /> {project.city.name}
            </div>
          )}
        </div>
        {project.status && (
          <div className="flex items-center gap-1 mt-2 text-navy/40 text-xs">
            <Calendar size={10} /> <span className="capitalize">{project.status}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

function ProjectMiniSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-card animate-pulse">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  )
}

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useUserAuth()
  const [agent, setAgent]           = useState(null)
  const [properties, setProperties] = useState([])
  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [propsLoading, setPropsLoading] = useState(true)
  const [projsLoading, setProjsLoading] = useState(true)
  const [activeTab, setActiveTab]   = useState('properties')
  const [chatStarting, setChatStarting] = useState(false)

  const [form, setForm]             = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const { toast, show: showToast, hide: hideToast } = useToast()

  useEffect(() => {
    agentsApi.byId(id)
      .then((res) => setAgent(res?.data || null))
      .catch(() => setAgent(null))
      .finally(() => setLoading(false))

    agentsApi.getProperties(id)
      .then((res) => setProperties(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProperties([]))
      .finally(() => setPropsLoading(false))

    agentsApi.getProjects(id)
      .then((res) => setProjects(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProjects([]))
      .finally(() => setProjsLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Please fill in your name and phone', 'error')
      return
    }
    setSubmitting(true)
    try {
      await consultsApi.store({
        name: form.name,
        phone: form.phone,
        message: form.message || `I'd like to connect with ${agent?.display_name || agent?.name}`,
        agent_id: agent?.id,
      })
      showToast('Message sent! The agent will contact you shortly.')
      setForm(EMPTY_FORM)
    } catch {
      showToast('Failed to send message. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartChat = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setChatStarting(true)
    try {
      await userChatsApi.startChat({ agent_id: agent.id })
      navigate(`/messages?agent_id=${agent.id}`)
    } catch {
      navigate(`/messages?agent_id=${agent.id}`)
    } finally {
      setChatStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-24 px-6 max-w-7xl mx-auto animate-pulse">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-28 h-28 rounded-3xl bg-gray-200" />
            <div className="space-y-3">
              <div className="h-7 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-24">
          <p className="text-navy/50 text-lg">Agent not found</p>
          <Link to="/agents" className="btn-gold">Browse Agents</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const rawAvatar = agent.avatar_url || agent.avatar
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `/storage/${rawAvatar}`)
    : null
  const displayName = agent.display_name || agent.name || 'Agent'

  const tabsLoading = activeTab === 'properties' ? propsLoading : projsLoading
  const tabCount    = activeTab === 'properties' ? properties.length : projects.length

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/agents" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Agents
          </Link>
        </div>

        {/* Agent Profile Card */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-28 h-28 rounded-3xl object-cover" />
                ) : (
                  <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center text-white font-bold text-4xl"
                    style={{ background: AVATAR_COLORS[agent.id % AVATAR_COLORS.length] }}
                  >
                    {displayName.charAt(0)}
                  </div>
                )}
                {agent.is_verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-3 border-white shadow">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-navy">{displayName}</h1>
                  {agent.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                      <BadgeCheck size={11} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-navy/40 text-sm mb-3">
                  <MapPin size={13} /> {agent.city?.name || 'Morocco'}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-5 mb-5">
                  {agent.rating && (
                    <div className="flex items-center gap-1.5">
                      <Star size={15} className="fill-gold text-gold" />
                      <span className="text-navy font-bold">{agent.rating}</span>
                      {agent.reviews && <span className="text-navy/40 text-xs">({agent.reviews} reviews)</span>}
                    </div>
                  )}
                  {agent.properties_count !== undefined && (
                    <div className="flex items-center gap-1.5 text-navy/60 text-sm">
                      <Home size={14} className="text-gold" /> {agent.properties_count} listings
                    </div>
                  )}
                  {!projsLoading && projects.length > 0 && (
                    <div className="flex items-center gap-1.5 text-navy/60 text-sm">
                      <Building size={14} className="text-gold" /> {projects.length} projects
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
                      <Phone size={14} /> {agent.phone}
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 px-4 py-2.5 border border-navy/10 text-navy text-sm font-semibold rounded-xl hover:bg-navy hover:text-white hover:border-navy transition-all">
                      <Mail size={14} /> {agent.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Contact form */}
              <div className="w-full sm:w-72 shrink-0 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleStartChat}
                    disabled={chatStarting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)', boxShadow: '0 2px 12px rgba(186,25,50,0.30)' }}
                  >
                    {chatStarting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    {chatStarting ? 'Opening chat…' : 'Chat with Agent'}
                  </button>
                ) : (
                  <form className="space-y-2.5" onSubmit={handleSubmit}>
                    <input
                      type="text" placeholder="Your name *"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                      required
                    />
                    <input
                      type="tel" placeholder="Your phone *"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                      required
                    />
                    <textarea
                      placeholder="Your message..."
                      rows={2}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    />
                    <button type="submit" disabled={submitting} className="w-full btn-gold justify-center flex gap-2 disabled:opacity-60">
                      {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send Message'}
                    </button>
                  </form>
                )}
                {!isAuthenticated && (
                  <p className="text-center text-xs text-navy/40">
                    <Link to="/login" className="text-[#730D26] font-semibold hover:underline">Sign in</Link> to chat directly with the agent
                  </p>
                )}
              </div>
            </div>

            {agent.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-navy/60 text-sm leading-relaxed">{agent.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Listings + Projects Tabs */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-2xl shadow-card w-fit mb-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'properties' ? 'bg-navy text-white shadow-sm' : 'text-navy/50 hover:text-navy'
              }`}
            >
              <Home size={14} />
              Properties
              {!propsLoading && properties.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-lg ${activeTab === 'properties' ? 'bg-white/20' : 'bg-navy/8'}`}>
                  {properties.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'projects' ? 'bg-navy text-white shadow-sm' : 'text-navy/50 hover:text-navy'
              }`}
            >
              <Building size={14} />
              Projects
              {!projsLoading && projects.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-lg ${activeTab === 'projects' ? 'bg-white/20' : 'bg-navy/8'}`}>
                  {projects.length}
                </span>
              )}
            </button>
          </div>

          <h2 className="text-xl font-bold text-navy mb-6">
            {displayName}'s {activeTab === 'properties' ? 'Listings' : 'Projects'}
            {!tabsLoading && tabCount > 0 && (
              <span className="text-navy/40 font-normal text-base ml-2">({tabCount})</span>
            )}
          </h2>

          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {propsLoading
                ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                : properties.length === 0
                  ? <p className="col-span-4 text-navy/40 py-12 text-center">No listings yet.</p>
                  : properties.map((p) => <PropertyCard key={p.id} property={p} />)
              }
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projsLoading
                ? Array.from({ length: 3 }).map((_, i) => <ProjectMiniSkeleton key={i} />)
                : projects.length === 0
                  ? <p className="col-span-3 text-navy/40 py-12 text-center">No projects yet.</p>
                  : projects.map((p) => <ProjectMiniCard key={p.id} project={p} />)
              }
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
