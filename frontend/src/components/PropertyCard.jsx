import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Heart, Bed, Bath, Maximize2, MapPin, BadgeCheck, BarChart2, Check,
  Camera, Play, Phone, MessageCircle, Share2, Building2, Layers,
  Clock, ChevronRight, ChevronLeft, X, Video,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useFavorites } from '../context/FavoritesContext'
import { useTranslation } from 'react-i18next'
import { isVideoPath, mediaUrl } from '../utils/media'
import { Toast, useToast } from './Toast'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop'

/* ─── Helpers ────────────────────────────────────────────────── */

function getImages(property) {
  const imgs = Array.isArray(property?.images) ? property.images : []
  return imgs.filter(i => !isVideoPath(i)).map(mediaUrl).filter(Boolean)
}

function getFirstImage(property) {
  const imgs = getImages(property)
  if (imgs.length) return imgs[0]
  if (property?.video_thumbnails) {
    const t = Object.values(property.video_thumbnails)[0]
    if (t) return t
  }
  return FALLBACK
}

function hasVideo(property) {
  return (Array.isArray(property?.images) ? property.images : []).some(i => isVideoPath(i))
}

function getVideos(property) {
  const imgs = Array.isArray(property?.images) ? property.images : []
  return imgs.filter(i => isVideoPath(i)).map(path => ({
    url: mediaUrl(path),
    thumbnail: property?.video_thumbnails?.[path] || null,
  }))
}

/* ─── Video Modal ───────────────────────────────────────────────── */
function VideoModal({ videos, propertyName, onClose }) {
  const [active, setActive] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const current = videos[active]

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <X size={16} />
        </button>

        {/* Title */}
        <p className="text-white/60 text-xs font-medium mb-2 flex items-center gap-1.5">
          <Video size={12} className="text-white/40" />
          {propertyName}
        </p>

        {/* Video player */}
        <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            key={current.url}
            src={current.url}
            poster={current.thumbnail || undefined}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        {/* Thumbnail strip — only when multiple videos */}
        {videos.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200"
                style={{ borderColor: i === active ? '#BA1932' : 'transparent', opacity: i === active ? 1 : 0.55 }}
              >
                {v.thumbnail
                  ? <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <Play size={14} className="text-white/60" />
                    </div>
                }
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function formatPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  return n.toLocaleString('en-US') + ' MAD'
}

function pricePerSqm(price, square) {
  if (!price || !square || parseFloat(square) <= 0) return null
  return Math.round(parseFloat(price) / parseFloat(square)).toLocaleString()
}

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7)  return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365)return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function getAgentInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function whatsappHref(phone, name) {
  const clean = phone?.replace(/\D/g, '')
  if (!clean) return null
  return `https://wa.me/${clean}?text=${encodeURIComponent(`Hello, I am interested in the property: ${name}`)}`
}

/* ─── Feature Tags ────────────────────────────────────────────── */
function FeatureTags({ features = [], max = 3 }) {
  if (!features.length) return null
  const shown = features.slice(0, max)
  const extra = features.length - shown.length
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map(f => (
        <span
          key={f.id}
          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(115,13,38,0.07)', color: '#730D26' }}
        >
          {f.icon && <i className={`${f.icon} text-[11px]`} />}
          {f.name}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          +{extra}
        </span>
      )}
    </div>
  )
}

