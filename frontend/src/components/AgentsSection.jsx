import { useEffect, useState } from 'react'
import { ArrowRight, Star, BadgeCheck, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agentsApi } from '../api/client'

const MOCK_AGENTS = [
  { id: 1, name: 'Youssef El Amrani', avatar: null, city: 'Casablanca', rating: 4.9, reviews: 120, is_verified: true },
  { id: 2, name: 'Salma Berjelloun', avatar: null, city: 'Marrakech', rating: 4.8, reviews: 98, is_verified: true },
  { id: 3, name: 'Mehdi Abouellala', avatar: null, city: 'Rabat', rating: 4.9, reviews: 102, is_verified: true },
  { id: 4, name: 'Imane Kadiri', avatar: null, city: 'Tanger', rating: 4.8, reviews: 76, is_verified: true },
]

const AVATAR_COLORS = ['#0B1F3A', '#C8A97E', '#1a3a5c', '#8b6914']

function AgentCard({ agent, index }) {
  const displayName = agent.display_name || agent.name || 'Agent'
  const rawAvatar = agent.avatar_url || agent.avatar
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `/storage/${rawAvatar}`)
    : null

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
      {/* Avatar */}
      <div className="relative mb-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={agent.name} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
          >
            {displayName?.charAt(0) || 'A'}
          </div>
        )}
        {agent.is_verified && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
            <BadgeCheck size={13} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-navy font-bold text-base mb-1">{displayName}</h3>
      <p className="text-navy/50 text-xs mb-3">{agent.city?.name || agent.city || 'Morocco'}</p>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-4">
        <Star size={13} className="fill-gold text-gold" />
        <span className="text-navy font-semibold text-sm">{agent.rating || '4.8'}</span>
        <span className="text-navy/40 text-xs">({agent.reviews || Math.floor(Math.random() * 100 + 50)})</span>
      </div>

      {/* CTA */}
      <Link
        to={`/agents/${agent.id}`}
        className="w-full px-4 py-2.5 rounded-xl border border-navy/10 text-navy text-sm font-semibold hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
      >
        Contact
      </Link>
    </div>
  )
}

export default function AgentsSection() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agentsApi.list({ per_page: 4 })
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          setAgents(data.slice(0, 4))
        } else {
          setAgents(MOCK_AGENTS)
        }
      })
      .catch(() => setAgents(MOCK_AGENTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Our Experts</p>
          <h2 className="section-title text-3xl">Top Real Estate Agents</h2>
        </div>
        <Link to="/agents" className="section-link hidden sm:flex">
          View All Agents
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-card animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded mx-auto w-1/2 mb-4" />
                <div className="h-9 bg-gray-200 rounded-xl" />
              </div>
            ))
          : agents.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} />)}
      </div>
    </section>
  )
}
