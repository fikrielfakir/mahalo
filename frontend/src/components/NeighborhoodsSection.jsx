import { useEffect, useState, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
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

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  if (!loading && cities.length === 0) return null

  return (
    <section className="py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F7F8FC 0%, #EEEEF8 100%)' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Prime Locations</p>
            <h2 className="section-title text-3xl">Explore Neighborhoods</h2>
            <p className="text-navy/45 text-sm mt-2">Discover the finest areas to live</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/neighborhoods" className="section-link hidden sm:flex mr-3">
              View All
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-navy/10 bg-white flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-navy/10 bg-white flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-56 h-72 rounded-3xl skeleton snap-start" />
              ))
            : cities.map((city) => (
                <Link
                  key={city.id}
                  to={`/properties?city_id=${city.id}`}
                  className="relative shrink-0 w-56 h-72 rounded-3xl overflow-hidden group cursor-pointer snap-start shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1.5"
                >
                  <img
                    src={CITY_IMAGES[city.name] || DEFAULT_IMAGE}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />

                  {/* Glass pill at top */}
                  <div className="absolute top-3 left-3">
                    <span className="glass-pill text-[10px]">
                      <MapPin size={9} /> Explore
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg leading-tight mb-0.5">{city.name}</h3>
                    <p className="text-white/55 text-xs font-medium">View properties →</p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
