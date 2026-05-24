import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Bed, Bath, Maximize2, ArrowRight, Map, Home,
  ChevronLeft, ChevronRight, Phone, MessageCircle,
  Heart, Share2, Car, Layers, Star, Building2, BadgeCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { propertiesApi } from '../api/client'
import { mediaUrl, isVideoPath } from '../utils/media'
import MapView from './MapView'

const CITY_FILTERS = [
  { label: 'All',        value: null },
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

function getImages(property) {
  const imgs = Array.isArray(property?.images) ? property.images : []
  return imgs.filter(i => !isVideoPath(i)).map(mediaUrl).filter(Boolean)
}

function formatPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return n.toLocaleString()
}

function getPricePerSqm(price, square) {
  if (!price || !square || square <= 0) return null
  return Math.round(parseFloat(price) / parseFloat(square))
}

function hasFeatureMatch(features, ...keywords) {
  return features?.some(f =>
    keywords.some(kw => f.name?.toLowerCase().includes(kw.toLowerCase()))
  )
}

function getAgentInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

/* ─── Image Gallery ───────────────────────────────────────────── */
function PropertyGallery({ images, alt, isRent, isFeatured }) {
  const [idx, setIdx]       = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const total = images.length
  const src   = images[idx] || null

  const go = (dir, e) => {
    e.stopPropagation()
    setIdx(i => (i + dir + total) % total)
    setLoaded(false)
    setErrored(false)
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ height: 164 }}>
      {/* Rose placeholder */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #f8e8eb 0%, #f0d0d6 100%)',
          opacity: (!src || errored) ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <Home size={32} style={{ color: '#BA1932', opacity: 0.3 }} />
      </div>

      {/* Actual image */}
      {src && !errored && (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Nav arrows */}
      {total > 1 && (
        <>
          <button
            onClick={e => go(-1, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <ChevronLeft size={13} className="text-gray-700" />
          </button>
          <button
            onClick={e => go(1, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <ChevronRight size={13} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Image counter */}
      {total > 0 && (
        <span
          className="absolute bottom-2 left-2 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full z-10"
          style={{ background: 'rgba(0,0,0,0.52)' }}
        >
          {idx + 1}/{total}
        </span>
      )}

      {/* Badges row */}
      <div className="absolute top-2 left-2 flex gap-1.5 z-10">
        {isFeatured && (
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Star size={8} /> Featured
          </span>
        )}
        <span className={`text-[9px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full ${isRent ? 'bg-blue-600' : 'bg-[#BA1932]'}`}>
          {isRent ? 'Rent' : 'Sale'}
        </span>
      </div>
    </div>
  )
}

/* ─── Rich Property Card ──────────────────────────────────────── */
function MapPropertyCard({ property, isActive, onClick, cardRef }) {
  const [saved, setSaved] = useState(false)
  const isRent     = property.type === 'rent'
  const slug       = (typeof property.slug === 'string' ? property.slug : property.slug?.key) || property.id
  const images     = getImages(property)
  const priceLabel = formatPrice(property.price)
  const ppm2       = getPricePerSqm(property.price, property.square)
  const features   = property.features || []
  const categories = property.categories || []
  const agent      = property.agent
  const category   = categories[0]?.name || null

  const hasParking  = hasFeatureMatch(features, 'parking', 'garage', 'car')
  const hasElevator = hasFeatureMatch(features, 'elevator', 'lift', 'ascenseur')
  const hasSeaView  = hasFeatureMatch(features, 'sea', 'ocean', 'mer', 'vue')
  const hasStone    = hasFeatureMatch(features, 'stone', 'pierre')

  const visibleFeatureTags = features
    .filter(f => !hasParking || !f.name?.match(/parking|garage|car/i))
    .filter(f => !hasElevator || !f.name?.match(/elevator|lift|ascenseur/i))
    .slice(0, 3)

  const handleShare = (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/properties/${slug}`
    if (navigator.share) navigator.share({ title: property.name, url })
    else navigator.clipboard?.writeText(url)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    setSaved(s => !s)
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`group flex flex-col rounded-2xl bg-white cursor-pointer transition-all duration-200 overflow-hidden border ${
        isActive
          ? 'ring-2 ring-[#BA1932] shadow-lg border-transparent'
          : 'border-gray-100 hover:shadow-md hover:border-[#BA1932]/15'
      }`}
      style={{ boxShadow: isActive ? '0 6px 24px rgba(115,13,38,0.18)' : '0 2px 10px rgba(115,13,38,0.06)' }}
    >
      {/* ── Gallery ── */}
      <div className="relative">
        <PropertyGallery
          images={images}
          alt={property.name}
          isRent={isRent}
          isFeatured={!!property.is_featured}
        />
        {/* Top-right action icons */}
        <div className="absolute top-2 right-2 flex gap-1.5 z-10">
          <button
            onClick={handleSave}
            className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={13} style={{ color: saved ? '#BA1932' : '#9ca3af', fill: saved ? '#BA1932' : 'none' }} />
          </button>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Share2 size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-2 p-3">

        {/* Category type + condition */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(115,13,38,0.08)', color: '#730D26' }}>
              <Building2 size={9} />
              {category}
            </span>
          )}
          {property.condition && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              {property.condition}
            </span>
          )}
          {property.is_featured && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 px-2 py-0.5 rounded-full bg-amber-50">
              <BadgeCheck size={9} /> Verified
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/properties/${slug}`}
          onClick={e => e.stopPropagation()}
          className="font-bold text-sm leading-snug line-clamp-2 hover:text-[#BA1932] transition-colors"
          style={{ color: '#1a2035', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
        >
          {property.name}
        </Link>

        {/* Location */}
        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(115,13,38,0.5)' }}>
            <MapPin size={10} style={{ color: '#BA1932', flexShrink: 0 }} />
            <span className="truncate">
              {[property.city?.name, property.location].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline justify-between gap-2 mt-0.5">
          <div>
            {priceLabel ? (
              <span className="font-extrabold text-base" style={{ color: '#BA1932', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {priceLabel} <span className="text-xs font-semibold text-gray-400">MAD</span>
                {isRent && <span className="text-[10px] font-medium text-gray-400 ml-1">/mo</span>}
              </span>
            ) : (
              <span className="text-sm font-semibold text-gray-400">On request</span>
            )}
          </div>
          {ppm2 && (
            <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap shrink-0">
              {ppm2.toLocaleString()} MAD/m²
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-gray-50">
          {property.number_bedroom > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
              <Bed size={12} style={{ color: '#BA1932' }} />
              {property.number_bedroom} bed{property.number_bedroom !== 1 ? 's' : ''}
            </span>
          )}
          {property.number_bathroom > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
              <Bath size={12} style={{ color: '#BA1932' }} />
              {property.number_bathroom} bath{property.number_bathroom !== 1 ? 's' : ''}
            </span>
          )}
          {property.square > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
              <Maximize2 size={11} style={{ color: '#BA1932' }} />
              {property.square} m²
            </span>
          )}
          {property.number_floor > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
              <Layers size={11} style={{ color: '#BA1932' }} />
              Floor {property.number_floor}
            </span>
          )}
        </div>

        {/* Feature tags */}
        {(hasParking || hasElevator || hasSeaView || hasStone || visibleFeatureTags.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {hasParking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                <Car size={9} /> Parking
              </span>
            )}
            {hasElevator && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                <Layers size={9} /> Elevator
              </span>
            )}
            {hasSeaView && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                🌊 Sea view
              </span>
            )}
            {hasStone && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                🪨 Stone house
              </span>
            )}
            {visibleFeatureTags.map(f => (
              <span key={f.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {f.name}
              </span>
            ))}
          </div>
        )}

        {/* Agent + action buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-0.5">
          {/* Agent avatar */}
          {agent ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
                {getAgentInitials(agent.name)}
              </div>
              <span className="text-[10px] font-medium text-gray-500 truncate">{agent.name}</span>
            </div>
          ) : <div className="flex-1" />}

          {/* Contact */}
          <Link
            to={`/properties/${slug}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl text-white transition-all hover:opacity-90 shrink-0"
            style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}
          >
            <MessageCircle size={10} />
            Contact
          </Link>

          {/* Phone */}
          {agent?.phone && (
            <a
              href={`tel:${agent.phone}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all hover:bg-gray-50 shrink-0"
              style={{ color: '#BA1932', borderColor: 'rgba(115,13,38,0.25)' }}
            >
              <Phone size={10} />
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Skeleton ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-white overflow-hidden border border-gray-100"
      style={{ boxShadow: '0 2px 10px rgba(115,13,38,0.06)' }}>
      <div className="w-full skeleton" style={{ height: 164 }} />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-lg w-5/6" />
        <div className="h-3 skeleton rounded-lg w-2/3" />
        <div className="h-5 skeleton rounded-lg w-2/5" />
        <div className="flex gap-2 pt-1">
          <div className="h-3 skeleton rounded-full w-12" />
          <div className="h-3 skeleton rounded-full w-12" />
          <div className="h-3 skeleton rounded-full w-16" />
        </div>
        <div className="flex gap-2 mt-1">
          <div className="h-5 skeleton rounded-xl flex-1" />
          <div className="h-5 skeleton rounded-xl w-16" />
        </div>
      </div>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function HomepageMapSection() {
  const { t } = useTranslation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeCity, setActiveCity] = useState(null)
  const [activeType, setActiveType] = useState('sale')
  const [activeId, setActiveId]     = useState(null)
  const cardRefs                    = useRef({})
  const listRef                     = useRef(null)

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
    image:    getImages(p)[0] || null,
    href:     `/properties/${(typeof p.slug === 'string' ? p.slug : p.slug?.key) || p.id}`,
  }))

  const handleMarkerClick = useCallback((id) => {
    setActiveId(String(id))
    const ref = cardRefs.current[String(id)]
    if (ref && listRef.current) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm gap-0.5">
            {TYPE_FILTERS.map(tf => (
              <button
                key={tf.value}
                onClick={() => setActiveType(tf.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeType === tf.value ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
                style={activeType === tf.value ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' } : {}}
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
                style={activeCity === cf.value ? { background: 'linear-gradient(135deg, #730D26, #BA1932)' } : {}}
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

        {/* Main grid */}
        <div
          className="flex flex-col lg:flex-row gap-4 rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(115,13,38,0.10)', minHeight: 560 }}
        >
          {/* Scrollable property list */}
          <div
            ref={listRef}
            className="w-full lg:w-96 xl:w-[420px] shrink-0 bg-gray-50 overflow-y-auto overflow-x-hidden flex flex-col gap-3 p-3"
            style={{
              maxHeight: 640,
              scrollbarWidth: 'thin',
              scrollbarColor: '#BA193240 transparent',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
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
                    onClick={() => setActiveId(String(p.id))}
                    cardRef={el => { if (el) cardRefs.current[String(p.id)] = el }}
                  />
                ))
            }
          </div>

          {/* Map */}
          <div className="flex-1 min-h-[400px] lg:min-h-0">
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
