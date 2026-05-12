import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import Footer from '../components/Footer'
import { propertiesApi } from '../api/client'

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const fetchProperties = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = { per_page: 12, page }
    if (search) params.search = search
    if (type) params.type = type
    if (searchParams.get('is_featured')) params.is_featured = 1

    propertiesApi.list(params)
      .then((res) => {
        setProperties(Array.isArray(res?.data) ? res.data : [])
        setMeta(res?.meta || null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [type, page, searchParams])

  useEffect(() => { fetchProperties() }, [type, page])

  const handleSearch = () => {
    setPage(1)
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {type === 'rent' ? 'Properties for Rent' : type === 'sale' ? 'Properties for Sale' : 'All Properties'}
          </h1>
          <p className="text-navy/50">
            {meta ? `${meta.total} properties found` : 'Discover premium properties across Morocco'}
          </p>
        </div>

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

          <button onClick={handleSearch} className="btn-gold py-2.5">
            Search
          </button>
        </div>

        {error ? (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg">Failed to load properties. Please try again.</p>
            <button onClick={fetchProperties} className="btn-gold mt-4">Retry</button>
          </div>
        ) : (
          <>
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

            {!loading && meta && meta.last_page > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-medium disabled:opacity-30 hover:bg-navy hover:text-white transition-all"
                >
                  Previous
                </button>
                <span className="px-5 py-2.5 text-navy/50 text-sm">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-medium disabled:opacity-30 hover:bg-navy hover:text-white transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
