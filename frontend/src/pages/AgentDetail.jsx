import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, BadgeCheck, MapPin, Home, Phone, Mail, ArrowLeft, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import { agentsApi } from '../api/client'

const AVATAR_COLORS = ['#0B1F3A', '#C8A97E', '#1a3a5c', '#8b6914', '#132d52', '#a07a3c']

export default function AgentDetail() {
  const { id } = useParams()
  const [agent, setAgent] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [propsLoading, setPropsLoading] = useState(true)

  useEffect(() => {
    agentsApi.byId(id)
      .then((res) => setAgent(res?.data || null))
      .catch(() => setAgent(null))
      .finally(() => setLoading(false))

    agentsApi.getProperties(id)
      .then((res) => setProperties(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProperties([]))
      .finally(() => setPropsLoading(false))
  }, [id])

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

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-20">

        {/* Back */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/agents" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Back to Agents
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
                  <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-white font-bold text-4xl" style={{ background: AVATAR_COLORS[agent.id % AVATAR_COLORS.length] }}>
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
                  <MapPin size={13} />
                  {agent.city?.name || 'Morocco'}
                </div>

                {/* Stats row */}
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
                      <Home size={14} className="text-gold" />
                      {agent.properties_count} listings
                    </div>
                  )}
                </div>

                {/* Contact buttons */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Phone size={14} /> {agent.phone}
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a
                      href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 px-4 py-2.5 border border-navy/10 text-navy text-sm font-semibold rounded-xl hover:bg-navy hover:text-white hover:border-navy transition-all"
                    >
                      <Mail size={14} /> {agent.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Contact form */}
              <div className="w-full sm:w-72 shrink-0">
                <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your name" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="tel" placeholder="Your phone" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <textarea placeholder="Your message..." rows={2} className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
                  <button type="submit" className="w-full btn-gold justify-center flex">Send Message</button>
                </form>
              </div>
            </div>

            {/* Description */}
            {agent.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-navy/60 text-sm leading-relaxed">{agent.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Listings */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-xl font-bold text-navy mb-6">
            {displayName}'s Listings
            {!propsLoading && properties.length > 0 && (
              <span className="text-navy/40 font-normal text-base ml-2">({properties.length})</span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {propsLoading
              ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : properties.length === 0
                ? <p className="col-span-4 text-navy/40 py-12 text-center">No listings yet.</p>
                : properties.map((p) => <PropertyCard key={p.id} property={p} />)
            }
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}
