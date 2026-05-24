import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2, ArrowRight, Map, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { propertiesApi } from '../api/client'
import { mediaUrl, isVideoPath } from '../utils/media'
import MapView from './MapView'

const CITY_FILTERS = [
  { label: 'All', value: null },
  { label: 'Casablanca', value: 'casablanca' },
  { label: 'Marrakech',  value: 'marrakech' },
  { label: 'Rabat',      value: 'rabat' },
  { label: 'Tanger',     value: 'tanger' },
  { label: 'Agadir',     value: 'agadir' },
]

const TYPE_FILTERS = [
  { label: 'Buy',  value: 'sale' },
  { label: 'Rent', value: 'rent' },
]

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
  const [status, setStatus] = useState(src ? 'loading' : 'empty')

  return (
    <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
      {status !== 'empty' && src ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('empty')}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ display: status === 'empty' ? 'none' : 'block' }}
        />
      ) : null}
      {(status === 'empty' || !src) && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #f8e8eb 0%, #f0d0d6 100%)',
          }}
        >
          <Home size={22} style={{ color: '#BA1932', opacity: 0.45 }} />
        </div>
      )}
      {status === 'loading' && src && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
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

function MapPropertyCard({ property, isActive, onClick, cardRef }) {
  const isRent = property.type === 'rent'
  const slug   = (typeof property.slug === 'string' ? property.slug : property.slug?.key) || property.id
  const imgSrc = getPropImage(property)

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`group flex gap-3 rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-200 p-3 ${
        isActive ? 'ring-2 ring-[#BA1932] shadow-lg' : 'hover:shadow-md'
      }`}
      style={{ boxShadow: isActive ? '0 6px 24px rgba(115,13,38,0.18)' : '0 2px 10px rgba(115,13,38,0.06)' }}
    >
      <PropertyImageThumb src={imgSrc} alt={property.name} isRent={isRent} />

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="font-bold text-xs leading-snug line-clamp-2 group-hover:text-[#BA1932] transition-colors"
            style={{ color: '#1a2035', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {property.name}
          </p>
          {(property.city?.name || property.location) && (
            <div className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: 'rgba(115,13,38,0.45)' }}>
              <MapPin size={9} style={{ color: '#BA1932' }} />
              <span className="truncate">{property.city?.name || property.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span className="font-bold text-sm" style={{ color: '#BA1932', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {formatPrice(property.price, isRent)}
          </span>
          <div className="flex items-center gap-2">
            {property.number_bedroom > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>
                <Bed size={9} style={{ color: '#BA1932', opacity: 0.7 }} /> {property.number_bedroom}
              </span>
            )}
            {property.number_bathroom > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>
                <Bath size={9} style={{ color: '#BA1932', opacity: 0.7 }} /> {property.number_bathroom}
              </span>
            )}
            {property.square && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>
                <Maximize2 size={9} style={{ color: '#BA1932', opacity: 0.7 }} /> {property.square}m²
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3" style={{ boxShadow: '0 2px 10px rgba(115,13,38,0.06)' }}>
      <div className="w-24 h-20 rounded-xl skeleton shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 skeleton rounded-lg w-3/4" />
        <div className="h-2.5 skeleton rounded-lg w-1/2" />
        <div className="h-4 skeleton rounded-lg w-1/3 mt-3" />
      </div>
    </div>
  )
}

export default function HomepageMapSection() {
  const { t } = useTranslation()
  const [properties, setProperties]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeCity, setActiveCity]   = useState(null)
  const [activeType, setActiveType]   = useState('sale')
  const [activeId, setActiveId]       = useState(null)
  const cardRefs                       = useRef({})
  const listRef                        = useRef(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setActiveId(null)
    try {
      const params = { per_page: 40, type: activeType }
      if (activeCity) params.city = activeCity
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

  return (
    <section className="py-16 lg:py-24 bg-gray-50/60">
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
            {CITY_FILTERS.map(cf => (
              <button
                key={cf.value ?? 'all'}
                onClick={() => setActiveCity(cf.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  activeCity === cf.value
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-[#BA1932]/30 hover:text-[#BA1932]'
                }`}
                style={activeCity === cf.value
                  ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' }
                  : {}}
              >
                {t(`home.mapSection.city.${cf.value ?? 'all'}`, cf.label)}
              </button>
            ))}
          </div>

          {!loading && (
            <span className="ml-auto text-xs text-gray-400 font-medium hidden sm:block">
              {properties.length} {t('home.mapSection.results', 'properties')}
            </span>
          )}
        </div>

        {/* Main grid: list + map */}
        <div className="flex flex-col lg:flex-row gap-4 rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(115,13,38,0.10)', minHeight: 520 }}>

          {/* Scrollable property list */}
          <div
            ref={listRef}
            className="w-full lg:w-80 xl:w-96 shrink-0 bg-white overflow-y-auto flex flex-col gap-2.5 p-3"
            style={{ maxHeight: 560, scrollbarWidth: 'thin', scrollbarColor: '#BA193240 transparent' }}
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
                  />
                ))
            }
          </div>

          {/* Map */}
          <div className="flex-1 min-h-[360px] lg:min-h-0">
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