/* ─── Image Slider ─────────────────────────────────────────────── */
function ImageSlider({ images, fallback, altText, hasVid, onVideoClick }) {
  const [idx, setIdx] = useState(0)
  const [imgError, setImgError] = useState(false)
  const touchStartX = useRef(null)

  const total = images.length
  const src = imgError ? fallback : (images[idx] || fallback)

  const prev = useCallback((e) => {
    e.stopPropagation()
    setIdx(i => (i - 1 + total) % total)
    setImgError(false)
  }, [total])

  const next = useCallback((e) => {
    e.stopPropagation()
    setIdx(i => (i + 1) % total)
    setImgError(false)
  }, [total])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      if (delta > 0) setIdx(i => (i + 1) % total)
      else setIdx(i => (i - 1 + total) % total)
      setImgError(false)
    }
    touchStartX.current = null
  }

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={src}
        alt={altText}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
      />

      {/* Prev / Next arrows — only show if multiple images */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          >
            <ChevronRight size={14} className="text-white" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); setImgError(false) }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === idx ? 16 : 5,
                  height: 5,
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Camera / video badges */}
      <div className="absolute bottom-14 left-3 flex items-center gap-1.5 z-10">
        {total > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.52)' }}>
            <Camera size={10} /> {total}
          </span>
        )}
        {hasVid && onVideoClick && (
          <button
            onClick={e => { e.stopPropagation(); onVideoClick() }}
            className="flex items-center gap-1 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'rgba(186,25,50,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <Play size={9} className="fill-white" /> Tour
          </button>
        )}
      </div>

      {/* Centered play button — visible when card is hovered and has video */}
      {hasVid && onVideoClick && (
        <button
          onClick={e => { e.stopPropagation(); onVideoClick() }}
          aria-label="Watch video tour"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
            style={{ background: 'rgba(186,25,50,0.90)', boxShadow: '0 4px 24px rgba(186,25,50,0.50)', backdropFilter: 'blur(4px)' }}
          >
            <Play size={22} className="fill-white text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   GRID CARD — used in FeaturedProperties, similar lists, grid view
═══════════════════════════════════════════════════════════════ */
export default function PropertyCard({ property, className = '' }) {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const { toggle: toggleCompare, isIn, isFull } = useCompare()
  const { isAuthenticated }       = useUserAuth()
  const { openAuthModal }         = useAuthModal()
  const { isFavorited, toggle: toggleFavorite } = useFavorites()
  const { toast, show: showToast, hide: hideToast } = useToast()
  const [videoOpen, setVideoOpen] = useState(false)

  if (!property) return null

  const rawSlug   = property.slug
  const slug      = (typeof rawSlug === 'string' ? rawSlug : rawSlug?.key) || property.id
  const href      = `/properties/${slug}`
  const isRent    = property.type === 'rent'
  const liked     = isFavorited(property.id)
  const inCmp     = isIn(property.id)
  const category  = property.categories?.[0]?.name || null
  const features  = (property.features || []).filter(f => f.name)
  const agent     = property.agent
  const ppm2      = pricePerSqm(property.price, property.square)
  const priceLabel= formatPrice(property.price)
  const added     = timeAgo(property.created_at)
  const isNew     = property.created_at && (Date.now() - new Date(property.created_at).getTime()) < 7 * 86_400_000
  const images    = getImages(property)
  const videos    = getVideos(property)
  const wa        = whatsappHref(agent?.phone, property.name)

  const handleLike = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      openAuthModal(() => toggleFavorite(property.id))
      showToast(t('auth.loginRequired', 'Please log in to save favorites'), 'error')
      return
    }
    const willLike = !liked
    toggleFavorite(property.id)
    showToast(
      willLike
        ? t('property.addedToFavorites', 'Added to favorites ❤️')
        : t('property.removedFromFavorites', 'Removed from favorites'),
      willLike ? 'success' : 'success'
    )
  }

  const handleCompare = (e) => {
    e.stopPropagation()
    if (!inCmp && isFull) {
      showToast(t('compare.full', 'Comparison full — max 3 properties'), 'error')
      return
    }
    toggleCompare(property)
    showToast(
      inCmp
        ? t('compare.removed', 'Removed from comparison')
        : t('compare.added', 'Added to comparison ↔'),
      'success'
    )
  }

  const handleShare = (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}${href}`
    if (navigator.share) {
      navigator.share({ title: property.name, url })
        .catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
        .then(() => showToast(t('property.linkCopied', 'Link copied to clipboard!')))
        .catch(() => showToast(t('property.shareFailed', 'Could not copy link'), 'error'))
    }
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation()
    if (wa) {
      showToast(t('property.openingWhatsApp', 'Opening WhatsApp…'))
      window.open(wa, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCall = (e) => {
    e.stopPropagation()
    if (agent?.phone) {
      showToast(t('property.callingAgent', `Calling ${agent.name || 'agent'}…`))
      window.location.href = `tel:${agent.phone}`
    }
  }

  const handleContact = (e) => {
    e.stopPropagation()
    navigate(`/properties/${slug}#contact`)
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(href)}
      onKeyDown={e => e.key === 'Enter' && navigate(href)}
      className={`group block rounded-3xl overflow-hidden bg-white transition-all duration-400 hover:-translate-y-1.5 active:scale-[0.98] touch-manip cursor-pointer ${className}`}
      style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(115,13,38,0.16), 0 4px 12px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(115,13,38,0.08), 0 1px 4px rgba(0,0,0,0.04)'}
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageSlider
          images={images.length ? images : [FALLBACK]}
          fallback={FALLBACK}
          altText={property.name}
          hasVid={videos.length > 0}
          onVideoClick={videos.length > 0 ? () => setVideoOpen(true) : null}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(115,13,38,0.78) 0%, rgba(0,0,0,0.20) 40%, transparent 100%)'
        }} />

        {/* Top-left badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          {property.is_featured && (
            <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
              {t('property.featured', 'Featured')}
            </span>
          )}
          {isNew && !property.is_featured && (
            <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase text-white bg-emerald-500/90">
              New
            </span>
          )}
          {isRent && (
            <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold uppercase text-white"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {t('property.forRent', 'Rent')}
            </span>
          )}
          {property.is_verified && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-bold text-white bg-blue-500/90">
              <BadgeCheck size={9} /> {t('property.verified', 'Verified')}
            </span>
          )}
        </div>

        {/* Top-right action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleLike}
            aria-label={liked ? 'Unlike' : 'Like'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm touch-manip ${liked ? 'scale-110' : 'hover:scale-110'}`}
            style={liked
              ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
              : { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }
            }
          >
            <Heart size={13} className={liked ? 'fill-white text-white' : 'text-navy/70'} />
          </button>
          <button
            onClick={handleCompare}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm touch-manip ${inCmp ? 'scale-110' : isFull ? 'cursor-not-allowed' : 'hover:scale-110'}`}
            style={inCmp
              ? { background: 'linear-gradient(135deg, #730D26, #BA1932)', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
              : { background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }
            }
          >
            {inCmp ? <Check size={12} className="text-white" /> : <BarChart2 size={12} className="text-navy/70" />}
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm touch-manip hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.60)' }}
          >
            <Share2 size={12} className="text-navy/70" />
          </button>
        </div>


        {/* Price overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            {priceLabel ? (
              <div>
                <span className="text-white font-extrabold text-lg leading-none drop-shadow-lg"
                  style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                  {priceLabel}
                </span>
                {isRent && <span className="text-white/60 text-xs ml-1">{t('property.perMonth', '/mo')}</span>}
              </div>
            ) : (
              <span className="text-white/70 text-sm font-semibold">{t('property.onRequest', 'On request')}</span>
            )}
            {ppm2 && (
              <p className="text-white/60 text-[10px] font-medium mt-0.5">{ppm2} MAD/m²</p>
            )}
          </div>
          {category && (
            <span className="text-[10px] font-semibold text-white/90 px-2 py-0.5 rounded-xl shrink-0"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
              {category}
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-sm leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[#BA1932] mb-1"
          style={{ color: '#730D26', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
          {property.name}
        </h3>

        {/* Location */}
        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'rgba(115,13,38,0.45)' }}>
            <MapPin size={10} className="shrink-0" style={{ color: '#BA1932' }} />
            <span className="truncate font-medium">
              {[property.city?.name, property.location].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Description preview */}
        {property.description && (
          <p className="text-[11px] text-gray-400 line-clamp-1 mb-2.5 leading-relaxed">
            {property.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap pb-3" style={{ borderBottom: '1px solid rgba(115,13,38,0.06)' }}>
          {property.number_bedroom > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(115,13,38,0.55)' }}>
              <Bed size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.number_bedroom} {t('property.beds', 'beds')}</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(115,13,38,0.55)' }}>
              <Bath size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.number_bathroom} {t('property.baths', 'baths')}</span>
            </div>
          )}
          {property.square > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(115,13,38,0.55)' }}>
              <Maximize2 size={11} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{property.square} m²</span>
            </div>
          )}
          {property.number_floor > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(115,13,38,0.55)' }}>
              <Layers size={10} style={{ color: '#BA1932', opacity: 0.7 }} />
              <span className="font-semibold">{t('property.floor', 'Floor')} {property.number_floor}</span>
            </div>
          )}
        </div>

        {/* Feature tags */}
        {features.length > 0 && (
          <div className="pt-2.5 pb-3" style={{ borderBottom: '1px solid rgba(115,13,38,0.06)' }}>
            <FeatureTags features={features} max={4} />
          </div>
        )}

        {/* Agent + action buttons */}
        <div className={`flex items-center gap-2 ${features.length > 0 ? 'pt-3' : 'pt-3 border-t'}`}
          style={features.length === 0 ? { borderTop: '1px solid rgba(115,13,38,0.06)' } : {}}>
          {agent ? (
            <div
              className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer group/agent"
              onClick={e => { e.stopPropagation(); navigate(`/agents/${agent.id}`) }}
              title={`View ${agent.name}'s profile`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white transition-transform duration-200 group-hover/agent:scale-110"
                style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}>
                {getAgentInitials(agent.name)}
              </div>
              <span className="text-[10px] font-medium truncate transition-colors duration-200 group-hover/agent:text-[#BA1932] group-hover/agent:underline"
                style={{ color: 'rgba(115,13,38,0.55)' }}>
                {agent.name}
              </span>
            </div>
          ) : <div className="flex-1" />}

          <div className="flex items-center gap-1.5 shrink-0">
            {wa && (
              <button
                onClick={handleWhatsApp}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: '#25D366', boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            )}
            {agent?.phone && (
              <button
                onClick={handleCall}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(115,13,38,0.08)', color: '#730D26' }}
                title="Call"
              >
                <Phone size={11} />
              </button>
            )}
            <button
              onClick={handleContact}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 text-white"
              style={{ background: 'linear-gradient(135deg, #730D26, #BA1932)' }}
              title="Contact agent"
            >
              <MessageCircle size={11} />
            </button>
          </div>
        </div>

        {/* Added date */}
        {added && (
          <p className="text-[10px] text-gray-300 mt-2 flex items-center gap-1">
            <Clock size={9} /> {added}
          </p>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {videoOpen && videos.length > 0 && (
        <VideoModal
          videos={videos}
          propertyName={property.name}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}

/* ─── Grid Skeleton ────────────────────────────────────────────── */
export function PropertyCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 24px rgba(115,13,38,0.06)' }}>
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 skeleton rounded-xl w-4/5" />
        <div className="h-3 skeleton rounded-xl w-1/2" />
        <div className="h-3 skeleton rounded-xl w-2/3" />
        <div className="h-px skeleton mt-2" />
        <div className="flex gap-3 pt-0.5">
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-14" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 skeleton rounded-full w-16" />
          <div className="h-5 skeleton rounded-full w-14" />
          <div className="h-5 skeleton rounded-full w-18" />
        </div>
        <div className="h-px skeleton mt-1" />
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 skeleton rounded-full" />
            <div className="h-3 skeleton rounded w-20" />
          </div>
          <div className="flex gap-1.5">
            <div className="w-7 h-7 skeleton rounded-full" />
            <div className="w-7 h-7 skeleton rounded-full" />
            <div className="w-7 h-7 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIST CARD — used in Properties page list view
═══════════════════════════════════════════════════════════════ */
export function ListPropertyCard({ property, isActive, onClick, cardRef }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)
  const { isFavorited, toggle: toggleFavorite } = useFavorites()
  const { isAuthenticated } = useUserAuth()
  const { openAuthModal }   = useAuthModal()

  if (!property) return null

  const rawSlug    = property.slug
  const slug       = (typeof rawSlug === 'string' ? rawSlug : rawSlug?.key) || property.id
  const isRent     = property.type === 'rent'
  const liked      = isFavorited(property.id)
  const priceLabel = formatPrice(property.price)
  const imgSrc     = imgError ? FALLBACK : getFirstImage(property)

  const handleLike = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!isAuthenticated) { openAuthModal(() => toggleFavorite(property.id)); return }
    toggleFavorite(property.id)
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="group flex rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-200 hover:shadow-lg"
      style={{
        boxShadow: isActive
          ? '0 6px 24px rgba(115,13,38,0.16)'
          : '0 2px 10px rgba(115,13,38,0.07)',
        borderLeft: isActive ? '4px solid #BA1932' : '4px solid transparent',
        background: isActive ? 'rgba(186,25,50,0.025)' : 'white',
        minHeight: 120,
      }}
    >
      {/* ── Image ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ width: 120 }}>
        <img
          src={imgSrc}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Type badge */}
        {isRent ? (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase text-white"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            {t('property.forRent', 'Rent')}
          </span>
        ) : (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase text-white"
            style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)' }}>
            {t('property.forSale', 'Buy')}
          </span>
        )}
      </div>

      {/* ── Details ── */}
      <div className="flex-1 min-w-0 px-3 py-3 flex flex-col justify-between">

        {/* Top: title + heart */}
        <div className="flex items-start justify-between gap-1.5">
          <h3
            className="font-bold text-sm leading-snug line-clamp-2 flex-1 min-w-0 group-hover:text-[#BA1932] transition-colors"
            style={{ color: '#1a2035', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            {property.name}
          </h3>
          <button
            onClick={handleLike}
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
            style={liked
              ? { background: 'linear-gradient(135deg,#730D26,#BA1932)' }
              : { background: 'rgba(115,13,38,0.07)' }}
          >
            <Heart size={10} className={liked ? 'fill-white text-white' : 'text-[#BA1932]'} />
          </button>
        </div>

        {/* Location */}
        {(property.city?.name || property.location) && (
          <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(115,13,38,0.5)' }}>
            <MapPin size={9} style={{ color: '#BA1932', flexShrink: 0 }} />
            <span className="text-[11px] truncate">
              {[property.city?.name, property.location].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mt-1.5">
          {property.number_bedroom > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Bed size={10} style={{ color: '#BA1932', opacity: 0.75 }} />
              {property.number_bedroom} ch
            </span>
          )}
          {property.number_bathroom > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Bath size={10} style={{ color: '#BA1932', opacity: 0.75 }} />
              {property.number_bathroom} sdb
            </span>
          )}
          {property.square > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(115,13,38,0.5)' }}>
              <Maximize2 size={10} style={{ color: '#BA1932', opacity: 0.75 }} />
              {property.square} m²
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2 pt-2"
          style={{ borderTop: '1px solid rgba(115,13,38,0.06)' }}>
          <span className="font-bold text-sm" style={{ color: '#BA1932', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {priceLabel || t('property.onRequest', 'On request')}
            {isRent && priceLabel && <span className="text-[10px] font-normal text-gray-400 ml-1">/mo</span>}
          </span>
          <Link
            to={`/properties/${slug}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-0.5 text-[11px] font-bold transition-opacity hover:opacity-75 shrink-0"
            style={{ color: '#BA1932' }}
          >
            {t('common.view', 'Voir')} <ChevronRight size={11} />
          </Link>
        </div>

      </div>
    </div>
  )
}

/* ─── List Skeleton ─────────────────────────────────────────────── */
export function ListPropertyCardSkeleton() {
  return (
    <div className="flex rounded-2xl overflow-hidden bg-white" style={{ minHeight: 120, boxShadow: '0 2px 10px rgba(115,13,38,0.07)' }}>
      <div className="shrink-0 skeleton" style={{ width: 120 }} />
      <div className="flex-1 px-3 py-3 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="w-6 h-6 skeleton rounded-full shrink-0" />
        </div>
        <div className="h-3 skeleton rounded w-2/5 mt-1" />
        <div className="flex gap-3 mt-1.5">
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-10" />
          <div className="h-3 skeleton rounded w-12" />
        </div>
        <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid rgba(115,13,38,0.06)' }}>
          <div className="h-4 skeleton rounded w-20" />
          <div className="h-3 skeleton rounded w-10" />
        </div>
      </div>
    </div>
  )
}
