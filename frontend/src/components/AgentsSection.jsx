import { useEffect, useState } from 'react'
import { ArrowRight, Star, BadgeCheck, MapPin, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agentsApi } from '../api/client'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#111111,#333333)',
  'linear-gradient(135deg,#2a2a2a,#555555)',
  'linear-gradient(135deg,#1a1a1a,#444444)',
  'linear-gradient(135deg,#333333,#666666)',
]

function AgentCard({ agent, index }) {
  const displayName = agent.display_name || agent.name || 'Agent'
  const rawAvatar   = agent.avatar_url || agent.avatar
  const avatarUrl   = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `/storage/${rawAvatar}`)
    : null

  return (
    <Link
      to={`/agents/${agent.id}`}
      className="group block bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1.5 text-center"
    >
      {/* Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-4">
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

      <h3 className="text-navy font-bold text-sm mb-0.5 group-hover:text-gold transition-colors duration-200">{displayName}</h3>
      <div className="flex items-center justify-center gap-1 text-navy/40 text-xs mb-3">
        <MapPin size={10} /> {agent.city?.name || 'Morocco'}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {agent.rating && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-navy font-semibold text-xs">{agent.rating}</span>
          </div>
        )}
        {agent.properties_count !== undefined && (
          <div className="flex items-center gap-1 text-navy/40 text-xs">
            <Home size={11} className="text-gold/70" />
            {agent.properties_count}
          </div>
        )}
      </div>

      <div className="w-full py-2.5 rounded-xl bg-navy/4 group-hover:bg-navy group-hover:text-white text-navy text-xs font-semibold transition-all duration-200 border border-transparent group-hover:border-navy">
        View Profile
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
    <section className="py-20 px-5 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label mb-2">Our Experts</p>
          <h2 className="section-title text-3xl">Top Real Estate Agents</h2>
          <p className="text-navy/45 text-sm mt-2">Trusted professionals ready to help you</p>
        </div>
        <Link to="/agents" className="section-link hidden sm:flex shrink-0">
          View All <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-card">
                <div className="w-20 h-20 skeleton rounded-2xl mx-auto mb-4" />
                <div className="h-4 skeleton rounded-xl w-3/4 mx-auto mb-2" />
                <div className="h-3 skeleton rounded-xl w-1/2 mx-auto mb-4" />
                <div className="h-9 skeleton rounded-xl" />
              </div>
            ))
          : agents.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} />)
        }
      </div>
    </section>
  )
}
