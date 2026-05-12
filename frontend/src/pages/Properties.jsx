import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import Footer from '../components/Footer'
import { propertiesApi } from '../api/client'

const MOCK_PROPERTIES = [
  { id: 1, name: 'Villa with Pool — Ain Diab', price: 3800000, number_bedroom: 4, number_bathroom: 3, square: 320, is_featured: true, city: { name: 'Casablanca' } },
  { id: 2, name: 'Modern Apartment — Maarif', price: 2450000, number_bedroom: 3, number_bathroom: 2, square: 150, is_new: true, city: { name: 'Casablanca' } },
  { id: 3, name: 'Luxury Villa — Hivernage', price: 5600000, number_bedroom: 5, number_bathroom: 4, square: 450, city: { name: 'Marrakech' } },
  { id: 4, name: 'Contemporary Apartment', price: 1950000, number_bedroom: 2, number_bathroom: 2, square: 120, city: { name: 'Casablanca' } },
  { id: 5, name: 'Penthouse — Hassan II', price: 4200000, number_bedroom: 4, number_bathroom: 3, square: 280, is_featured: true, city: { name: 'Casablanca' } },
  { id: 6, name: 'Riad — Médina', price: 3100000, number_bedroom: 5, number_bathroom: 4, square: 380, city: { name: 'Marrakech' } },
  { id: 7, name: 'Sea View Apartment', price: 2800000, number_bedroom: 3, number_bathroom: 2, square: 170, city: { name: 'Tanger' } },
  { id: 8, name: 'Modern Villa — Souissi', price: 6500000, number_bedroom: 6, number_bathroom: 5, square: 520, is_featured: true, city: { name: 'Rabat' } },
]

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchProperties = () => {
    setLoading(true)
    const params = { per_page: 12, page }
    if (search) params.search = search
    if (type) params.type = type

    propertiesApi.list(params)
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data)
          setHasMore(!!res?.meta?.next_page_url)
        } else {
          setProperties(MOCK_PROPERTIES)
        }
      })
      .catch(() => setProperties(MOCK_PROPERTIES))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProperties() }, [type, page])

  const handleSearch = () => {
    setPage(1)
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {type === 'rent' ? 'Properties for Rent' : type === 'sale' ? 'Properties for Sale' : 'All Properties'}
          </h1>
          <p className="text-navy/50">Discover premium properties across Morocco</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-card p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48 flex items-center gap-2 bg-surface rounded-2xl px-4 py-2.5">
            <Search size={16} className="text-navy/40" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
            />
          </div>

          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1) }}
            className="bg-surface rounded-2xl px-4 py-2.5 text-sm font-medium text-navy outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          <button
            onClick={handleSearch}
            className="btn-gold py-2.5"
          >
            Search
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((p) => <PropertyCard key={p.id} property={p} />)
          }
        </div>

        {!loading && properties.length === 0 && (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg">No properties found</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
