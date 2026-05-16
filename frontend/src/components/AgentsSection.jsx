import { useEffect, useState } from 'react'
import { ArrowRight, Star, BadgeCheck, MapPin, Home, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agentsApi } from '../api/client'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#730D26,#BA1932)',
  'linear-gradient(135deg,#BA1932,#d01e38)',
  'linear-gradient(135deg,#4f0919,#730D26)',
  'linear-gradient(135deg,#9b1232,#BA1932)',
]

function AgentCard({ agent, index }) {
  const displayName = agent.display_name || agent.name || 'Agent'
  const rawAvatar   = agent.avatar_url || agent.avatar
  const avatarUrl   = rawAvatar
    ? (rawAvatar.startsWith('http') || rawAvatar.startsWith('/') ? rawAvatar : `/storage/${rawAvatar}`)
    : null

  return (
    <Link
      to={`/agents/${agent.id}`}
      className="group block bg-white rounded-3xl p-6 text-center transition-all duration-400 hover:-translate-y-2"
      style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.08)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,13,38,0.16)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(115,13,38,0.08)'}
    >
      {/* Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-2xl object-cover" />
        ) : (
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
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

      <h3 className="font-bold text-sm mb-0.5 group-hover:text-gold transition-colors duration-200"
        style={{ color: '#730D26', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
        {displayName}
      </h3>
      <div className="flex items-center justify-center gap-1 text-xs mb-4" style={{ color: 'rgba(115,13,38,0.40)' }}>
        <MapPin size={10} style={{ color: '#BA1932', opacity: 0.6 }} />
        {agent.city?.name || 'Morocco'}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-4 mb-5">
        {agent.rating && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="font-semibold text-xs" style={{ color: '#730D26' }}>{agent.rating}</span>
          </div>
        )}
        {agent.properties_count !== undefined && (
          <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(115,13,38,0.40)' }}>
            <Home size={11} style={{ color: '#BA1932', opacity: 0.65 }} />
            {agent.properties_count} listings
          </div>
        )}
      </div>

      <div
        className="w-full py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:gap-2.5"
        style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.25)' }}
      >
        <MessageCircle size={12} /> Contact Agent
      </div>
    </Link>
  )
}

export default function AgentsSection() {
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agentsApi.list({ per_page: 4 })
      .then((res) => {
        const data = res?.data
        setAgents(Array.isArray(data) ? data.slice(0, 4) : [])
      })
      .catch(() => setAgents([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && agents.length === 0) return null

  return (
    <section className="py-28 px-5" style={{ background: 'linear-gradient(180deg, #F8F6F4 0%, #F2EDE8 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="section-label mb-3">Our Experts</p>
            <h2 className="section-title text-4xl mb-3">Top Real Estate Agents</h2>
            <p className="text-sm font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>Trusted professionals ready to help you</p>
          </div>
          <Link to="/agents" className="section-link hidden sm:flex shrink-0">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.06)' }}>
                  <div className="w-20 h-20 skeleton rounded-2xl mx-auto mb-5" />
                  <div className="h-4 skeleton rounded-xl w-3/4 mx-auto mb-2" />
                  <div className="h-3 skeleton rounded-xl w-1/2 mx-auto mb-5" />
                  <div className="h-10 skeleton rounded-xl" />
                </div>
              ))
            : agents.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} />)
          }
        </div>
      </div>
    </section>
  )
}
