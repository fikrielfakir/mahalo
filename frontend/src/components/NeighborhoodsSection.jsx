import { useEffect, useState, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { propertiesApi } from '../api/client'
import { useTranslation } from 'react-i18next'

const CITY_IMAGES = {
  'Casablanca':  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
  'Marrakech':   'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80&auto=format&fit=crop',
  'Rabat':       'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80&auto=format&fit=crop',
  'Tanger':      'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600&q=80&auto=format&fit=crop',
  'Agadir':      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80&auto=format&fit=crop',
  'Fès':         'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80&auto=format&fit=crop',
  'Fes':         'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80&auto=format&fit=crop',
  'Meknès':      'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&q=80&auto=format&fit=crop',
  'Essaouira':   'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=600&q=80&auto=format&fit=crop',
  'Ouarzazate':  'https://images.unsplash.com/photo-1548532928-b34e3be62fc3?w=600&q=80&auto=format&fit=crop',
  'Paris':       'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80&auto=format&fit=crop',
  'London':      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&auto=format&fit=crop',
  'New York City': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80&auto=format&fit=crop',
  'New York':    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80&auto=format&fit=crop',
  'Dubai':       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format&fit=crop',
  'Tokyo':       'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80&auto=format&fit=crop',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80&auto=format&fit=crop'

function extractCitiesFromProperties(properties) {
  const seen = new Set()
  const cities = []
  for (const p of properties) {
    if (p.city && p.city.id && !seen.has(p.city.id)) {
      seen.add(p.city.id)
      cities.push(p.city)
    }
  }
  return cities
}

export default function NeighborhoodsSection() {
  const { t } = useTranslation()
  const [cities, setCities]   = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef             = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const res  = await propertiesApi.filters()
        const data = res?.data
        if (Array.isArray(data?.cities) && data.cities.length > 0) {
          setCities(data.cities); return
        }
        throw new Error('no cities')
      } catch {
        try {
          const res   = await propertiesApi.list({ per_page: 100 })
          const props = Array.isArray(res?.data) ? res.data : []
          setCities(extractCitiesFromProperties(props))
        } catch {
          setCities([])
        }
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  if (!loading && cities.length === 0) return null

  return (
    <section className="py-28 overflow-hidden relative" style={{
      background: 'linear-gradient(180deg, #F2EDE8 0%, #EAE4DE 100%)'
    }}>
      {/* Soft ambient glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 50%, rgba(115,13,38,0.05) 0%, transparent 70%)'
      }} />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="section-label mb-3">{t('sections.primeLabel')}</p>
            <h2 className="section-title text-4xl mb-3">{t('sections.neighborhoods')}</h2>
            <p className="text-sm font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>{t('sections.neighborhoodsSub')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/neighborhoods" className="section-link hidden sm:flex mr-3">
              {t('sections.viewAll')} <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 bg-white text-navy shadow-sm"
              style={{ border: '1px solid rgba(115,13,38,0.10)', boxShadow: '0 2px 12px rgba(115,13,38,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #730D26, #BA1932)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#730D26'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(115,13,38,0.08)' }}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 bg-white text-navy shadow-sm"
              style={{ border: '1px solid rgba(115,13,38,0.10)', boxShadow: '0 2px 12px rgba(115,13,38,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #730D26, #BA1932)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#730D26'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(115,13,38,0.08)' }}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-64 h-80 rounded-3xl skeleton snap-start" />
              ))
            : cities.map((city) => (
                <Link
                  key={city.id}
                  to={`/properties?city_id=${city.id}`}
                  className="relative shrink-0 w-64 h-80 rounded-3xl overflow-hidden group cursor-pointer snap-start transition-all duration-400 hover:-translate-y-2"
                  style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.10)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,13,38,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(115,13,38,0.10)'}
                >
                  <img
                    src={CITY_IMAGES[city.name] || DEFAULT_IMAGE}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(115,13,38,0.85) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)'
                  }} />

                  <div className="absolute top-4 left-4">
                    <span className="glass-pill text-[10px]">
                      <MapPin size={9} /> {t('sections.explore')}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-xl leading-tight mb-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                      {city.name}
                    </h3>
                    <p className="text-white/55 text-xs font-medium flex items-center gap-1">
                      {t('sections.viewProperties')} <ArrowRight size={10} />
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
