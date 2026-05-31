import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Bed, Bath, Maximize2, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import { pickBestImage, RECENTLY_VIEWED_KEY as KEY } from '../utils/recentlyViewed'

function formatPrice(price, isRent) {
  if (!price) return 'On request'
  const n = parseFloat(price)
  return n.toLocaleString('en-US') + ' MAD'
  return `${n.toLocaleString()} MAD`
}

function getImg(image) {
  if (!image) return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80'
  if (image.startsWith('http')) {
    const m = image.match(/\/storage\/(.+)$/)
    return m ? `/storage/${m[1]}` : image
  }
  return image.startsWith('/') ? image : `/storage/${image}`
}

export default function RecentlyViewed() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [canLeft, setCanLeft]   = useState(false)
  const [canRight, setCanRight] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let stored = []
    try { stored = JSON.parse(localStorage.getItem(KEY)) || [] } catch {}
    if (stored.length === 0) return

    const validate = async () => {
      const results = await Promise.all(
        stored.map(p =>
          fetch(`/api/v1/properties/id/${p.id}`)
            .then(r => {
              if (!r.ok) return null
              return r.json().then(body => {
                const fresh = body?.data
                if (!fresh) return p
                return {
                  id:              fresh.id,
                  slug:            fresh.slug || fresh.id,
                  name:            fresh.name,
                  price:           fresh.price,
                  type:            fresh.type,
                  image:           pickBestImage(fresh),
                  city:            fresh.city?.name,
                  number_bedroom:  fresh.number_bedroom,
                  number_bathroom: fresh.number_bathroom,
                  square:          fresh.square,
                }
              })
            })
            .catch(() => null)
        )
      )
      const valid = results.filter(Boolean)
      setItems(valid)
      try { localStorage.setItem(KEY, JSON.stringify(valid)) } catch {}
    }

    validate()
  }, [])

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [items])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-gold" />
              <p className="text-xs font-bold uppercase tracking-widest text-gold">{t('sections.recentlyViewedLabel')}</p>
            </div>
            <h2 className="text-2xl font-bold text-navy">{t('sections.recentlyViewed')}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Nav buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll(-1)}
                disabled={!canLeft}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-navy/50 hover:text-navy hover:border-navy/30 disabled:opacity-30 disabled:cursor-default transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canRight}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-navy/50 hover:text-navy hover:border-navy/30 disabled:opacity-30 disabled:cursor-default transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Link to="/properties" className="flex items-center gap-1.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors">
              {t('sections.allProperties')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Scrollable row — scrollbar hidden */}
        <style>{`.rv-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div
          ref={scrollRef}
          className="rv-scroll flex gap-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/properties/${p.slug}`}
              className="flex-none w-64 group block bg-surface rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={getImg(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white font-bold text-sm drop-shadow">
                  {formatPrice(p.price, p.type === 'rent')}
                  {p.type === 'rent' && <span className="text-white/60 text-xs font-normal">/mo</span>}
                </div>
              </div>
              <div className="p-3">
                <p className="text-navy font-semibold text-xs line-clamp-1 group-hover:text-gold transition-colors">{p.name}</p>
                {p.city && (
                  <div className="flex items-center gap-1 text-navy/40 text-[11px] mt-1 mb-2">
                    <MapPin size={9} /> {p.city}
                  </div>
                )}
                <div className="flex items-center gap-3 text-navy/40 text-[11px]">
                  {p.number_bedroom > 0 && (
                    <span className="flex items-center gap-1"><Bed size={10} className="text-gold/70" /> {p.number_bedroom}</span>
                  )}
                  {p.number_bathroom > 0 && (
                    <span className="flex items-center gap-1"><Bath size={10} className="text-gold/70" /> {p.number_bathroom}</span>
                  )}
                  {p.square && (
                    <span className="flex items-center gap-1"><Maximize2 size={10} className="text-gold/70" /> {p.square}m²</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
