import { useEffect, useState, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { propertiesApi } from '../api/client'

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
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await propertiesApi.filters()
        const data = res?.data
        if (Array.isArray(data?.cities) && data.cities.length > 0) {
          setCities(data.cities)
          return
        }
        throw new Error('no cities')
      } catch {
        try {
          const res = await propertiesApi.list({ per_page: 100 })
          const props = Array.isArray(res?.data) ? res.data : []
          setCities(extractCitiesFromProperties(props))
        } catch {
          setCities([])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' })
    }
  }

  if (!loading && cities.length === 0) return null

  return (
    <section className="py-20 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Prime Locations</p>
            <h2 className="section-title text-3xl">Explore Luxury Neighborhoods</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/neighborhoods" className="section-link hidden sm:flex mr-4">
              View All Neighborhoods
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shrink-0 w-60 h-72 rounded-3xl bg-gray-200 animate-pulse snap-start" />
              ))
            : cities.map((city) => (
                <Link
                  key={city.id}
                  to={`/properties?city_id=${city.id}`}
                  className="relative shrink-0 w-60 h-72 rounded-3xl overflow-hidden group cursor-pointer snap-start"
                >
                  <img
                    src={CITY_IMAGES[city.name] || DEFAULT_IMAGE}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-xl mb-1">{city.name}</h3>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
