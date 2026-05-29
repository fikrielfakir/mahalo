import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2, ArrowRight, Map, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { propertiesApi, citiesApi } from '../api/client'
import { mediaUrl, isVideoPath } from '../utils/media'
import MapView from './MapView'

const TYPE_FILTERS = [
  { label: 'Buy',  value: 'sale' },
  { label: 'Rent', value: 'rent' },
]

const MOBILE_PAGE_SIZE = 3

function getPropImage(property) {
  const imgs = Array.isArray(property?.images) ? property.images : []
  const first = imgs.find(i => !isVideoPath(i))
  if (first) return mediaUrl(first)
  if (property?.image && !isVideoPath(property.image)) return mediaUrl(property.image)
  const thumb = property?.video_thumbnails && Object.values(property.video_thumbnails)[0]
  return thumb || null
}

function formatPrice(price, isRent) {
  if (!price) return 'On request'
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K MAD`
  return `${n.toLocaleString()} MAD`
}

function PropertyImageThumb({ src, alt, isRent }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const showPlaceholder = !src || errored

  return (
    <div className="relative w-20 h-16 min-w-[80px] rounded-xl overflow-hidden bg-gray-100 sm:w-24 sm:h-20 sm:min-w-[96px]">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f8e8eb 0%, #f0d0d6 100%)',
          opacity: showPlaceholder ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <Home size={22} style={{ color: '#BA1932', opacity: 0.45 }} />
      </div>

      {src && !errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {isRent && (
        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wide text-white px-1.5 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.55)' }}>
          Rent
        </span>
      )}
    </div>
  )
}

function MapPropertyCard({ property, isActive, onClick, cardRef, showViewLink }) {
  const isRent = property.type === 'rent'
  const slug   = (typeof property.slug === 'string' ? property.slug : property.slug?.key) || property.id
  const imgSrc = getPropImage(property)
  const { t }  = useTranslation()
  const [loaded, setLoaded]   = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="group flex overflow-hidden rounded-2xl bg-white cursor-pointer transition-all duration-200 hover:shadow-md items-stretch"
      style={{
        minHeight: 110,
        boxShadow: isActive ? '0 6px 20px rgba(115,13,38,0.16)' : '0 2px 8px rgba(115,13,38,0.06)',
        borderLeft: isActive ? '4px solid #BA1932' : '4px solid transparent',
        background: isActive ? 'rgba(186,25,50,0.025)' : 'white',
      }}
    >
      {/* Image */}
      <div className="relative shrink-0 overflow-hidden self-stretch" style={{ width: 96 }}>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg,#f8e8eb,#f0d0d6)',
            opacity: (!imgSrc || errored) ? 1 : 0,
            transition: 'opacity .3s',
          }}
        >
          <Home size={20} style={{ color: '#BA1932', opacity: 0.35 }} />
        </div>
        {imgSrc && !errored && (
          <img
            src={imgSrc}
            alt={property.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <span
          className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase text-white"
          style={{ background: isRent ? 'rgba(0,0,0,0.55)' : 'linear-gradient(135deg,#730D26,#BA1932)' }}
        >
          {isRent ? t('property.forRent', 'Rent') : t('property.forSale', 'Buy')}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 px-2.5 pt-2.5 pb-3 flex flex-col gap-1">
        <p className="font-bold text-[12px] leading-snug line-clamp-2 group-hover:text-[#BA1932] transition-colors"
          style={{ color: '#1a2035', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
          {property.name}
        </p>

        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1" style={{ color: 'rgba(115,13,38,0.5)' }}>
            <MapPin size={9} style={{ color: '#BA1932', flexShrink: 0 }} />
            <span className="text-[11px] truncate">{property.city?.name || property.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {property.number_bedroom > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Bed size={9} style={{ color: '#BA1932', opacity: 0.75 }} /> {property.number_bedroom} ch
            </span>
          )}
          {property.number_bathroom > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Bath size={9} style={{ color: '#BA1932', opacity: 0.75 }} /> {property.number_bathroom} sdb
            </span>
          )}
          {property.square && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Maximize2 size={9} style={{ color: '#BA1932', opacity: 0.75 }} /> {property.square} m²
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1.5"
          style={{ borderTop: '1px solid rgba(115,13,38,0.06)' }}>
          <span className="font-bold text-[12px]" style={{ color: '#BA1932', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {formatPrice(property.price, isRent)}
          </span>
          {showViewLink && (
            <Link
              to={`/properties/${slug}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-0.5 text-[11px] font-bold transition-opacity hover:opacity-70 shrink-0"
              style={{ color: '#BA1932' }}
            >
              {t('home.mapSection.view', 'Voir')} <ArrowRight size={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3" style={{ boxShadow: '0 2px 10px rgba(115,13,38,0.06)' }}>
      <div className="w-20 h-16 rounded-xl skeleton shrink-0 sm:w-24 sm:h-20" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 skeleton rounded-lg w-3/4" />
        <div className="h-2.5 skeleton rounded-lg w-1/2" />
        <div className="h-4 skeleton rounded-lg w-1/3 mt-3" />
      </div>
    </div>
  )
}

