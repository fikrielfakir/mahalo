import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import Footer from '../components/Footer'
import { propertiesApi } from '../api/client'

const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+']

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)

  const [search,    setSearch]    = useState(searchParams.get('search') || '')
  const [type,      setType]      = useState(searchParams.get('type') || '')
  const [bedrooms,  setBedrooms]  = useState(searchParams.get('number_bedroom') || '')
  const [minPrice,  setMinPrice]  = useState(searchParams.get('min_price') || '')
  const [maxPrice,  setMaxPrice]  = useState(searchParams.get('max_price') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')
  const [showPriceMenu, setShowPriceMenu] = useState(false)

  const cityId   = searchParams.get('city_id')
  const featured = searchParams.get('is_featured')

  const fetchProperties = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = { per_page: 12, page }
    if (search)     params.search           = search
    if (type)       params.type             = type
    if (featured)   params.is_featured      = 1
    if (cityId)     params.city_id          = cityId
    if (bedrooms && bedrooms !== 'Any') params.number_bedroom = bedrooms === '5+' ? 5 : parseInt(bedrooms)
    if (minPrice)   params.min_price        = minPrice
    if (maxPrice)   params.max_price        = maxPrice
    if (categoryId) params.category_id      = categoryId

    propertiesApi.list(params)
      .then((res) => {
        setProperties(Array.isArray(res?.data) ? res.data : [])
        setMeta(res?.meta || null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [search, type, page, cityId, featured, bedrooms, minPrice, maxPrice, categoryId])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleSearch = () => { setPage(1); fetchProperties() }

  const clearCity = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('city_id')
    setSearchParams(next)
  }

  const clearCategory = () => { setCategoryId(''); setPage(1) }
  const clearBedrooms = () => { setBedrooms(''); setPage(1) }
  const clearPrice = () => { setMinPrice(''); setMaxPrice(''); setPage(1) }

  const hasActiveFilters = bedrooms || minPrice || maxPrice || categoryId || cityId

  const pageTitle = featured ? 'Featured Properties'
    : type === 'rent' ? 'Properties for Rent'
    : type === 'sale' ? 'Properties for Sale'
    : 'All Properties'

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      <Navbar />

      <div className="pt-24 pb-8 px-5 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="section-label mb-1.5">Real Estate</p>
          <h1 className="text-3xl font-bold text-navy">{pageTitle}</h1>
          <p className="text-navy/45 text-sm mt-1.5">
            {meta ? `${meta.total} properties found` : 'Discover premium properties'}
          </p>
        </div>

        {/* Filter bar */}
        <div
          className="flex flex-wrap gap-2.5 items-center p-3 rounded-3xl shadow-card mb-4"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}
        >
          {/* Search */}
          <div className="flex-1 min-w-48 flex items-center gap-2.5 bg-surface rounded-2xl px-4 py-2.5">
            <Search size={15} className="text-gold shrink-0" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm font-medium text-navy outline-none placeholder-navy/30"
            />
          </div>

          {/* Type */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-surface">
            {[['', 'All'], ['sale', 'Buy'], ['rent', 'Rent']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setType(val); setPage(1) }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  type === val ? 'bg-navy text-white shadow-sm' : 'text-navy/55 hover:text-navy hover:bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <select
              value={bedrooms}
              onChange={(e) => { setBedrooms(e.target.value); setPage(1) }}
              className={`appearance-none pl-3 pr-7 py-2.5 rounded-2xl text-sm font-semibold outline-none cursor-pointer transition-all ${
                bedrooms ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'
              }`}
            >
              <option value="">Bedrooms</option>
              {['1', '2', '3', '4', '5+'].map(b => (
                <option key={b} value={b}>{b} {b === '5+' ? '+' : ''} bed{b !== '1' ? 's' : ''}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
          </div>

          {/* Price range */}
          <div className="relative">
            <button
              onClick={() => setShowPriceMenu(p => !p)}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                (minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'
              }`}
            >
              {minPrice || maxPrice ? `${minPrice ? minPrice + 'K' : '0'} – ${maxPrice ? maxPrice + 'K' : '∞'} MAD` : 'Price'}
              <ChevronDown size={13} className="text-navy/40" />
            </button>
            {showPriceMenu && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-card-hover p-4 min-w-[220px] border border-gray-100">
                <p className="text-navy/50 text-xs font-semibold mb-3 uppercase tracking-wide">Price range (K MAD)</p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { clearPrice(); setShowPriceMenu(false) }} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 hover:border-navy/30 transition-colors">
                    Clear
                  </button>
                  <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProperties() }} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-navy text-white hover:opacity-90 transition-opacity">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active filter pills */}
          {cityId && (
            <button onClick={clearCity} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
              City filter <X size={12} />
            </button>
          )}
          {categoryId && (
            <button onClick={clearCategory} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
              Category filter <X size={12} />
            </button>
          )}

          <button onClick={handleSearch} className="btn-gold py-2.5 px-5 text-sm">
            Search
          </button>
        </div>

        {/* Active filter summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-navy/40 text-xs font-medium">Active filters:</span>
            {cityId && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">City</span>}
            {bedrooms && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{bedrooms} bedroom{bedrooms !== '1' && 's'}</span>}
            {(minPrice || maxPrice) && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{minPrice || '0'}K – {maxPrice || '∞'}K MAD</span>}
            {categoryId && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">Category</span>}
            <button onClick={() => { clearPrice(); clearBedrooms(); clearCategory(); clearCity() }} className="text-xs text-navy/40 hover:text-red-500 underline transition-colors">Clear all</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="pb-20 px-5 max-w-7xl mx-auto">
        {error ? (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg mb-4">Failed to load properties.</p>
            <button onClick={fetchProperties} className="btn-gold">Retry</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                : properties.map((p) => <PropertyCard key={p.id} property={p} />)
              }
            </div>

            {!loading && properties.length === 0 && (
              <div className="text-center py-24">
                <p className="text-navy/40 text-lg">No properties found</p>
                {hasActiveFilters && (
                  <button onClick={() => { clearPrice(); clearBedrooms(); clearCategory() }} className="mt-4 btn-gold text-sm">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && meta && meta.last_page > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-semibold disabled:opacity-30 hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 bg-white shadow-sm"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => {
                    const p = i + 1
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          p === page ? 'bg-navy text-white shadow-sm' : 'text-navy/50 hover:bg-navy/6 hover:text-navy'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-semibold disabled:opacity-30 hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 bg-white shadow-sm"
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
