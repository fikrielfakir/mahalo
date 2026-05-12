import { useState } from 'react'
import { Heart, Bed, Bath, Maximize2, MapPin, BadgeCheck, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const BADGE_STYLES = {
  featured: 'bg-gold text-navy',
  new: 'bg-emerald-500 text-white',
  verified: 'bg-blue-500 text-white',
}

function getImageUrl(property) {
  const img = Array.isArray(property?.images) ? property.images[0] : property?.image
  if (img) {
    if (img.startsWith('http')) return img
    return `/storage/${img}`
  }
  return `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop`
}

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function PropertyCard({ property, className = '' }) {
  const [liked, setLiked] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!property) return null

  const slug = property.slug || property.id
  const badge = property.is_featured ? 'featured' : property.is_new ? 'new' : null

  return (
    <Link
      to={`/properties/${slug}`}
      className={`property-card group block cursor-pointer ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgError ? `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80` : getImageUrl(property)}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {badge && (
            <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide ${BADGE_STYLES[badge]}`}>
              {badge}
            </span>
          )}
          {property.is_verified && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-blue-500 text-white">
              <BadgeCheck size={11} /> Verified
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <Heart
            size={15}
            className={liked ? 'fill-red-500 text-red-500' : 'text-navy/60'}
          />
        </button>

        {/* Price overlay (visible on hover) */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="text-white font-bold text-lg drop-shadow-lg">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-navy font-bold text-lg">{formatPrice(property.price)}</span>
          {property.price_per_month && (
            <span className="text-navy/40 text-xs">/month</span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-navy font-semibold text-sm leading-snug mb-2 line-clamp-1 group-hover:text-gold transition-colors duration-200">
          {property.name}
        </h3>

        {/* Location */}
        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1 text-navy/50 text-xs mb-3">
            <MapPin size={12} />
            <span className="truncate">{property.city?.name || property.location}</span>
          </div>
        )}

        {/* Specs */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          {property.number_bedroom > 0 && (
            <div className="flex items-center gap-1.5 text-navy/60 text-xs">
              <Bed size={13} />
              <span>{property.number_bedroom}</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1.5 text-navy/60 text-xs">
              <Bath size={13} />
              <span>{property.number_bathroom}</span>
            </div>
          )}
          {property.square && (
            <div className="flex items-center gap-1.5 text-navy/60 text-xs">
              <Maximize2 size={13} />
              <span>{property.square} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-card animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded-xl w-2/3" />
        <div className="h-4 bg-gray-200 rounded-xl w-full" />
        <div className="h-3 bg-gray-200 rounded-xl w-1/2" />
        <div className="h-px bg-gray-100" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  )
}
