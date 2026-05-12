import { useState, useEffect } from 'react'
import { Star, BadgeCheck, MapPin, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { agentsApi } from '../api/client'

const MOCK_AGENTS = [
  { id: 1, name: 'Youssef El Amrani', city: 'Casablanca', rating: 4.9, reviews: 120, properties: 45, is_verified: true },
  { id: 2, name: 'Salma Berjelloun', city: 'Marrakech', rating: 4.8, reviews: 98, properties: 38, is_verified: true },
  { id: 3, name: 'Mehdi Abouellala', city: 'Rabat', rating: 4.9, reviews: 102, properties: 52, is_verified: true },
  { id: 4, name: 'Imane Kadiri', city: 'Tanger', rating: 4.8, reviews: 76, properties: 29, is_verified: true },
  { id: 5, name: 'Omar Benjelloun', city: 'Casablanca', rating: 4.7, reviews: 89, properties: 41, is_verified: false },
  { id: 6, name: 'Fatima Zahra', city: 'Marrakech', rating: 4.9, reviews: 134, properties: 67, is_verified: true },
]

const AVATAR_COLORS = ['#0B1F3A', '#C8A97E', '#1a3a5c', '#8b6914', '#132d52', '#a07a3c']

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agentsApi.list({ per_page: 12 })
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) setAgents(data)
        else setAgents(MOCK_AGENTS)
      })
      .catch(() => setAgents(MOCK_AGENTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Our Experts</p>
          <h1 className="text-3xl font-bold text-navy">Real Estate Agents</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-card animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded mx-auto w-1/2 mb-4" />
                  <div className="h-9 bg-gray-200 rounded-xl" />
                </div>
              ))
            : agents.map((agent, i) => {
                const avatarUrl = agent.avatar
                  ? (agent.avatar.startsWith('http') ? agent.avatar : `/storage/${agent.avatar}`)
                  : null
                return (
                  <div key={agent.id} className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={agent.name} className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                            {agent.name?.charAt(0) || 'A'}
                          </div>
                        )}
                        {agent.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <BadgeCheck size={13} className="text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-navy font-bold text-base mb-1">{agent.name}</h3>
                      <div className="flex items-center gap-1 text-navy/40 text-xs mb-3">
                        <MapPin size={11} />
                        {agent.city?.name || agent.city}
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star size={13} className="fill-gold text-gold" />
                          <span className="text-navy font-semibold text-sm">{agent.rating || '4.8'}</span>
                          <span className="text-navy/40 text-xs">({agent.reviews || '80'})</span>
                        </div>
                        <div className="flex items-center gap-1 text-navy/50 text-xs">
                          <Home size={12} />
                          {agent.properties || '30'} listings
                        </div>
                      </div>
                      <Link
                        to={`/agents/${agent.id}`}
                        className="w-full px-4 py-2.5 rounded-xl border border-navy/10 text-navy text-sm font-semibold hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
