import { useState } from 'react'
import { Heart, Bed, Bath, Maximize2, MapPin, BadgeCheck, BarChart2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useFavorites } from '../context/FavoritesContext'

import { isVideoPath } from '../utils/media'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop'

function getImageUrl(property) {
  const images = Array.isArray(property?.images) ? property.images : []
  const firstImg = images[0] || property?.image

  if (firstImg && isVideoPath(firstImg)) {
    const videoThumb = property?.video_thumbnails?.[firstImg]
    if (videoThumb) return videoThumb
    return FALLBACK
  }

  if (property?.thumbnail_url) return property.thumbnail_url

  const firstImage = images.find(img => !isVideoPath(img))
  const img = firstImage || firstImg
  if (!img || isVideoPath(img)) return FALLBACK
  return img.startsWith('http') ? img : `/storage/${img}`
}

function formatPrice(price, isRent) {
  if (!price) return 'On request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function PropertyCard({ property, className = '' }) {
  const [imgError, setImgError] = useState(false)
  const { toggle: toggleCompare, isIn, isFull } = useCompare()
  const { isAuthenticated } = useUserAuth()
  const { openAuthModal } = useAuthModal()
  const { isFavorited, toggle: toggleFavorite } = useFavorites()

  if (!property) return null

  const slug    = property.slug || property.id
  const isRent  = property.type === 'rent'
  const badge   = property.is_featured ? 'Featured' : null
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
      className={`group block rounded-3xl overflow-hidden bg-white transition-all duration-400 hover:-translate-y-2 ${className}`}
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
              Rent
            </span>
          )}
          {property.is_verified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-sm bg-blue-500/90 text-white">
              <BadgeCheck size={10} /> Verified
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              liked
                ? 'scale-110'
                : 'hover:scale-110'
            }`}
            style={liked
              ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
              : { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }
            }
          >
            <Heart size={14} className={liked ? 'fill-white text-white' : 'text-navy/70'} />
          </button>
          <button
            onClick={handleCompare}
            title={inCmp ? 'Remove from compare' : isFull ? 'Max 3 properties' : 'Add to compare'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
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
            {isRent && <span className="text-white/60 text-xs">/mo</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
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
              <span className="font-semibold">{property.number_bedroom} bd</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(115,13,38,0.50)' }}>
              <Bath size={12} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.number_bathroom} ba</span>
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
      <div className="p-5 space-y-3">
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
