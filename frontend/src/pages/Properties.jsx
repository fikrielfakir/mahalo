import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, ChevronDown, LayoutGrid, Map } from 'lucide-react'
import { isVideoPath, mediaUrl } from '../utils/media'
import Navbar from '../components/Navbar'
import PropertyCard, { PropertyCardSkeleton, ListPropertyCard, ListPropertyCardSkeleton } from '../components/PropertyCard'
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

function MobileMapCard({ property, isActive, onClick, cardRef }) {
  const [imgErr, setImgErr] = useState(false)
  const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=70&auto=format&fit=crop'
  const imgs = Array.isArray(property.images) ? property.images : []
  const firstImg = imgs.find(i => !isVideoPath(i))
  const img = imgErr ? FALLBACK
    : firstImg ? mediaUrl(firstImg)
    : property.image && !isVideoPath(property.image) ? mediaUrl(property.image)
    : FALLBACK
  const slug = (typeof property.slug === 'string' ? property.slug : property.slug?.key) || property.id

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`flex rounded-2xl overflow-hidden bg-white cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-[#BA1932]' : ''
      }`}
      style={{ boxShadow: isActive ? '0 4px 20px rgba(115,13,38,0.18)' : '0 2px 8px rgba(115,13,38,0.07)' }}
    >
      {/* Image */}
      <div className="w-24 shrink-0 overflow-hidden">
        <img src={img} alt={property.name} onError={() => setImgErr(true)}
          className="w-full h-full object-cover" style={{ minHeight: 96 }} />
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-between">
        <div>
          <p className="font-bold text-navy text-xs leading-tight line-clamp-1">{property.name}</p>
          {(property.city?.name || property.location) && (
            <p className="text-[10px] text-navy/45 mt-0.5 flex items-center gap-0.5 truncate">
              <span style={{ color: '#BA1932', fontSize: 8 }}>📍</span>
              {property.city?.name || property.location}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {property.number_bedroom > 0 && (
              <span className="text-[10px] text-navy/55 font-medium">{property.number_bedroom} ch</span>
            )}
            {property.number_bathroom > 0 && (
              <span className="text-[10px] text-navy/55 font-medium">{property.number_bathroom} sdb</span>
            )}
            {property.square && (
              <span className="text-[10px] text-navy/55 font-medium">{property.square} m²</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {property.price && (
            <span className="font-bold text-sm" style={{ color: '#BA1932' }}>{formatPrice(property.price)}</span>
          )}
          <Link
            to={`/properties/${slug}`}
            onClick={e => e.stopPropagation()}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-xl touch-manip"
            style={{ color: '#BA1932', background: 'rgba(115,13,38,0.07)' }}
          >
            Voir →
          </Link>
        </div>
      </div>
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
  const filterSentinelRef = useRef(null)
  const filterBarRef      = useRef(null)
  const [isFilterSticky, setIsFilterSticky] = useState(false)
  const [filterHeight,   setFilterHeight]   = useState(0)

  useEffect(() => {
    const sentinel = filterSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterSticky(!entry.isIntersecting)
        if (filterBarRef.current) setFilterHeight(filterBarRef.current.offsetHeight)
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const fetchProperties = useCallback(() => {
    setLoading(true)
    setError(false)
    const isMap = viewMode === 'map'
    const params = { per_page: isMap ? 20 : 12, page }
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
      image: (() => {
        const imgs = Array.isArray(p.images) ? p.images : []
        const firstImg = imgs.find(img => !isVideoPath(img))
        if (firstImg) return mediaUrl(firstImg)
        const firstVid = imgs.find(img => isVideoPath(img))
        if (firstVid && p.video_thumbnails?.[firstVid]) return p.video_thumbnails[firstVid]
        if (p.image && !isVideoPath(p.image)) return p.image.startsWith('http') ? p.image : `/storage/${p.image}`
        if (p.image && isVideoPath(p.image) && p.video_thumbnails?.[p.image]) return p.video_thumbnails[p.image]
        if (p.video_thumbnails) { const t = Object.values(p.video_thumbnails)[0]; if (t) return t }
        return null
      })(),
      href: `/properties/${p.slug || p.id}`,
    }))

  const handleMarkerClick = (id) => {
    setActiveId(id)
    const ref = cardRefs.current[id]
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // Compact 2-row filter used only on mobile in map view
  const mobileMapFilter = (
    <div className="space-y-1.5 mb-2">
      {/* Row 1: Search + Grid toggle */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-card"
          style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
          <Search size={13} className="text-gold shrink-0" />
          <input
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-xs font-medium text-gray-800 outline-none placeholder-gray-400 min-w-0"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }} className="text-gray-400 touch-manip">
              <X size={12} />
            </button>
          )}
        </div>
        <button onClick={() => setViewMode('grid')}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-card text-gray-500 shrink-0 touch-manip"
          style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
          <LayoutGrid size={15} />
        </button>
      </div>

      {/* Row 2: Type pills + Chambres + Prix — scrollable */}
      <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-0.5">
        {/* Type pills */}
        <div className="flex gap-0.5 p-0.5 rounded-xl bg-white shadow-card shrink-0"
          style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
          {[['', t('filters.all')], ['sale', t('filters.buy')], ['rent', t('filters.rent')]].map(([val, label]) => (
            <button key={val} onClick={() => { setType(val); setPage(1) }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all touch-manip whitespace-nowrap ${type === val ? 'bg-navy text-white' : 'text-gray-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Chambres */}
        <div className="relative shrink-0">
          <select value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setPage(1) }}
            className={`appearance-none pl-2.5 pr-6 py-1.5 rounded-xl text-[11px] font-semibold outline-none cursor-pointer shadow-card whitespace-nowrap ${bedrooms ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <option value="">{t('filters.bedrooms')}</option>
            {['1','2','3','4','5+'].map(b => <option key={b} value={b}>{b}{b==='5+'?'+':''} {b!=='1'?t('filters.beds'):t('filters.bed')}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Prix */}
        <div className="relative shrink-0">
          <button onClick={() => setShowPriceMenu(p => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold shadow-card touch-manip whitespace-nowrap ${(minPrice||maxPrice)?'bg-gold/10 text-gold':'bg-white text-gray-600'}`}
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            {minPrice||maxPrice ? `${minPrice||'0'}K–${maxPrice||'∞'}K` : t('filters.price')}
            <ChevronDown size={11} className="text-gray-400" />
          </button>
          {showPriceMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-2xl shadow-card-hover p-3 w-[200px] border border-gray-100">
              <div className="flex gap-1.5 mb-2">
                <input type="number" placeholder={t('filters.min')} value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-2 py-1.5 text-xs text-navy outline-none" />
                <input type="number" placeholder={t('filters.max')} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-2 py-1.5 text-xs text-navy outline-none" />
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 touch-manip">{t('filters.clear')}</button>
                <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProperties() }}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-navy text-white touch-manip">{t('filters.apply')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Active chips */}
        {cityId && (
          <button onClick={clearCity} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-[11px] touch-manip shrink-0">
            {t('filters.cityFilter')} <X size={10} />
          </button>
        )}
      </div>
    </div>
  )

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
      <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ background: '#F5F5F5' }}>
        <SEOHead
          title={pageTitle}
          description={`Browse verified ${pageTitle.toLowerCase()} across Morocco. Filter by city, price, bedrooms, and property type. Find your ideal home with Mahalo Real Estate.`}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: pageTitle, url: '/properties' },
          ]}
        />
        <Navbar />

        {/* ── Header + filters ──────────────────────────────── */}
        <div className="pt-16 lg:pt-24 pb-0 lg:pb-3 px-3 lg:px-5 flex-shrink-0">
          <div className="max-w-screen-xl mx-auto">
            {/* Mobile: compact single-row filter */}
            <div className="lg:hidden pt-2">{mobileMapFilter}</div>
            {/* Desktop: full title + filter bar */}
            <div className="hidden lg:block">
              <div className="mb-3">
                <p className="section-label mb-1">{t('filters.realEstate')}</p>
                <h1 className="text-2xl font-bold text-navy">{pageTitle}</h1>
              </div>
              {filterBar}
            </div>
          </div>
        </div>

        {/* ── Split layout: stacked on mobile, side-by-side on desktop ── */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden lg:gap-5 lg:px-5 lg:pb-4 lg:max-w-screen-xl lg:mx-auto lg:w-full">

          {/* Top (mobile) / Left (desktop): scrollable list */}
          <div className="flex flex-col min-h-0 flex-[0_0_47%] lg:flex-1 lg:min-w-0 px-3 lg:px-0 overflow-hidden">

            {/* Count row */}
            <div className="flex items-center justify-between py-2 flex-shrink-0">
              <p className="text-navy/50 text-xs font-semibold">
                {loading ? '…' : `${meta?.total ?? properties.length} ${t('filters.propertiesFound', { count: meta?.total ?? properties.length })}`}
              </p>
              {mapMarkers.length > 0 && (
                <span className="text-[10px] text-navy/35 font-medium">
                  {t('filters.onMap', { count: mapMarkers.length, total: meta?.total ?? properties.length })}
                </span>
              )}
            </div>

            {/* Scrollable property cards */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-2 lg:space-y-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <ListPropertyCardSkeleton key={i} />)
                : properties.length === 0
                  ? <div className="text-center py-12 text-navy/40 text-sm">{t('filters.noProperties')}</div>
                  : properties.map(p => (
                      <span key={p.id}>
                        {/* Compact card on mobile, full card on desktop */}
                        <span className="lg:hidden block">
                          <MobileMapCard
                            property={p}
                            isActive={activeId === p.id}
                            onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                            cardRef={el => { cardRefs.current[p.id] = el }}
                          />
                        </span>
                        <span className="hidden lg:block">
                          <ListPropertyCard
                            property={p}
                            isActive={activeId === p.id}
                            onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                            cardRef={el => { cardRefs.current[p.id] = el }}
                          />
                        </span>
                      </span>
                    ))
              }
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex-shrink-0 py-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-xl text-sm font-bold bg-white shadow-sm border border-gray-200 text-navy/60 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >←</button>
                <span className="text-xs text-navy/50 font-semibold">{page} / {meta.last_page}</span>
                <button
                  onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={page === meta.last_page}
                  className="w-8 h-8 rounded-xl text-sm font-bold bg-white shadow-sm border border-gray-200 text-navy/60 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >→</button>
              </div>
            )}
          </div>

          {/* Bottom (mobile) / Right (desktop): map — always visible */}
          <div className="flex-[0_0_53%] lg:flex-none lg:w-[420px] xl:lg:w-[500px] lg:flex-shrink-0 overflow-hidden lg:rounded-2xl shadow-lg">
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

        {/* Sentinel — when this scrolls behind the navbar the filter goes sticky */}
        <div ref={filterSentinelRef} style={{ height: 0 }} />

        {/* Spacer so content doesn't jump when filter lifts off */}
        {isFilterSticky && <div style={{ height: filterHeight + 16 }} />}

        {/* Sticky filter wrapper */}
        {isFilterSticky ? (
          <div
            className="fixed left-0 right-0 z-40 px-5 py-2.5 transition-all"
            style={{
              top: 64,
              background: '#F5F5F5',
              boxShadow: '0 4px 24px rgba(115,13,38,0.08)',
              borderBottom: '1px solid rgba(200,200,200,0.4)',
            }}
          >
            <div ref={filterBarRef} className="max-w-7xl mx-auto">
              {filterBar}
            </div>
          </div>
        ) : (
          <div ref={filterBarRef}>{filterBar}</div>
        )}

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
