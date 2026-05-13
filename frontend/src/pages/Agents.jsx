import { useState, useEffect } from 'react'
import { Star, BadgeCheck, MapPin, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { agentsApi } from '../api/client'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#1A1A1A,#132d52)',
  'linear-gradient(135deg,#8b6914,#9B1232)',
  'linear-gradient(135deg,#1a3a5c,#2a5a8c)',
  'linear-gradient(135deg,#a07a3c,#d4b896)',
  'linear-gradient(135deg,#071628,#1A1A1A)',
  'linear-gradient(135deg,#b8945f,#9B1232)',
]

export default function Agents() {
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    agentsApi.list({ per_page: 12 })
      .then((res) => setAgents(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      <Navbar />
      <div className="pt-24 pb-20 px-5 max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="section-label mb-2">Our Experts</p>
          <h1 className="text-3xl font-bold text-navy">Real Estate Agents</h1>
          <p className="text-navy/45 text-sm mt-1.5">Trusted professionals ready to find your dream home</p>
        </div>

        {error ? (
          <div className="text-center py-24 text-navy/40">Failed to load agents.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-card">
                    <div className="w-20 h-20 skeleton rounded-2xl mx-auto mb-4" />
                    <div className="h-4 skeleton rounded-xl w-3/4 mx-auto mb-2" />
                    <div className="h-3 skeleton rounded-xl w-1/2 mx-auto mb-4" />
                    <div className="h-10 skeleton rounded-xl" />
                  </div>
                ))
              : agents.length === 0 ? (
                  <div className="col-span-4 text-center py-24 text-navy/40">No agents found.</div>
                )
              : agents.map((agent, i) => {
                  const rawAvatar  = agent.avatar_url || agent.avatar
                  const avatarUrl  = rawAvatar
                    ? (rawAvatar.startsWith('http') ? rawAvatar : `/storage/${rawAvatar}`)
                    : null
                  const displayName = agent.display_name || agent.name || 'Agent'

                  return (
                    <Link
                      key={agent.id}
                      to={`/agents/${agent.id}`}
                      className="group block bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1.5"
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-2xl object-cover" />
                          ) : (
                            <div
                              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                            >
                              {displayName.charAt(0)}
                            </div>
                          )}
                          {agent.is_verified && (
                            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                              <BadgeCheck size={12} className="text-white" />
                            </div>
                          )}
                        </div>

                        <h3 className="text-navy font-bold text-sm mb-0.5 group-hover:text-gold transition-colors duration-200">
                          {displayName}
                        </h3>
                        <div className="flex items-center gap-1 text-navy/40 text-xs mb-3">
                          <MapPin size={10} /> {agent.city?.name || agent.city || 'Morocco'}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          {agent.rating && (
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-gold text-gold" />
                              <span className="text-navy font-semibold text-xs">{agent.rating}</span>
                              {agent.reviews && <span className="text-navy/35 text-[11px]">({agent.reviews})</span>}
                            </div>
                          )}
                          {agent.properties_count !== undefined && (
                            <div className="flex items-center gap-1 text-navy/40 text-xs">
                              <Home size={11} className="text-gold/70" />
                              {agent.properties_count}
                            </div>
                          )}
                        </div>

                        <div className="w-full py-2.5 rounded-xl bg-navy/4 group-hover:bg-navy group-hover:text-white text-navy text-xs font-semibold transition-all duration-200">
                          View Profile
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
