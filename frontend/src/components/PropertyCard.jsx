import { useState } from 'react'
import { Heart, Bed, Bath, Maximize2, MapPin, BadgeCheck, BarChart2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useFavorites } from '../context/FavoritesContext'
import { useTranslation } from 'react-i18next'

import { isVideoPath, mediaUrl } from '../utils/media'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop'

function getImageUrl(property) {
  const images = Array.isArray(property?.images) ? property.images : []

  const firstImage = images.find(img => !isVideoPath(img))
  if (firstImage) return mediaUrl(firstImage)

  const firstVideo = images.find(img => isVideoPath(img))
  if (firstVideo && property?.video_thumbnails?.[firstVideo]) {
    return property.video_thumbnails[firstVideo]
  }

  const fallbackImg = property?.image
  if (fallbackImg && !isVideoPath(fallbackImg)) return mediaUrl(fallbackImg)
  // property.image is a video — try its thumbnail before giving up
  if (fallbackImg && isVideoPath(fallbackImg) && property?.video_thumbnails?.[fallbackImg]) {
    return property.video_thumbnails[fallbackImg]
  }
  // Also try the first key in video_thumbnails regardless of path match
  if (property?.video_thumbnails) {
    const firstThumb = Object.values(property.video_thumbnails)[0]
    if (firstThumb) return firstThumb
  }

  return FALLBACK
}

function formatPrice(price, isRent) {
  if (!price) return 'On request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function PropertyCard({ property, className = '' }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)
  const { toggle: toggleCompare, isIn, isFull } = useCompare()
  const { isAuthenticated } = useUserAuth()
  const { openAuthModal } = useAuthModal()
  const { isFavorited, toggle: toggleFavorite } = useFavorites()

  if (!property) return null

  const rawSlug = property.slug
  const slug    = (typeof rawSlug === 'string' ? rawSlug : rawSlug?.key) || property.id
  const isRent  = property.type === 'rent'
  const badge   = property.is_featured ? t('property.featured') : null
  const inCmp   = isIn(property.id)
  const liked   = isFavorited(property.id)

  const handleLike = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal(() => toggleFavorite(property.id))
      return
    }
    toggleFavorite(property.id)
  }

  const handleCompare = (e) => {
    e.preventDefault()
    toggleCompare(property)
  }

  return (
    <Link
      to={`/properties/${slug}`}
      className={`group block rounded-3xl overflow-hidden bg-white transition-all duration-400 hover:-translate-y-2 active:scale-[0.98] touch-manip ${className}`}
      style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,13,38,0.16), 0 4px 12px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(115,13,38,0.08), 0 1px 4px rgba(0,0,0,0.04)'}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgError ? FALLBACK : getImageUrl(property)}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.07]"
        />
        {/* Rich gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(115,13,38,0.75) 0%, rgba(0,0,0,0.20) 45%, transparent 100%)'
        }} />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex gap-1.5">
          {badge && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
              {badge}
            </span>
          )}
          {isRent && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {t('property.forRent')}
            </span>
          )}
          {property.is_verified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-sm bg-blue-500/90 text-white">
              <BadgeCheck size={10} /> {t('property.verified')}
            </span>
          )}
        </div>

        {/* Action buttons — min 44×44 tap target */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleLike}
            aria-label={liked ? t('property.unlike') : t('property.like')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm touch-manip ${
              liked ? 'scale-110' : 'hover:scale-110'
            }`}
            style={liked
              ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
              : { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }
            }
          >
            <Heart size={15} className={liked ? 'fill-white text-white' : 'text-navy/70'} />
          </button>
          <button
            onClick={handleCompare}
            title={inCmp ? t('property.removeFromCompare') : isFull ? t('property.maxCompare') : t('property.addToCompare')}
            aria-label={inCmp ? t('property.removeFromCompare') : t('property.addToCompare')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm touch-manip ${
              inCmp ? 'scale-110' : isFull ? 'cursor-not-allowed' : 'hover:scale-110'
            }`}
            style={inCmp
              ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
              : { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }
            }
          >
            {inCmp
              ? <Check size={13} className="text-white" />
              : <BarChart2 size={13} className="text-navy/70" />
            }
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-3.5 left-4">
          <div className="flex items-baseline gap-1">
            <span className="text-white font-bold text-lg leading-none drop-shadow-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {formatPrice(property.price, isRent)}
            </span>
            {isRent && <span className="text-white/60 text-xs">{t('property.perMonth')}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 xs:p-5">
        <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-1 transition-colors duration-300 group-hover:text-gold"
          style={{ color: '#730D26', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
          {property.name}
        </h3>

        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'rgba(115,13,38,0.45)' }}>
            <MapPin size={11} className="shrink-0" style={{ color: '#BA1932' }} />
            <span className="truncate font-medium">{property.city?.name || property.location}</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-3.5" style={{ borderTop: '1px solid rgba(115,13,38,0.06)' }}>
          {property.number_bedroom > 0 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(115,13,38,0.50)' }}>
              <Bed size={12} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.number_bedroom} {t('property.beds')}</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(115,13,38,0.50)' }}>
              <Bath size={12} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.number_bathroom} {t('property.baths')}</span>
            </div>
          )}
          {property.square && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(115,13,38,0.50)' }}>
              <Maximize2 size={12} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.square} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.06)' }}>
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 xs:p-5 space-y-3">
        <div className="h-4 skeleton rounded-xl w-3/4" />
        <div className="h-3 skeleton rounded-xl w-1/2" />
        <div className="h-px mt-3" style={{ background: 'rgba(115,13,38,0.06)' }} />
        <div className="flex gap-4 pt-0.5">
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-14" />
        </div>
      </div>
    </div>
  )
}

