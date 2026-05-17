import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, ChevronDown, LayoutGrid, Map } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard'
import Footer from '../components/Footer'
import MapView from '../components/MapView'
import { propertiesApi } from '../api/client'
import SEOHead from '../components/SEOHead'
import { useTranslation } from 'react-i18next'

function formatPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K MAD`
  return `${n} MAD`
}

function CompactPropertyCard({ property, isActive, onClick, cardRef }) {
  const img = property.image
    ? property.image.startsWith('http') ? property.image : `/storage/${property.image}`
    : null
  const hasCoords = property.latitude && property.longitude
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isActive ? 'bg-[#BA1932]/8 border-l-4 border-l-[#BA1932]' : 'hover:bg-gray-50'
      }`}
    >
      {img ? (
        <img src={img} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" onError={e => e.target.style.display = 'none'} />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-xs">No img</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm truncate leading-tight">{property.name}</p>
        <p className="text-navy/45 text-xs truncate mt-0.5">{property.city?.name || property.location}</p>
        {property.price && (
          <p className="text-[#BA1932] font-bold text-sm mt-1">{formatPrice(property.price)}</p>
        )}
        {!hasCoords && <span className="text-[10px] text-gray-300 mt-0.5 block">No map location</span>}
      </div>
      <Link
        to={`/properties/${property.slug}`}
        onClick={e => e.stopPropagation()}
        className="shrink-0 self-center text-xs text-navy/40 hover:text-[#BA1932] transition-colors"
      >
        →
      </Link>
    </div>
  )
}

