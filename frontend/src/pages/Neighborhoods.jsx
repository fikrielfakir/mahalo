import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { propertiesApi } from '../api/client'

const CITY_IMAGES = {
  'Casablanca':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
  'Marrakech':     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop',
  'Rabat':         'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80&auto=format&fit=crop',
  'Tanger':        'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800&q=80&auto=format&fit=crop',
  'Agadir':        'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80&auto=format&fit=crop',
  'Fès':           'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop',
  'Fes':           'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop',
  'Meknès':        'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=80&auto=format&fit=crop',
  'Essaouira':     'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80&auto=format&fit=crop',
  'Ouarzazate':    'https://images.unsplash.com/photo-1548532928-b34e3be62fc3?w=800&q=80&auto=format&fit=crop',
  'Paris':         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80&auto=format&fit=crop',
  'London':        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80&auto=format&fit=crop',
  'New York City': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80&auto=format&fit=crop',
  'New York':      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80&auto=format&fit=crop',
  'Dubai':         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80&auto=format&fit=crop',
  'Tokyo':         'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&auto=format&fit=crop',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop'

function extractCitiesFromProperties(properties) {
  const seen = new Set()
  const cities = []
  for (const p of properties) {
    if (p.city?.id && !seen.has(p.city.id)) {
      seen.add(p.city.id)
      cities.push(p.city)
    }
  }
  return cities
}

export default function Neighborhoods() {
  const [cities, setCities]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

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
          const ext   = extractCitiesFromProperties(props)
          if (ext.length > 0) setCities(ext)
          else setError(true)
        } catch { setError(true) }
      } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      <Navbar />
      <div className="pt-24 pb-20 px-5 max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="section-label mb-2">Prime Locations</p>
          <h1 className="text-3xl font-bold text-navy">Explore Neighborhoods</h1>
          <p className="text-navy/45 text-sm mt-1.5">Discover the finest areas across the globe</p>
        </div>

        {error ? (
          <div className="text-center py-24 text-navy/40">Failed to load neighborhoods.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-3xl skeleton h-72" />
                ))
              : cities.length === 0 ? (
                  <div className="col-span-3 text-center py-24 text-navy/40">No neighborhoods available.</div>
                )
              : cities.map((city) => (
                  <Link
                    key={city.id}
                    to={`/properties?city_id=${city.id}`}
                    className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1.5 block"
                  >
                    <img
                      src={CITY_IMAGES[city.name] || DEFAULT_IMAGE}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />

                    {/* Glass pill */}
                    <div className="absolute top-4 left-4">
                      <span className="glass-pill text-[10px]">
                        <MapPin size={9} /> Explore
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-2xl mb-0.5">{city.name}</h3>
                      <p className="text-white/50 text-xs font-medium group-hover:text-white/70 transition-colors">
                        Browse properties →
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
