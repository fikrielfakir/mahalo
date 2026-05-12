import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../api/client'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&q=80&auto=format&fit=crop',
]

function formatPrice(price) {
  if (!price) return 'On request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function NewProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [active, setActive]     = useState(0)

  useEffect(() => {
    projectsApi.list({ per_page: 5 })
      .then((res) => setProjects(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length)
  const next = () => setActive((a) => (a + 1) % projects.length)

  if (!loading && projects.length === 0) return null

  return (
    <section className="py-20 px-5 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label mb-2">Off-Plan & New</p>
          <h2 className="section-title text-3xl">New Projects</h2>
          <p className="text-navy/45 text-sm mt-2">Invest early in Morocco's finest developments</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/projects" className="section-link hidden sm:flex mr-2">
            View All <ArrowRight size={15} />
          </Link>
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-navy/10 bg-white flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-navy/10 bg-white flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl skeleton aspect-[3/4]" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-hidden">
          {projects.map((project, i) => {
            const rawImg = Array.isArray(project.images) ? project.images[0] : project.image
            const imgUrl = rawImg
              ? (rawImg.startsWith('http') ? rawImg : `/storage/${rawImg}`)
              : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
            const isActive = i === active

            return (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 shadow-card hover:shadow-card-hover`}
                style={{ height: '420px', width: isActive ? '300px' : '220px' }}
              >
                <img
                  src={imgUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                {/* Glass label at top */}
                {isActive && (
                  <div className="absolute top-4 left-4">
                    <span className="glass-pill text-[10px]">
                      <Building size={9} /> {project.investor?.name || 'Developer'}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-base leading-tight mb-1">{project.name}</h3>
                  {isActive && (
                    <>
                      <p className="text-white/55 text-xs mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">From</div>
                          <div className="text-gold font-bold text-base">{formatPrice(project.price_from)}</div>
                        </div>
                        {project.city?.name && (
                          <div className="flex items-center gap-1 text-white/50 text-xs glass-pill">
                            <MapPin size={9} /> {project.city.name}
                          </div>
                        )}
                      </div>
                    </>
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
            className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-navy/15 hover:bg-navy/30'}`}
          />
        ))}
      </div>
    </section>
  )
}