export default function Properties() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)
  const [viewMode, setViewMode]     = useState('grid')
  const [activeId, setActiveId]     = useState(null)

  const [search,    setSearch]    = useState(searchParams.get('search') || '')
  const [type,      setType]      = useState(searchParams.get('type') || '')
  const [bedrooms,  setBedrooms]  = useState(searchParams.get('number_bedroom') || '')
  const [minPrice,  setMinPrice]  = useState(searchParams.get('min_price') || '')
  const [maxPrice,  setMaxPrice]  = useState(searchParams.get('max_price') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')
  const [showPriceMenu, setShowPriceMenu] = useState(false)

  const cityId   = searchParams.get('city_id')
  const featured = searchParams.get('is_featured')

  const cardRefs = useRef({})

  const fetchProperties = useCallback(() => {
    setLoading(true)
    setError(false)
    const isMap = viewMode === 'map'
    const params = { per_page: isMap ? 100 : 12, page: isMap ? 1 : page }
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
  }, [search, type, page, cityId, featured, bedrooms, minPrice, maxPrice, categoryId, viewMode])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleSearch = () => { setPage(1); fetchProperties() }
  const clearCity     = () => { const n = new URLSearchParams(searchParams); n.delete('city_id'); setSearchParams(n) }
  const clearCategory = () => { setCategoryId(''); setPage(1) }
  const clearBedrooms = () => { setBedrooms(''); setPage(1) }
  const clearPrice    = () => { setMinPrice(''); setMaxPrice(''); setPage(1) }

  const hasActiveFilters = bedrooms || minPrice || maxPrice || categoryId || cityId

  const pageTitle = featured ? t('sections.featured')
    : type === 'rent' ? t('filters.forRent')
    : type === 'sale' ? t('filters.forSale')
    : t('filters.all') + ' ' + t('filters.realEstate')

  const mapMarkers = properties
    .filter(p => p.latitude && p.longitude)
    .map(p => ({
      id: p.id,
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      title: p.name,
      subtitle: p.city?.name || p.location || '',
      rawPrice: p.price,
      image: p.image ? (p.image.startsWith('http') ? p.image : `/storage/${p.image}`) : null,
      href: `/properties/${p.slug}`,
    }))

  const handleMarkerClick = (id) => {
    setActiveId(id)
    const ref = cardRefs.current[id]
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const filterBar = (
    <div className="mb-4 space-y-2">
      {/* ── Mobile layout (< md): two rows, all buttons visible ── */}
      <div className="md:hidden space-y-2">

        {/* Row 1: Search + Search button only */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-card"
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <Search size={14} className="text-gold shrink-0" />
            <input
              type="text"
              placeholder={t('filters.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder-gray-400 min-w-0"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 touch-manip">
                <X size={13} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="shrink-0 h-11 px-4 rounded-2xl text-sm font-semibold text-white touch-manip"
            style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)' }}
          >
            {t('common.search')}
          </button>
        </div>

        {/* Row 2: Type pills + View toggle */}
        <div className="flex gap-2 items-center">
          {/* Type pills */}
          <div className="flex flex-1 gap-1 p-1 rounded-2xl bg-white shadow-card"
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            {[['', t('filters.all')], ['sale', t('filters.buy')], ['rent', t('filters.rent')]].map(([val, label]) => (
              <button key={val} onClick={() => { setType(val); setPage(1) }}
                className={`flex-1 px-2 py-2 rounded-xl text-sm font-semibold transition-all touch-manip whitespace-nowrap ${type === val ? 'bg-navy text-white shadow-sm' : 'text-gray-600'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-0.5 p-1 rounded-2xl bg-white shadow-card shrink-0"
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <button onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all touch-manip ${viewMode === 'grid' ? 'bg-navy text-white shadow-sm' : 'text-gray-500'}`}>
              <LayoutGrid size={15} />
            </button>
            <button onClick={() => setViewMode('map')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all touch-manip ${viewMode === 'map' ? 'bg-navy text-white shadow-sm' : 'text-gray-500'}`}>
              <Map size={15} />
            </button>
          </div>
        </div>

        {/* Row 3: Bedrooms + Price */}
        <div className="flex gap-2 items-center">
          {/* Bedrooms */}
          <div className="relative flex-1 min-w-0">
            <select
              value={bedrooms}
              onChange={(e) => { setBedrooms(e.target.value); setPage(1) }}
              className={`w-full appearance-none pl-3 pr-7 py-2.5 rounded-2xl text-sm font-semibold outline-none cursor-pointer shadow-card ${bedrooms ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
              style={{ border: '1px solid rgba(200,200,200,0.5)' }}
            >
              <option value="">{t('filters.bedrooms')}</option>
              {['1', '2', '3', '4', '5+'].map(b => (
                <option key={b} value={b}>{b}{b !== '5+' ? '' : '+'} {b !== '1' ? t('filters.beds') : t('filters.bed')}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Price */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setShowPriceMenu(p => !p)}
              className={`w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-2xl text-sm font-semibold shadow-card touch-manip ${(minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
              style={{ border: '1px solid rgba(200,200,200,0.5)' }}
            >
              <span className="truncate">{minPrice || maxPrice ? `${minPrice || '0'}K–${maxPrice || '∞'}K` : t('filters.price')}</span>
              <ChevronDown size={13} className="text-gray-400 shrink-0" />
            </button>
            {showPriceMenu && (
              <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-card-hover p-4 w-[220px] border border-gray-100">
                <p className="text-navy/50 text-xs font-semibold mb-3 uppercase tracking-wide">{t('filters.priceRangeLabel')}</p>
                <div className="flex gap-2 mb-3">
                  <input type="number" placeholder={t('filters.min')} value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="number" placeholder={t('filters.max')} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 touch-manip">{t('filters.clear')}</button>
                  <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProperties() }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-navy text-white touch-manip">{t('filters.apply')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: active filter chips */}
        {(cityId || categoryId) && (
          <div className="flex gap-2 flex-wrap">
            {cityId && (
              <button onClick={clearCity} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-xs touch-manip">
                {t('filters.cityFilter')} <X size={11} />
              </button>
            )}
            {categoryId && (
              <button onClick={clearCategory} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-xs touch-manip">
                {t('filters.categoryFilter')} <X size={11} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop md+: original wrapped layout */}
      <div
        className="hidden md:flex flex-wrap gap-2.5 items-center p-3 rounded-3xl shadow-card"
        style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(200,200,200,0.5)' }}
      >
        <div className="flex-1 min-w-48 flex items-center gap-2.5 bg-surface rounded-2xl px-4 py-2.5">
          <Search size={15} className="text-gold shrink-0" />
          <input
            type="text" placeholder={t('filters.searchPlaceholder')} value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-sm font-medium text-navy outline-none placeholder-navy/30"
          />
        </div>

        <div className="flex gap-1.5 p-1 rounded-2xl bg-surface">
          {[['', t('filters.all')], ['sale', t('filters.buy')], ['rent', t('filters.rent')]].map(([val, label]) => (
            <button key={val} onClick={() => { setType(val); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${type === val ? 'bg-navy text-white shadow-sm' : 'text-navy/55 hover:text-navy hover:bg-white'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          <select value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setPage(1) }}
            className={`appearance-none pl-3 pr-7 py-2.5 rounded-2xl text-sm font-semibold outline-none cursor-pointer transition-all ${bedrooms ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'}`}>
            <option value="">{t('filters.bedrooms')}</option>
            {['1', '2', '3', '4', '5+'].map(b => <option key={b} value={b}>{b}{b === '5+' ? '+' : ''} {b !== '1' ? t('filters.beds') : t('filters.bed')}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
        </div>

        <div className="relative">
          <button onClick={() => setShowPriceMenu(p => !p)}
            className={`flex items-center gap-1.5 pl-3 pr-2 py-2.5 rounded-2xl text-sm font-semibold transition-all ${(minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'}`}>
            {minPrice || maxPrice ? `${minPrice || '0'}K – ${maxPrice || '∞'}K MAD` : t('filters.price')}
            <ChevronDown size={13} className="text-navy/40" />
          </button>
          {showPriceMenu && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-card-hover p-4 min-w-[220px] border border-gray-100">
              <p className="text-navy/50 text-xs font-semibold mb-3 uppercase tracking-wide">{t('filters.priceRangeLabel')}</p>
              <div className="flex gap-2 mb-3">
                <input type="number" placeholder={t('filters.min')} value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                <input type="number" placeholder={t('filters.max')} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 hover:border-navy/30 transition-colors">{t('filters.clear')}</button>
                <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProperties() }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-navy text-white hover:opacity-90 transition-opacity">{t('filters.apply')}</button>
              </div>
            </div>
          )}
        </div>

        {cityId && (
          <button onClick={clearCity} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
            {t('filters.cityFilter')} <X size={12} />
          </button>
        )}
        {categoryId && (
          <button onClick={clearCategory} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
            {t('filters.categoryFilter')} <X size={12} />
          </button>
        )}

        <button onClick={handleSearch} className="btn-gold py-2.5 px-5 text-sm">{t('common.search')}</button>

        <div className="flex gap-1 p-1 rounded-2xl bg-surface ml-auto">
          <button onClick={() => setViewMode('grid')} title="Grid view"
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-navy text-white shadow-sm' : 'text-navy/40 hover:text-navy'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('map')} title="Map view"
            className={`p-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-navy text-white shadow-sm' : 'text-navy/40 hover:text-navy'}`}>
            <Map size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  if (viewMode === 'map') {
    return (
      <div className="flex flex-col" style={{ height: '100vh' }}>
        <SEOHead
          title={pageTitle}
          description={`Browse verified ${pageTitle.toLowerCase()} across Morocco. Filter by city, price, bedrooms, and property type. Find your ideal home with Mahalo Real Estate.`}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: pageTitle, url: '/properties' },
          ]}
        />
        <Navbar />
        <div className="pt-20 pb-3 px-5" style={{ background: '#F5F5F5' }}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="section-label mb-0.5">{t('filters.realEstate')}</p>
                <h1 className="text-2xl font-bold text-navy">{pageTitle}</h1>
              </div>
              <span className="text-navy/45 text-sm">{mapMarkers.length} {t('filters.onMap')} · {properties.length} {t('filters.total')}</span>
            </div>
            {filterBar}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-100 shadow-sm">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                      <div className="h-2 bg-gray-200 rounded w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-navy/40 text-sm">{t('filters.noProperties')}</div>
            ) : (
              properties.map(p => (
                <CompactPropertyCard
                  key={p.id}
                  property={p}
                  isActive={activeId === p.id}
                  onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                  cardRef={el => { cardRefs.current[p.id] = el }}
                />
              ))
            )}
          </div>

          <div className="flex-1">
            <MapView
              markers={mapMarkers}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              height="100%"
              zoom={6}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      <SEOHead
        title={pageTitle}
        description={`Browse verified ${pageTitle.toLowerCase()} across Morocco. Filter by city, price, bedrooms, and property type. Find your ideal home with Mahalo Real Estate.`}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: pageTitle, url: '/properties' },
        ]}
      />
      <Navbar />
      <div className="pt-24 pb-8 px-5 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="section-label mb-1.5">{t('filters.realEstate')}</p>
          <h1 className="text-3xl font-bold text-navy">{pageTitle}</h1>
          <p className="text-navy/45 text-sm mt-1.5">{meta ? t('filters.propertiesFound', { count: meta.total }) : t('filters.discoverPremium')}</p>
        </div>
        {filterBar}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-navy/40 text-xs font-medium">{t('filters.activeFilters')}:</span>
            {cityId && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{t('filters.cityFilter')}</span>}
            {bedrooms && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{bedrooms} {bedrooms !== '1' ? t('filters.beds') : t('filters.bed')}</span>}
            {(minPrice || maxPrice) && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{minPrice || '0'}K – {maxPrice || '∞'}K MAD</span>}
            {categoryId && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{t('filters.categoryFilter')}</span>}
            <button onClick={() => { clearPrice(); clearBedrooms(); clearCategory(); clearCity() }}
              className="text-xs text-navy/40 hover:text-red-500 underline transition-colors">{t('filters.clearAll')}</button>
          </div>
        )}
      </div>

      <div className="pb-20 px-5 max-w-7xl mx-auto">
        {error ? (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg mb-4">{t('filters.failedLoad')}</p>
            <button onClick={fetchProperties} className="btn-gold">{t('common.retry')}</button>
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
                <p className="text-navy/40 text-lg">{t('filters.noProperties')}</p>
                {hasActiveFilters && (
                  <button onClick={() => { clearPrice(); clearBedrooms(); clearCategory() }} className="mt-4 btn-gold text-sm">
                    {t('filters.clearFilters')}
                  </button>
                )}
              </div>
            )}
            {!loading && meta && meta.last_page > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-semibold disabled:opacity-30 hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 bg-white shadow-sm">
                  {t('common.previous')}
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => {
                    const p = i + 1
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${p === page ? 'bg-navy text-white shadow-sm' : 'text-navy/50 hover:bg-navy/6 hover:text-navy'}`}>
                        {p}
                      </button>
                    )
                  })}
                </div>
                <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-semibold disabled:opacity-30 hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 bg-white shadow-sm">
                  {t('common.next')}
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
