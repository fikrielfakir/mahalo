import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../api/client'
import { useTranslation } from 'react-i18next'
import { useSiteSettings } from '../context/SiteSettingsContext'

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
  const { t } = useTranslation()
  const settings = useSiteSettings()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [active, setActive]     = useState(0)

  useEffect(() => {
    if (settings.projects_enabled === '0') { setLoading(false); return }
    projectsApi.list({ per_page: 5 })
      .then((res) => setProjects(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [settings.projects_enabled])

  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length)
  const next = () => setActive((a) => (a + 1) % projects.length)

  if (settings.projects_enabled === '0') return null
  if (!loading && projects.length === 0) return null

  return (
    <section className="luxury-dark-section py-14 sm:py-28 px-4 xs:px-5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 sm:mb-14">
          <div>
            <p className="mb-2 sm:mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#BA1932' }}>{t('sections.projectsLabel')}</p>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white leading-tight mb-2 sm:mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", letterSpacing: '-0.01em' }}>
              {t('sections.newProjects')}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/40">{t('sections.projectsSub')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/projects" className="hidden sm:flex items-center gap-1.5 font-semibold text-sm mr-2 transition-all duration-300 hover:gap-2.5" style={{ color: '#BA1932' }}>
              {t('sections.viewAll')} <ArrowRight size={15} />
            </Link>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #730D26, #BA1932)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.40)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #730D26, #BA1932)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.40)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 sm:overflow-hidden snap-x snap-mandatory sm:snap-none scrollbar-none">
            {projects.map((project, i) => {
              const rawImg = Array.isArray(project.images) ? project.images[0] : project.image
              const imgUrl = rawImg
                ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.VITE_API_URL || ''}/storage/${rawImg}`)
                : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
              const isActive = i === active

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug || project.id}`}
                  onClick={() => setActive(i)}
                  className="relative shrink-0 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-1"
                  style={{
                    height: '380px',
                    minWidth: isActive ? '260px' : '160px',
                    width: isActive ? '260px' : '160px',
                    boxShadow: isActive ? '0 16px 48px rgba(115,13,38,0.40)' : '0 4px 24px rgba(0,0,0,0.25)'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0" style={{
                    background: isActive
                      ? 'linear-gradient(to top, rgba(115,13,38,0.92) 0%, rgba(0,0,0,0.30) 50%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)'
                  }} />

                  {isActive && (
                    <div className="absolute top-4 left-4">
                      <span className="glass-pill text-[10px]">
                        <Building size={9} /> {project.investor?.name || 'Developer'}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-base leading-tight mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                      {project.name}
                    </h3>
                    {isActive && (
                      <>
                        <p className="text-white/55 text-xs mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">{t('property.from')}</div>
                            <div className="font-bold text-base" style={{ color: '#f5748a' }}>{formatPrice(project.price_from)}</div>
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
        <div className="flex gap-2 justify-center mt-8">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === active ? '24px' : '8px',
                height: '8px',
                background: i === active ? '#BA1932' : 'rgba(255,255,255,0.20)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
