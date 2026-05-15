import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bed, Bath, Maximize2, MapPin, Heart, Share2, BadgeCheck, ArrowLeft, Phone, Mail, Loader2, Star, BarChart2, Video, Play, Home, Wrench, CalendarDays, Layers, Compass, Grid2X2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import MortgageCalculator from '../components/MortgageCalculator'
import SimilarProperties from '../components/SimilarProperties'
import { trackRecentlyViewed } from '../components/RecentlyViewed'
import { useCompare } from '../context/CompareContext'
import { propertiesApi, consultsApi } from '../api/client'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { isVideoPath, mediaUrl } from '../utils/media'

const FAVORITES_KEY = 'mahalo_favorites'
function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [] } catch { return [] } }
function saveFavorites(ids) { try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)) } catch {} }

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

function StarRow({ rating, setRating, interactive = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => setRating(n) : undefined}
          onMouseEnter={interactive ? () => setHover(n) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
        >
          <Star
            size={interactive ? 22 : 14}
            className={n <= (hover || rating) ? 'fill-gold text-gold' : 'text-gray-200 fill-gray-200'}
          />
        </button>
      ))}
    </div>
  )
}

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' }
const EMPTY_REVIEW = { reviewer_name: '', rating: 0, comment: '' }

export default function PropertyDetail() {
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [playingVideo, setPlayingVideo] = useState(false)
  const [liked, setLiked]       = useState(false)

  const [form, setForm]             = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const [reviews, setReviews]           = useState([])
  const [reviewForm, setReviewForm]     = useState(EMPTY_REVIEW)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted]   = useState(false)

  const { toast, show: showToast, hide: hideToast } = useToast()
  const { isAuthenticated } = useUserAuth()
  const { openAuthModal } = useAuthModal()

  /* ── SEO meta tag management ─────────────────────────────── */
  const prevTitle = useRef(document.title)
  useEffect(() => {
    if (!property) return
    const title = `${property.name}${property.city ? ' — ' + property.city.name : ''} | Mahalo Real Estate`
    const desc  = property.description
      ? property.description.replace(/<[^>]*>/g, '').slice(0, 160)
      : `${property.type === 'rent' ? 'For Rent' : 'For Sale'} • ${property.square ? property.square + ' m² • ' : ''}${property.number_bedroom ? property.number_bedroom + ' bed • ' : ''}${property.city?.name || ''}`
    const imgUrl = property.images?.[0]
      ? (property.images[0].startsWith('http') ? property.images[0] : `${window.location.origin}/storage/${property.images[0]}`)
      : ''
    const canonUrl = `${window.location.origin}/properties/${property.slug}`

    document.title = title

    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let el = document.querySelector(sel)
      if (!el) {
        el = document.createElement('meta')
        prop ? el.setAttribute('property', name) : el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el) }
      el.setAttribute('href', href)
    }

    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', canonUrl, true)
    if (imgUrl) setMeta('og:image', imgUrl, true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', desc)
    if (imgUrl) setMeta('twitter:image', imgUrl)
    setLink('canonical', canonUrl)

    return () => { document.title = prevTitle.current }
  }, [property])

  useEffect(() => {
    propertiesApi.bySlug(slug)
      .then((res) => {
        const p = res?.data || null
        setProperty(p)
        if (p) {
          setLiked(getFavorites().includes(p.id))
          trackRecentlyViewed(p)
          propertiesApi.reviews(p.id)
            .then(r => setReviews(Array.isArray(r?.data) ? r.data : []))
            .catch(() => setReviews([]))
        }
      })
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleLike = () => {
    if (!property) return
    if (!isAuthenticated) {
      openAuthModal(() => {
        const favs = getFavorites()
        if (!favs.includes(property.id)) {
          saveFavorites([...favs, property.id])
          setLiked(true)
        }
      })
      return
    }
    const favs = getFavorites()
    const next = favs.includes(property.id)
      ? favs.filter(f => f !== property.id)
      : [...favs, property.id]
    saveFavorites(next)
    setLiked(next.includes(property.id))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Link copied to clipboard!')
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Please fill in your name and phone', 'error')
      return
    }
    setSubmitting(true)
    try {
      await consultsApi.store({
        name: form.name, email: form.email, phone: form.phone,
        content: form.message || `I'm interested in ${property?.name}`,
        property_id: property?.id,
      })
      showToast('Message sent! An agent will contact you shortly.')
      setForm(EMPTY_FORM)
    } catch {
      showToast('Failed to send message. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.reviewer_name.trim() || reviewForm.rating === 0) {
      showToast('Please enter your name and select a rating', 'error')
      return
    }
    setReviewSubmitting(true)
    try {
      await consultsApi.store({
        name: reviewForm.reviewer_name,
        phone: 'review',
        message: `⭐ ${reviewForm.rating}/5 — ${reviewForm.comment || 'No comment'}`,
        property_id: property?.id,
      })
      const newReview = {
        id: Date.now(),
        reviewer_name: reviewForm.reviewer_name,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        created_at: new Date().toISOString(),
      }
      setReviews(r => [newReview, ...r])
      setReviewSubmitted(true)
      setReviewForm(EMPTY_REVIEW)
    } catch {
      showToast('Failed to submit review. Please try again.', 'error')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-24 px-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-24">
          <p className="text-navy/50 text-lg">Property not found</p>
          <Link to="/properties" className="btn-gold">Browse Properties</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = property.images?.length ? property.images : [property.image].filter(Boolean)
  const mainImg = images[activeImg]
    ? mediaUrl(images[activeImg])
    : `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80`

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/properties" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Properties
          </Link>
        </div>

        {/* Hero Image / Video */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden bg-gray-900">
            {isVideoPath(images[activeImg]) ? (
              playingVideo ? (
                <video
                  key={mainImg}
                  src={mainImg}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setPlayingVideo(true)}
                >
                  {(() => {
                    const posterUrl = property.video_thumbnails?.[images[activeImg]] || property.thumbnail_url || ''
                    return posterUrl ? (
                      <img src={posterUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video
                        src={mainImg}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  })()}
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/50 flex items-center justify-center group-hover:bg-white/25 group-hover:border-white/80 transition-all duration-200 shadow-lg">
                      <Play size={34} className="text-white fill-white ml-1" />
                    </div>
                    <span className="text-white/80 text-sm font-semibold tracking-wide drop-shadow">Tap to play video</span>
                  </div>
                </div>
              )
            ) : (
              <img src={mainImg} alt={property.name} className="w-full h-full object-cover" />
            )}
            {!playingVideo && (
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent pointer-events-none" />
            )}
            {/* Watermark — shown when video is playing */}
            {isVideoPath(images[activeImg]) && playingVideo && (
              <div className="absolute bottom-14 right-4 pointer-events-none select-none">
                <span className="text-white/30 font-bold text-base tracking-widest uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>MAHALO</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={handleLike} className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-navy'} />
              </button>
              <button onClick={handleShare} className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors" title="Copy link">
                <Share2 size={18} className="text-navy" />
              </button>
            </div>
            {property.is_featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl uppercase">Featured</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setPlayingVideo(false); }}
                  className={`relative shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold' : 'border-transparent'}`}
                >
                  {isVideoPath(img) ? (
                    property.video_thumbnails?.[img] ? (
                      <div className="relative w-full h-full">
                        <img src={property.video_thumbnails[img]} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play size={10} className="text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                          <Play size={10} className="text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )
                  ) : (
                    <img src={mediaUrl(img)} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Title & Price */}
              <div>
                <h1 className="text-3xl font-bold text-navy mb-3">{property.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-navy/50 text-sm">
                    <MapPin size={15} />
                    <span>{property.city?.name}{property.state?.name ? `, ${property.state.name}` : ''}</span>
                  </div>
                  {avgRating && (
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="fill-gold text-gold" />
                      <span className="text-navy font-bold text-sm">{avgRating}</span>
                      <span className="text-navy/40 text-xs">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-gold mt-4 mb-6">{formatPrice(property.price)}</div>

                <div className="grid grid-cols-3 gap-4 p-5 bg-white rounded-2xl shadow-card">
                  {property.number_bedroom > 0 && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Bed size={20} className="text-gold" />
                      <span className="text-navy font-bold">{property.number_bedroom}</span>
                      <span className="text-navy/40 text-xs">Bedrooms</span>
                    </div>
                  )}
                  {property.number_bathroom > 0 && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Bath size={20} className="text-gold" />
                      <span className="text-navy font-bold">{property.number_bathroom}</span>
                      <span className="text-navy/40 text-xs">Bathrooms</span>
                    </div>
                  )}
                  {property.square && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Maximize2 size={20} className="text-gold" />
                      <span className="text-navy font-bold">{property.square}</span>
                      <span className="text-navy/40 text-xs">m²</span>
                    </div>
                  )}
                </div>
              </div>

              {property.description && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">Description</h2>
                  <div className="text-navy/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: property.description }} />
                </div>
              )}

              {/* General Characteristics */}
              {(property.categories?.length > 0 || property.condition || property.age_range ||
                property.number_floor || property.orientation || property.flooring) && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-5">General Characteristics</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {property.categories?.[0] && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Home size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Type of property</p>
                          <p className="text-navy font-bold text-sm">{property.categories[0].name}</p>
                        </div>
                      </div>
                    )}
                    {property.condition && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench size={16} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Condition</p>
                          <p className="text-navy font-bold text-sm">{property.condition}</p>
                        </div>
                      </div>
                    )}
                    {property.age_range && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                          <CalendarDays size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Age</p>
                          <p className="text-navy font-bold text-sm">{property.age_range}</p>
                        </div>
                      </div>
                    )}
                    {property.number_floor != null && property.number_floor !== '' && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Layers size={16} className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Floor number</p>
                          <p className="text-navy font-bold text-sm">
                            {property.number_floor}{property.number_floor === 1 ? 'st' : property.number_floor === 2 ? 'nd' : property.number_floor === 3 ? 'rd' : 'th'}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.orientation && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Compass size={16} className="text-cyan-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Orientation</p>
                          <p className="text-navy font-bold text-sm">{property.orientation}</p>
                        </div>
                      </div>
                    )}
                    {property.flooring && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Grid2X2 size={16} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-navy/40 text-xs mb-0.5">Flooring</p>
                          <p className="text-navy font-bold text-sm">{property.flooring}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.features?.length > 0 && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {property.features.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 text-navy/70 text-sm">
                        <div className="w-5 h-5 rounded-lg bg-gold/10 flex items-center justify-center">
                          <BadgeCheck size={12} className="text-gold" />
                        </div>
                        {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews section */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-navy font-bold text-xl">
                    Reviews
                    {reviews.length > 0 && <span className="text-navy/40 font-normal text-base ml-2">({reviews.length})</span>}
                  </h2>
                  {avgRating && (
                    <div className="flex items-center gap-2">
                      <Star size={18} className="fill-gold text-gold" />
                      <span className="text-navy font-bold text-lg">{avgRating}</span>
                      <span className="text-navy/40 text-sm">/ 5</span>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white rounded-2xl p-5 shadow-card">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-navy font-semibold text-sm">{r.reviewer_name || r.name || 'Anonymous'}</div>
                            {r.created_at && (
                              <div className="text-navy/35 text-xs mt-0.5">
                                {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                            )}
                          </div>
                          <StarRow rating={r.rating || 0} />
                        </div>
                        {r.comment && <p className="text-navy/60 text-sm leading-relaxed">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 text-center mb-6 shadow-card">
                    <Star size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-navy/40 text-sm">No reviews yet. Be the first to review this property.</p>
                  </div>
                )}

                {/* Add review form */}
                {reviewSubmitted ? (
                  <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                    <p className="text-emerald-700 font-semibold text-sm">Thank you for your review!</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-5 shadow-card">
                    <h3 className="text-navy font-semibold text-sm mb-4">Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <input
                        type="text" placeholder="Your name *"
                        value={reviewForm.reviewer_name}
                        onChange={e => setReviewForm(f => ({ ...f, reviewer_name: e.target.value }))}
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                      />
                      <div>
                        <p className="text-navy/40 text-xs mb-2">Rating *</p>
                        <StarRow
                          rating={reviewForm.rating}
                          setRating={r => setReviewForm(f => ({ ...f, rating: r }))}
                          interactive
                        />
                      </div>
                      <textarea
                        placeholder="Share your experience..."
                        rows={3}
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                      />
                      <button type="submit" disabled={reviewSubmitting} className="btn-navy flex items-center gap-2 disabled:opacity-60">
                        {reviewSubmitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-card sticky top-24">
                <h3 className="text-navy font-bold text-lg mb-5">Contact Agent</h3>
                {property.agent && (
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white font-bold">
                      {property.agent.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{property.agent.name}</div>
                      <div className="text-navy/40 text-xs">Verified Agent</div>
                    </div>
                  </div>
                )}
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text" placeholder="Your name *"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    required
                  />
                  <input
                    type="email" placeholder="Your email"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                  />
                  <input
                    type="tel" placeholder="Your phone *"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    required
                  />
                  <textarea
                    placeholder="Your message..."
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                  />
                  <button type="submit" disabled={submitting} className="w-full btn-gold justify-center flex gap-2 disabled:opacity-60">
                    {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send Message'}
                  </button>
                </form>

                {property.agent?.phone && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm transition-colors">
                      <Phone size={14} /> {property.agent.phone}
                    </a>
                    {property.agent.email && (
                      <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm transition-colors">
                        <Mail size={14} /> {property.agent.email}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Mortgage Calculator */}
              {property.price && (
                <MortgageCalculator price={parseFloat(property.price)} />
              )}
            </div>
          </div>

          {/* Similar Properties */}
          <SimilarProperties property={property} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
