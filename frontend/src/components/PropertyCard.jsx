import { useState } from 'react'
import { Heart, Bed, Bath, Maximize2, MapPin, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop'
const FAVORITES_KEY = 'homzen_favorites'

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [] } catch { return [] }
}

function saveFavorites(ids) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)) } catch {}
}

function getImageUrl(property) {
  const img = Array.isArray(property?.images) ? property.images[0] : property?.image
  if (img) {
    if (img.startsWith('http')) return img
    return `/storage/${img}`
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
  const [liked, setLiked] = useState(() => getFavorites().includes(property?.id))
  const [imgError, setImgError] = useState(false)

  if (!property) return null

  const slug   = property.slug || property.id
  const isRent = property.type === 'rent'
  const badge  = property.is_featured ? 'Featured' : null

  const handleLike = (e) => {
    e.preventDefault()
    const favs = getFavorites()
    let next
    if (favs.includes(property.id)) {
      next = favs.filter(f => f !== property.id)
    } else {
      next = [...favs, property.id]
    }
    saveFavorites(next)
    setLiked(next.includes(property.id))
  }

  return (
    <Link
      to={`/properties/${slug}`}
      className={`group block rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1.5 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgError ? FALLBACK : getImageUrl(property)}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          {badge && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide bg-gold text-navy shadow-sm">
              {badge}
            </span>
          )}
          {isRent && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide bg-navy/80 text-white backdrop-blur-sm">
              Rent
            </span>
          )}
          {property.is_verified && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold backdrop-blur-sm bg-blue-500/90 text-white">
              <BadgeCheck size={10} /> Verified
            </span>
          )}
        </div>

        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-250 ${
            liked ? 'bg-red-500 shadow-lg scale-110' : 'bg-white/85 backdrop-blur-sm hover:bg-white hover:scale-110'
          }`}
        >
          <Heart size={14} className={liked ? 'fill-white text-white' : 'text-navy/60'} />
        </button>

        <div className="absolute bottom-3 left-3">
          <div className="flex items-baseline gap-1">
            <span className="text-white font-bold text-lg leading-none drop-shadow">
              {formatPrice(property.price, isRent)}
            </span>
            {isRent && <span className="text-white/60 text-xs">/mo</span>}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-navy font-semibold text-sm leading-snug mb-1.5 line-clamp-1 group-hover:text-gold transition-colors duration-200">
          {property.name}
        </h3>

        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1 text-navy/45 text-xs mb-3">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{property.city?.name || property.location}</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-gray-100/80">
          {property.number_bedroom > 0 && (
            <div className="flex items-center gap-1.5 text-navy/50 text-xs">
              <Bed size={12} className="text-gold/80" />
              <span className="font-medium">{property.number_bedroom} bd</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1.5 text-navy/50 text-xs">
              <Bath size={12} className="text-gold/80" />
              <span className="font-medium">{property.number_bathroom} ba</span>
            </div>
          )}
          {property.square && (
            <div className="flex items-center gap-1.5 text-navy/50 text-xs">
              <Maximize2 size={12} className="text-gold/80" />
              <span className="font-medium">{property.square} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-card">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded-xl w-3/4" />
        <div className="h-3 skeleton rounded-xl w-1/2" />
        <div className="h-px bg-gray-100 mt-3" />
        <div className="flex gap-4 pt-0.5">
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-14" />
        </div>
      </div>
    </div>
  )
}