export default function HomepageMapSection() {
  const { t, i18n } = useTranslation()
  const [properties, setProperties]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [cities, setCities]           = useState([])
  const [activeCity, setActiveCity]   = useState(null)
  const [activeType, setActiveType]   = useState('sale')
  const [activeId, setActiveId]       = useState(null)
  const [mobilePage, setMobilePage]   = useState(0)
  const cardRefs                       = useRef({})
  const listRef                        = useRef(null)

  useEffect(() => {
    const locale = i18n.language?.split('-')[0] || 'fr'
    import('../api/client').then(({ default: api }) => {
      api.get('/cities', { headers: { 'Accept-Language': locale } })
        .then(res => {
          const data = Array.isArray(res?.data) ? res.data : []
          setCities(data)
        })
        .catch(() => setCities([]))
    })
  }, [i18n.language])

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setActiveId(null)
    setMobilePage(0)
    try {
      const params = { per_page: 40, type: activeType }
      if (activeCity) params.city_id = activeCity
      const r = await propertiesApi.list(params)
      const items = (r?.data || r || []).filter(p => p.latitude && p.longitude)
      setProperties(items)
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [activeCity, activeType])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const markers = properties.map(p => ({
    id:       p.id,
    lat:      parseFloat(p.latitude),
    lng:      parseFloat(p.longitude),
    title:    p.name,
    rawPrice: p.price,
    subtitle: p.city?.name || p.location || '',
    image:    getPropImage(p),
    href:     `/properties/${(typeof p.slug === 'string' ? p.slug : p.slug?.key) || p.id}`,
  }))

  const handleMarkerClick = useCallback((id) => {
    setActiveId(String(id))
    const ref = cardRefs.current[String(id)]
    if (ref && listRef.current) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  const handleCardClick = (id) => {
    setActiveId(String(id))
  }

  const viewAllHref = `/properties?type=${activeType}${activeCity ? `&city=${activeCity}` : ''}`

  const totalMobilePages = Math.ceil(properties.length / MOBILE_PAGE_SIZE)
  const mobileProperties = properties.slice(
    mobilePage * MOBILE_PAGE_SIZE,
    mobilePage * MOBILE_PAGE_SIZE + MOBILE_PAGE_SIZE
  )

  return (
    <section className="py-16 lg:py-24 bg-gray-50/60" style={{ position: 'relative', zIndex: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
                <Map size={15} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#BA1932' }}>
                {t('home.mapSection.eyebrow', 'Explore on the Map')}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {t('home.mapSection.title', 'Find Properties Near You')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('home.mapSection.subtitle', 'Browse listings interactively — click a pin to see details.')}
            </p>
          </div>

          <Link
            to={viewAllHref}
            className="flex items-center gap-2 text-sm font-semibold shrink-0 transition-all duration-200 hover:gap-3"
            style={{ color: '#BA1932' }}
          >
            {t('home.mapSection.viewAll', 'View all on map')}
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Type toggle + City pills */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm gap-0.5">
            {TYPE_FILTERS.map(tf => (
              <button
                key={tf.value}
                onClick={() => setActiveType(tf.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeType === tf.value
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                style={activeType === tf.value
                  ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' }
                  : {}}
              >
                {t(`home.mapSection.type.${tf.value}`, tf.label)}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {/* All button */}
            <button
              onClick={() => setActiveCity(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeCity === null
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-[#BA1932]/30 hover:text-[#BA1932]'
              }`}
              style={activeCity === null
                ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' }
                : {}}
            >
              {t('home.mapSection.city.all', 'All')}
            </button>
            {/* Dynamic cities from API */}
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setActiveCity(city.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  activeCity === city.id
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-[#BA1932]/30 hover:text-[#BA1932]'
                }`}
                style={activeCity === city.id
                  ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' }
                  : {}}
              >
                {city.name}
              </button>
            ))}
          </div>

          {!loading && (
            <span className="ml-auto text-xs text-gray-400 font-medium hidden sm:block">
              {properties.length} {t('home.mapSection.results', 'properties')}
            </span>
          )}
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="lg:hidden flex flex-col gap-3 rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(115,13,38,0.10)', position: 'relative', zIndex: 0 }}>

          {/* Mobile count header */}
          {!loading && properties.length > 0 && (
            <div className="bg-white px-4 pt-4 pb-2">
              <p className="text-sm font-bold text-gray-800">
                <span style={{ color: '#BA1932' }}>{properties.length}</span>{' '}
                {t('home.mapSection.found', 'biens trouvés')}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {markers.length} {t('home.mapSection.onMap', 'sur carte')} · {properties.length} {t('home.mapSection.total', 'au total')}
              </p>
            </div>
          )}

          {/* Mobile paginated cards */}
          <div className="bg-white px-3 flex flex-col gap-2.5 pb-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : properties.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                    <MapPin size={32} className="mb-3 opacity-20" style={{ color: '#BA1932' }} />
                    <p className="text-sm font-semibold text-gray-400">
                      {t('home.mapSection.noResults', 'No properties with location data found.')}
                    </p>
                  </div>
                )
                : mobileProperties.map(p => (
                  <MapPropertyCard
                    key={p.id}
                    property={p}
                    isActive={String(activeId) === String(p.id)}
                    onClick={() => handleCardClick(p.id)}
                    cardRef={el => { if (el) cardRefs.current[String(p.id)] = el }}
                    showViewLink={true}
                  />
                ))
            }
          </div>

          {/* Mobile pagination */}
          {!loading && totalMobilePages > 1 && (
            <div className="bg-white flex items-center justify-center gap-6 py-3 border-t border-gray-100">
              <button
                onClick={() => setMobilePage(p => Math.max(0, p - 1))}
                disabled={mobilePage === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#BA1932] hover:text-[#BA1932] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-gray-600">
                {mobilePage + 1} / {totalMobilePages}
              </span>
              <button
                onClick={() => setMobilePage(p => Math.min(totalMobilePages - 1, p + 1))}
                disabled={mobilePage === totalMobilePages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#BA1932] hover:text-[#BA1932] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Mobile map */}
          <div style={{ height: 300, position: 'relative', zIndex: 0 }}>
            <MapView
              markers={markers}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              center={[-7.09, 31.79]}
              zoom={5}
              height="100%"
            />
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:flex gap-4 rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 8px 40px rgba(115,13,38,0.10)',
            minHeight: 520,
            position: 'relative',
            zIndex: 0,
          }}>

          {/* Scrollable property list */}
          <div
            ref={listRef}
            className="w-80 xl:w-96 shrink-0 bg-white overflow-y-auto overflow-x-hidden flex flex-col gap-2.5 p-3"
            style={{
              maxHeight: 'calc(100vh - 280px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#BA193240 transparent',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : properties.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                    <MapPin size={32} className="mb-3 opacity-20" style={{ color: '#BA1932' }} />
                    <p className="text-sm font-semibold text-gray-400">
                      {t('home.mapSection.noResults', 'No properties with location data found.')}
                    </p>
                  </div>
                )
                : properties.map(p => (
                  <MapPropertyCard
                    key={p.id}
                    property={p}
                    isActive={String(activeId) === String(p.id)}
                    onClick={() => handleCardClick(p.id)}
                    cardRef={el => { if (el) cardRefs.current[String(p.id)] = el }}
                    showViewLink={false}
                  />
                ))
            }
          </div>

          {/* Map */}
          <div className="flex-1" style={{ position: 'relative', zIndex: 0 }}>
            <MapView
              markers={markers}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              center={[-7.09, 31.79]}
              zoom={5}
              height="100%"
            />
          </div>
        </div>

      </div>
    </section>
  )
}