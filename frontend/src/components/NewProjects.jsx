import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../api/client'

const MOCK_PROJECTS = [
  { id: 1, name: 'The View Anfa', description: 'Luxury living in Casablanca', price_from: 1450000, investor: { name: 'Horizon Group' }, city: { name: 'Casablanca' } },
  { id: 2, name: 'Résidences Mascotte', description: 'Premium Apartments — Hivernage, Marrakech', price_from: 980000, investor: { name: 'Addoha' }, city: { name: 'Marrakech' } },
  { id: 3, name: 'Noria Golf City', description: 'Villas by the Golf Course', price_from: 3900000, investor: { name: 'Noria' }, city: { name: 'Casablanca' } },
  { id: 4, name: 'Marina Living', description: 'Waterfront Apartments', price_from: 2100000, investor: { name: 'Emaar' }, city: { name: 'Rabat' } },
  { id: 5, name: 'Palm Heights', description: 'Beachfront luxury residences', price_from: 5200000, investor: { name: 'Alliances' }, city: { name: 'Agadir' } },
]

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&q=80&auto=format&fit=crop',
]

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function NewProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => {
    projectsApi.list({ per_page: 5 })
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(MOCK_PROJECTS)
        }
      })
      .catch(() => setProjects(MOCK_PROJECTS))
      .finally(() => setLoading(false))
  }, [])

  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length)
  const next = () => setActive((a) => (a + 1) % projects.length)

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Off-Plan & New</p>
          <h2 className="section-title text-3xl">New Projects</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects" className="section-link hidden sm:flex mr-4">
            View All Projects
            <ArrowRight size={16} />
          </Link>
          <button onClick={prev} className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl overflow-hidden bg-gray-200 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-hidden">
          {projects.map((project, i) => {
            const rawImg = Array.isArray(project.images) ? project.images[0] : project.image
            const imgUrl = rawImg
              ? (rawImg.startsWith('http') ? rawImg : `/storage/${rawImg}`)
              : PROJECT_IMAGES[i % PROJECT_IMAGES.length]
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`relative shrink-0 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 ${
                  i === active ? 'w-72 md:w-80' : 'w-52 md:w-60'
                }`}
                style={{ height: '400px' }}
                onClick={() => setActive(i)}
              >
                <img src={imgUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Building size={12} className="text-gold" />
                    </div>
                    <span className="text-white/60 text-xs">{project.investor?.name || 'Developer'}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-1">{project.name}</h3>
                  <p className="text-white/60 text-xs mb-3 line-clamp-1">{project.description}</p>
                  {i === active && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/50 text-xs">From</span>
                        <div className="text-gold font-bold text-base">{formatPrice(project.price_from)}</div>
                      </div>
                      <div className="flex items-center gap-1 text-white/50 text-xs">
                        <MapPin size={11} />
                        {project.city?.name}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Dots */}
      <div className="flex gap-2 justify-center mt-6">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-navy/20'}`}
          />
        ))}
      </div>
    </section>
  )
}