export function ListPropertyCard({ property, isActive, onClick, cardRef }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)
  const { isFavorited, toggle: toggleFavorite } = useFavorites()
  const { isAuthenticated } = useUserAuth()
  const { openAuthModal } = useAuthModal()

  if (!property) return null

  const rawSlug = property.slug
  const slug    = (typeof rawSlug === 'string' ? rawSlug : rawSlug?.key) || property.id
  const isRent  = property.type === 'rent'
  const liked   = isFavorited(property.id)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { openAuthModal(() => toggleFavorite(property.id)); return }
    toggleFavorite(property.id)
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`group flex rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-200 ${
        isActive ? 'ring-2 ring-[#BA1932]' : 'hover:shadow-md'
      }`}
      style={{
        boxShadow: isActive
          ? '0 8px 32px rgba(115,13,38,0.18)'
          : '0 2px 12px rgba(115,13,38,0.07)',
      }}
    >
      {/* Image */}
      <div className="relative w-40 sm:w-48 shrink-0 overflow-hidden">
        <img
          src={imgError ? FALLBACK : getImageUrl(property)}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          style={{ minHeight: 140 }}
        />
        {(property.is_featured || isRent) && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {property.is_featured && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
                {t('property.featured')}
              </span>
            )}
            {isRent && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase text-white"
                style={{ background: 'rgba(0,0,0,0.55)' }}>
                {t('property.forRent')}
              </span>
            )}
          </div>
        )}
        {property.is_verified && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white bg-blue-500/90">
            <BadgeCheck size={9} /> {t('property.verified')}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-navy text-sm leading-snug line-clamp-2 group-hover:text-[#BA1932] transition-colors duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {property.name}
            </h3>
            <button
              onClick={handleLike}
              aria-label={liked ? t('property.unlike') : t('property.like')}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all touch-manip"
              style={liked
                ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 2px 10px rgba(186,25,50,0.35)' }
                : { background: 'rgba(115,13,38,0.06)' }}
            >
              <Heart size={12} className={liked ? 'fill-white text-white' : 'text-navy/50'} />
            </button>
          </div>

          {(property.city?.name || property.location) && (
            <div className="flex items-center gap-1 text-xs text-navy/45 mb-3">
              <MapPin size={10} className="shrink-0" style={{ color: '#BA1932' }} />
              <span className="truncate">{property.city?.name || property.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {property.number_bedroom > 0 && (
              <div className="flex items-center gap-1 text-xs text-navy/50">
                <Bed size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
                <span className="font-medium">{property.number_bedroom} {t('property.beds')}</span>
              </div>
            )}
            {property.number_bathroom > 0 && (
              <div className="flex items-center gap-1 text-xs text-navy/50">
                <Bath size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
                <span className="font-medium">{property.number_bathroom} {t('property.baths')}</span>
              </div>
            )}
            {property.square && (
              <div className="flex items-center gap-1 text-xs text-navy/50">
                <Maximize2 size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
                <span className="font-medium">{property.square} m²</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(115,13,38,0.06)' }}>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-base" style={{ color: '#BA1932', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {formatPrice(property.price, isRent)}
            </span>
            {isRent && <span className="text-navy/35 text-xs">{t('property.perMonth')}</span>}
          </div>
          <Link
            to={`/properties/${slug}`}
            onClick={e => e.stopPropagation()}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 hover:text-white"
            style={{ color: '#BA1932', background: 'rgba(115,13,38,0.07)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#BA1932'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(115,13,38,0.07)'; e.currentTarget.style.color = '#BA1932' }}
          >
            {t('common.view', 'Voir')} →
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ListPropertyCardSkeleton() {
  return (
    <div className="flex rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 2px 12px rgba(115,13,38,0.07)' }}>
      <div className="w-40 sm:w-48 shrink-0 skeleton" style={{ minHeight: 140 }} />
      <div className="flex-1 p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <div className="h-4 skeleton rounded-xl w-3/4" />
          <div className="w-7 h-7 skeleton rounded-full shrink-0" />
        </div>
        <div className="h-3 skeleton rounded-xl w-1/3" />
        <div className="flex gap-3 mt-2">
          <div className="h-3 skeleton rounded w-12" />
          <div className="h-3 skeleton rounded w-12" />
          <div className="h-3 skeleton rounded w-16" />
        </div>
        <div className="h-px skeleton mt-4" />
        <div className="flex justify-between">
          <div className="h-5 skeleton rounded w-24" />
          <div className="h-7 skeleton rounded-xl w-14" />
        </div>
      </div>
    </div>
  )
}
