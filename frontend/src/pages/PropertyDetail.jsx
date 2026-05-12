import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bed, Bath, Maximize2, MapPin, Heart, Share2, BadgeCheck, ArrowLeft, Phone, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { propertiesApi } from '../api/client'

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

export default function PropertyDetail() {
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    propertiesApi.bySlug(slug)
      .then((res) => setProperty(res?.data || null))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
  }, [slug])

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
    ? (images[activeImg].startsWith('http') ? images[activeImg] : `/storage/${images[activeImg]}`)
    : `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80`

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-20">
        {/* Back */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/properties" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Back to Properties
          </Link>
        </div>

        {/* Hero Image */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden">
            <img src={mainImg} alt={property.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-navy'} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                <Share2 size={18} className="text-navy" />
              </button>
            </div>
            {property.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl uppercase">Featured</span>
              </div>
            )}
          </div>
          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => {
                const url = img.startsWith('http') ? img : `/storage/${img}`
                return (
                  <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold' : 'border-transparent'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl font-bold text-navy">{property.name}</h1>
                </div>
                <div className="flex items-center gap-2 text-navy/50 text-sm mb-4">
                  <MapPin size={15} />
                  <span>{property.city?.name}{property.state?.name ? `, ${property.state.name}` : ''}</span>
                </div>
                <div className="text-3xl font-bold text-gold mb-6">{formatPrice(property.price)}</div>

                {/* Specs */}
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

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">Description</h2>
                  <div className="text-navy/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: property.description }} />
                </div>
              )}

              {/* Features */}
              {property.features?.length > 0 && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-4">Features</h2>
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
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 shadow-card sticky top-24">
                <h3 className="text-navy font-bold text-lg mb-5">Contact Agent</h3>
                {property.agent ? (
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white font-bold">
                      {property.agent.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{property.agent.name}</div>
                      <div className="text-navy/40 text-xs">Verified Agent</div>
                    </div>
                  </div>
                ) : null}
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your name" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="email" placeholder="Your email" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="tel" placeholder="Your phone" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <textarea placeholder="I'm interested in this property..." rows={3} className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none" defaultValue={`I'm interested in ${property.name}`} />
                  <button type="submit" className="w-full btn-gold justify-center flex">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
