import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, ChevronDown, LayoutGrid, Map, MapPin, Building, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MapView from '../components/MapView'
import { projectsApi, citiesApi } from '../api/client'
import SEOHead from '../components/SEOHead'
import { useTranslation } from 'react-i18next'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80',
]

function getImgUrl(project, index = 0) {
  const imgs = Array.isArray(project.images) ? project.images : []
  const first = imgs[0] || project.image
  if (!first) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  return first.startsWith('http') ? first : `/storage/${first}`
}

function formatPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  return n.toLocaleString('en-US') + ' MAD'
}

/* ─── Mobile compact card for map view ─────────────────────────────── */
function MobileMapProjectCard({ project, index, isActive, onClick, cardRef }) {
  const [imgErr, setImgErr] = useState(false)
  const img = imgErr ? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] : getImgUrl(project, index)

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`flex rounded-xl overflow-hidden bg-white cursor-pointer transition-all ${isActive ? 'ring-2 ring-[#BA1932]' : ''}`}
      style={{ height: 80, boxShadow: isActive ? '0 4px 16px rgba(115,13,38,0.18)' : '0 1px 6px rgba(115,13,38,0.08)' }}
    >
      <div className="w-20 shrink-0 overflow-hidden">
        <img src={img} alt={project.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 px-2.5 py-2 flex flex-col justify-between">
        <div>
          <p className="font-bold text-navy text-[11px] leading-tight line-clamp-1">{project.name}</p>
          {project.city?.name && (
            <p className="text-[10px] text-navy/45 mt-0.5 truncate">📍 {project.city.name}</p>
          )}
          {project.investor?.name && (
            <p className="text-[10px] text-navy/40 truncate">{project.investor.name}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {project.price_from && (
            <span className="font-bold text-xs" style={{ color: '#BA1932' }}>
              {formatPrice(project.price_from)}
            </span>
          )}
          <Link
            to={`/projects/${project.slug || project.id}`}
            onClick={e => e.stopPropagation()}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg touch-manip shrink-0"
            style={{ color: '#BA1932', background: 'rgba(115,13,38,0.07)' }}
          >
            Voir →
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Desktop horizontal card for map view list ─────────────────────── */
function ListProjectCard({ project, index, isActive, onClick, cardRef }) {
  const [imgErr, setImgErr] = useState(false)
  const img = imgErr ? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] : getImgUrl(project, index)

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`flex gap-3 rounded-2xl overflow-hidden bg-white cursor-pointer transition-all p-2.5 ${
        isActive ? 'ring-2 ring-[#BA1932] shadow-md' : 'hover:shadow-md'
      }`}
      style={{ boxShadow: isActive ? '0 4px 16px rgba(115,13,38,0.15)' : '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
        <img src={img} alt={project.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="font-bold text-navy text-sm leading-tight line-clamp-1">{project.name}</p>
        <div className="flex items-center gap-1 text-navy/45 text-xs mt-0.5">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{project.city?.name || '—'}</span>
        </div>
        {project.investor?.name && (
          <p className="text-[11px] text-navy/35 truncate mt-0.5">{project.investor.name}</p>
        )}
        <div className="flex items-center justify-between mt-1.5">
          {project.price_from && (
            <span className="font-bold text-sm" style={{ color: '#BA1932' }}>
              {formatPrice(project.price_from)}
            </span>
          )}
          <Link
            to={`/projects/${project.slug || project.id}`}
            onClick={e => e.stopPropagation()}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg touch-manip shrink-0 hover:opacity-80 transition-opacity"
            style={{ color: '#BA1932', background: 'rgba(115,13,38,0.07)' }}
          >
            Voir →
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Skeleton cards ────────────────────────────────────────────────── */
function GridProjectSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-card animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

function ListProjectCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-2.5 animate-pulse" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="w-24 h-20 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3.5 bg-gray-200 rounded w-4/5" />
        <div className="h-2.5 bg-gray-200 rounded w-2/5" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────────── */
export default function Projects() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)
  const [viewMode, setViewMode]     = useState('grid')
  const [activeId, setActiveId]     = useState(null)
  const [cities, setCities]         = useState([])

  const [search,     setSearch]     = useState(searchParams.get('search') || '')
  const [cityId,     setCityId]     = useState(searchParams.get('city_id') || '')
  const [minPrice,   setMinPrice]   = useState(searchParams.get('min_price') || '')
  const [maxPrice,   setMaxPrice]   = useState(searchParams.get('max_price') || '')
  const [featured,   setFeatured]   = useState(searchParams.get('is_featured') || '')
  const [showPriceMenu, setShowPriceMenu] = useState(false)

  const cardRefs         = useRef({})
  const filterSentinelRef = useRef(null)
  const filterBarRef      = useRef(null)
  const [isFilterSticky, setIsFilterSticky] = useState(false)
  const [filterHeight,   setFilterHeight]   = useState(0)

  // Sticky sentinel
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

  // Load cities for filter
  useEffect(() => {
    citiesApi.list().then(res => {
      const list = Array.isArray(res?.data) ? res.data : []
      setCities(list)
    }).catch(() => {})
  }, [])

  const fetchProjects = useCallback(() => {
    setLoading(true)
    setError(false)
    const isMap = viewMode === 'map'
    const params = { per_page: isMap ? 20 : 12, page }
    if (search)   params.search      = search
    if (cityId)   params.city_id     = cityId
    if (featured) params.is_featured = 1
    if (minPrice) params.min_price   = minPrice
    if (maxPrice) params.max_price   = maxPrice

    projectsApi.list(params)
      .then(res => {
        setProjects(Array.isArray(res?.data) ? res.data : [])
        setMeta(res?.meta || null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [search, cityId, featured, minPrice, maxPrice, page, viewMode])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleSearch  = () => { setPage(1); fetchProjects() }
  const clearCity     = () => { setCityId(''); setPage(1) }
  const clearPrice    = () => { setMinPrice(''); setMaxPrice(''); setPage(1) }
  const clearFeatured = () => { setFeatured(''); setPage(1) }

  const hasActiveFilters = cityId || minPrice || maxPrice || featured

  const mapMarkers = projects
    .filter(p => p.latitude && p.longitude)
    .map((p, i) => ({
      id: p.id,
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      title: p.name,
      subtitle: p.city?.name || '',
      rawPrice: p.price_from,
      image: getImgUrl(p, i),
      href: `/projects/${p.slug || p.id}`,
    }))

  const handleMarkerClick = (id) => {
    setActiveId(id)
    const ref = cardRefs.current[id]
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  /* ── Compact mobile filter for map view ─────────────── */
  const mobileMapFilter = (
    <div className="space-y-1.5 mb-2">
      {/* Row 1: Search + Grid toggle */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-card"
          style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
          <Search size={13} className="text-gold shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un projet…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
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

      {/* Row 2: City + Prix — scrollable */}
      <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-0.5">
        {/* City select */}
        <div className="relative shrink-0">
          <select value={cityId} onChange={e => { setCityId(e.target.value); setPage(1) }}
            className={`appearance-none pl-2.5 pr-6 py-1.5 rounded-xl text-[11px] font-semibold outline-none cursor-pointer shadow-card whitespace-nowrap ${cityId ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <option value="">Ville</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Prix */}
        <div className="relative shrink-0">
          <button onClick={() => setShowPriceMenu(p => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold shadow-card touch-manip whitespace-nowrap ${(minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            {minPrice || maxPrice ? `${minPrice || '0'}K–${maxPrice || '∞'}K` : 'Prix'}
            <ChevronDown size={11} className="text-gray-400" />
          </button>
          {showPriceMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-2xl shadow-card-hover p-3 w-[200px] border border-gray-100">
              <div className="flex gap-1.5 mb-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-2 py-1.5 text-xs text-navy outline-none" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-2 py-1.5 text-xs text-navy outline-none" />
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 touch-manip">Effacer</button>
                <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProjects() }}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-navy text-white touch-manip">Appliquer</button>
              </div>
            </div>
          )}
        </div>

        {/* Featured chip */}
        <button onClick={() => { setFeatured(featured ? '' : '1'); setPage(1) }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold shadow-card touch-manip whitespace-nowrap shrink-0 ${featured ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
          style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
          <Star size={10} /> En vedette
        </button>

        {/* Active city chip */}
        {cityId && (
          <button onClick={clearCity} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-[11px] touch-manip shrink-0">
            Ville <X size={10} />
          </button>
        )}
      </div>
    </div>
  )

  /* ── Full filter bar (grid view + desktop map) ───────── */
  const filterBar = (
    <div className="mb-4 space-y-2">
      {/* Mobile layout */}
      <div className="md:hidden space-y-2">
        {/* Row 1: Search + Search button */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-card"
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <Search size={14} className="text-gold shrink-0" />
            <input type="text" placeholder="Rechercher un projet…" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder-gray-400 min-w-0" />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 touch-manip"><X size={13} /></button>
            )}
          </div>
          <button onClick={handleSearch}
            className="shrink-0 h-11 px-4 rounded-2xl text-sm font-semibold text-white touch-manip"
            style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)' }}>
            Chercher
          </button>
        </div>

        {/* Row 2: City + View toggle */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 min-w-0">
            <select value={cityId} onChange={e => { setCityId(e.target.value); setPage(1) }}
              className={`w-full appearance-none pl-3 pr-7 py-2.5 rounded-2xl text-sm font-semibold outline-none cursor-pointer shadow-card ${cityId ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
              style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
              <option value="">Toutes les villes</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
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

        {/* Row 3: Prix + Featured */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 min-w-0">
            <button onClick={() => setShowPriceMenu(p => !p)}
              className={`w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-2xl text-sm font-semibold shadow-card touch-manip ${(minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
              style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
              <span className="truncate">{minPrice || maxPrice ? `${minPrice || '0'}K–${maxPrice || '∞'}K MAD` : 'Fourchette de prix (K MAD)'}</span>
              <ChevronDown size={13} className="text-gray-400 shrink-0" />
            </button>
            {showPriceMenu && (
              <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-card-hover p-4 w-[220px] border border-gray-100">
                <p className="text-navy/50 text-xs font-semibold mb-3 uppercase tracking-wide">Fourchette de prix (K MAD)</p>
                <div className="flex gap-2 mb-3">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 touch-manip">Effacer</button>
                  <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProjects() }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-navy text-white touch-manip">Appliquer</button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => { setFeatured(featured ? '' : '1'); setPage(1) }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-sm font-semibold shadow-card touch-manip shrink-0 ${featured ? 'bg-gold/10 text-gold' : 'bg-white text-gray-600'}`}
            style={{ border: '1px solid rgba(200,200,200,0.5)' }}>
            <Star size={14} className={featured ? 'text-gold' : 'text-gray-400'} />
            En vedette
          </button>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap">
            {cityId && <button onClick={clearCity} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-xs touch-manip">Ville <X size={11} /></button>}
            {(minPrice || maxPrice) && <button onClick={clearPrice} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-xs touch-manip">Prix <X size={11} /></button>}
            {featured && <button onClick={clearFeatured} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 text-gold font-semibold text-xs touch-manip">En vedette <X size={11} /></button>}
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-wrap gap-2.5 items-center p-3 rounded-3xl shadow-card"
        style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(200,200,200,0.5)' }}>
        <div className="flex-1 min-w-48 flex items-center gap-2.5 bg-surface rounded-2xl px-4 py-2.5">
          <Search size={15} className="text-gold shrink-0" />
          <input type="text" placeholder="Rechercher un projet…" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-sm font-medium text-navy outline-none placeholder-navy/30" />
        </div>

        {/* City */}
        <div className="relative">
          <select value={cityId} onChange={e => { setCityId(e.target.value); setPage(1) }}
            className={`appearance-none pl-3 pr-7 py-2.5 rounded-2xl text-sm font-semibold outline-none cursor-pointer transition-all ${cityId ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'}`}>
            <option value="">Toutes les villes</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
        </div>

        {/* Prix */}
        <div className="relative">
          <button onClick={() => setShowPriceMenu(p => !p)}
            className={`flex items-center gap-1.5 pl-3 pr-2 py-2.5 rounded-2xl text-sm font-semibold transition-all ${(minPrice || maxPrice) ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'}`}>
            {minPrice || maxPrice ? `${minPrice || '0'}K – ${maxPrice || '∞'}K MAD` : 'Prix'}
            <ChevronDown size={13} className="text-navy/40" />
          </button>
          {showPriceMenu && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-card-hover p-4 min-w-[220px] border border-gray-100">
              <p className="text-navy/50 text-xs font-semibold mb-3 uppercase tracking-wide">Fourchette de prix (K MAD)</p>
              <div className="flex gap-2 mb-3">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { clearPrice(); setShowPriceMenu(false) }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-navy/50 hover:border-navy/30 transition-colors">Effacer</button>
                <button onClick={() => { setPage(1); setShowPriceMenu(false); fetchProjects() }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-navy text-white hover:opacity-90 transition-opacity">Appliquer</button>
              </div>
            </div>
          )}
        </div>

        {/* Featured toggle */}
        <button onClick={() => { setFeatured(featured ? '' : '1'); setPage(1) }}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all ${featured ? 'bg-gold/10 text-gold' : 'bg-surface text-navy/55 hover:text-navy hover:bg-white'}`}>
          <Star size={15} className={featured ? 'text-gold' : 'text-navy/40'} />
          En vedette
        </button>

        {cityId && (
          <button onClick={clearCity} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
            Ville <X size={12} />
          </button>
        )}

        <button onClick={handleSearch} className="btn-gold py-2.5 px-5 text-sm">Chercher</button>

        <div className="flex gap-1 p-1 rounded-2xl bg-surface ml-auto">
          <button onClick={() => setViewMode('grid')} title="Grille"
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-navy text-white shadow-sm' : 'text-navy/40 hover:text-navy'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('map')} title="Carte"
            className={`p-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-navy text-white shadow-sm' : 'text-navy/40 hover:text-navy'}`}>
            <Map size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  /* ── MAP VIEW ─────────────────────────────────────────────────────── */
  if (viewMode === 'map') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ background: '#F5F5F5' }}>
        <SEOHead
          title="Nouveaux Projets Immobiliers au Maroc"
          description="Découvrez les projets immobiliers neufs et sur plan à travers le Maroc. Résidences, complexes et développements premium."
          breadcrumbs={[{ name: 'Accueil', url: '/' }, { name: 'Nouveaux Projets', url: '/projects' }]}
        />
        <Navbar />

        {/* Header + filters */}
        <div className="pt-16 lg:pt-24 pb-0 lg:pb-3 px-3 lg:px-5 flex-shrink-0">
          <div className="max-w-screen-xl mx-auto">
            <div className="lg:hidden pt-2">{mobileMapFilter}</div>
            <div className="hidden lg:block">
              <div className="mb-3">
                <p className="section-label mb-1">Off-Plan &amp; Neufs</p>
                <h1 className="text-2xl font-bold text-navy">Nouveaux Projets</h1>
              </div>
              {filterBar}
            </div>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden lg:gap-5 lg:px-5 lg:pb-4 lg:max-w-screen-xl lg:mx-auto lg:w-full">

          {/* List panel */}
          <div className="flex flex-col min-h-0 flex-[0_0_47%] lg:flex-1 lg:min-w-0 px-3 lg:px-0 overflow-hidden">
            <div className="flex items-center justify-between py-2 flex-shrink-0">
              <p className="text-navy/50 text-xs font-semibold">
                {loading ? '…' : `${meta?.total ?? projects.length} projet${(meta?.total ?? projects.length) !== 1 ? 's' : ''}`}
              </p>
              {mapMarkers.length > 0 && (
                <span className="text-[10px] text-navy/35 font-medium">
                  {mapMarkers.length} sur carte · {meta?.total ?? projects.length} au total
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 lg:gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <ListProjectCardSkeleton key={i} />)
                : projects.length === 0
                  ? <div className="text-center py-12 text-navy/40 text-sm">Aucun projet trouvé</div>
                  : projects.map((p, i) => (
                      <div key={p.id}>
                        <div className="lg:hidden">
                          <MobileMapProjectCard
                            project={p} index={i}
                            isActive={activeId === p.id}
                            onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                            cardRef={el => { cardRefs.current[p.id] = el }}
                          />
                        </div>
                        <div className="hidden lg:block">
                          <ListProjectCard
                            project={p} index={i}
                            isActive={activeId === p.id}
                            onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                            cardRef={el => { cardRefs.current[p.id] = el }}
                          />
                        </div>
                      </div>
                    ))
              }
            </div>

            {/* Pagination in map view */}
            {meta && meta.last_page > 1 && (
              <div className="flex-shrink-0 py-2 flex items-center justify-center gap-3">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-8 h-8 rounded-xl text-sm font-bold bg-white shadow-sm border border-gray-200 text-navy/60 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center">←</button>
                <span className="text-xs text-navy/50 font-semibold">{page} / {meta.last_page}</span>
                <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                  className="w-8 h-8 rounded-xl text-sm font-bold bg-white shadow-sm border border-gray-200 text-navy/60 disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center">→</button>
              </div>
            )}
          </div>

          {/* Map panel */}
          <div className="flex-[0_0_53%] lg:flex-none lg:w-[420px] xl:lg:w-[500px] lg:flex-shrink-0 lg:rounded-2xl lg:shadow-lg overflow-hidden px-3 pb-3 lg:px-0 lg:pb-0">
            <div className="rounded-2xl overflow-hidden h-full shadow-lg">
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
      </div>
    )
  }

  /* ── GRID VIEW ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      <SEOHead
        title="Nouveaux Projets Immobiliers au Maroc"
        description="Découvrez les projets immobiliers neufs et sur plan à travers le Maroc. Résidences, complexes et développements premium."
        breadcrumbs={[{ name: 'Accueil', url: '/' }, { name: 'Nouveaux Projets', url: '/projects' }]}
      />
      <Navbar />

      <div className="pt-24 pb-8 px-5 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="section-label mb-1.5">Off-Plan &amp; Neufs</p>
          <h1 className="text-3xl font-bold text-navy">Nouveaux Projets</h1>
          <p className="text-navy/45 text-sm mt-1.5">
            {meta ? `${meta.total} projet${meta.total !== 1 ? 's' : ''} disponible${meta.total !== 1 ? 's' : ''}` : 'Découvrez des projets premium'}
          </p>
        </div>

        {/* Sticky sentinel */}
        <div ref={filterSentinelRef} style={{ height: 0 }} />
        {isFilterSticky && <div style={{ height: filterHeight + 16 }} />}

        {isFilterSticky ? (
          <div className="fixed left-0 right-0 z-40 px-5 py-2.5 transition-all"
            style={{ top: 64, background: '#F5F5F5', boxShadow: '0 4px 24px rgba(115,13,38,0.08)', borderBottom: '1px solid rgba(200,200,200,0.4)' }}>
            <div ref={filterBarRef} className="max-w-7xl mx-auto">{filterBar}</div>
          </div>
        ) : (
          <div ref={filterBarRef}>{filterBar}</div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-navy/40 text-xs font-medium">Filtres actifs :</span>
            {cityId && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">Ville</span>}
            {(minPrice || maxPrice) && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">{minPrice || '0'}K – {maxPrice || '∞'}K MAD</span>}
            {featured && <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-lg">En vedette</span>}
            <button onClick={() => { clearPrice(); clearCity(); clearFeatured() }}
              className="text-xs text-navy/40 hover:text-red-500 underline transition-colors">Tout effacer</button>
          </div>
        )}
      </div>

      <div className="pb-20 px-5 max-w-7xl mx-auto">
        {error ? (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg mb-4">Impossible de charger les projets.</p>
            <button onClick={fetchProjects} className="btn-gold">Réessayer</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <GridProjectSkeleton key={i} />)
                : projects.map((project, i) => {
                    const imgUrl = getImgUrl(project, i)
                    return (
                      <Link key={project.id} to={`/projects/${project.slug || project.id}`}
                        className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-video overflow-hidden relative">
                          <img src={imgUrl} alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={e => { e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                          {project.is_featured && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white"
                              style={{ background: 'rgba(200,169,126,0.9)' }}>
                              <Star size={10} /> En vedette
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center">
                              <Building size={12} className="text-gold" />
                            </div>
                            <span className="text-navy/50 text-xs">{project.investor?.name || 'Promoteur'}</span>
                          </div>
                          <h3 className="text-navy font-bold text-lg mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-1">{project.name}</h3>
                          <p className="text-navy/50 text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-navy/40 text-xs">À partir de</span>
                              <div className="text-gold font-bold">{formatPrice(project.price_from) || 'Prix sur demande'}</div>
                            </div>
                            <div className="flex items-center gap-1 text-navy/40 text-xs">
                              <MapPin size={12} />{project.city?.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })
              }
            </div>

            {!loading && projects.length === 0 && (
              <div className="text-center py-24">
                <p className="text-navy/40 text-lg">Aucun projet trouvé.</p>
                {hasActiveFilters && (
                  <button onClick={() => { clearPrice(); clearCity(); clearFeatured() }} className="mt-4 btn-gold text-sm">
                    Effacer les filtres
                  </button>
                )}
              </div>
            )}

            {!loading && meta && meta.last_page > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-2xl border border-navy/10 text-navy text-sm font-semibold disabled:opacity-30 hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 bg-white shadow-sm">
                  Précédent
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
                  Suivant
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
