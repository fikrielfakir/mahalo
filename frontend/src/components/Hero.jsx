import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Search, MapPin, SlidersHorizontal, BedDouble, DollarSign, Home, Users, ShieldCheck, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi, agentsApi } from '../api/client'
import { useTranslation } from 'react-i18next'

/* ─────────────────────────── Price helpers ──────────────────────────── */
const bedroomOptions = ['Any', '1', '2', '3', '4', '5+']
const PRICE_MAX = 10_000_000
const SNAP_POINTS = [0, 300_000, 500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 7_000_000, 10_000_000]

const snapPrice = (val) =>
  SNAP_POINTS.reduce((a, b) => (Math.abs(b - val) < Math.abs(a - val) ? b : a))

const fmtPrice = (val) => {
  if (val <= 0) return '0'
  if (val >= PRICE_MAX) return '10M+'
  if (val >= 1_000_000) {
    const m = val / 1_000_000
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`
  }
  return `${Math.round(val / 1_000)}K`
}

/* ─────────────────── Single draggable handle circle ─────────────────── */
function PriceHandle({ pct, label, onPointerDown }) {
  const SIZE = 18
  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        position: 'absolute',
        left: `${pct}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: SIZE, height: SIZE,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
        border: '2.5px solid white',
        boxShadow: '0 2px 10px rgba(186,25,50,0.55)',
        cursor: 'grab',
        zIndex: 2,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <span style={{
        position: 'absolute',
        bottom: SIZE + 5,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10,
        fontWeight: 800,
        color: '#730D26',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        lineHeight: 1,
        letterSpacing: '0.02em',
      }}>
        {label}
      </span>
    </div>
  )
}

/* ────────────────────── Dual-handle range slider ────────────────────── */
function PriceRangeSlider({ minVal, maxVal, onChange }) {
  const { t } = useTranslation()
  const trackRef = useRef(null)
  const stateRef = useRef({ minVal, maxVal })
  stateRef.current = { minVal, maxVal }

  const pct = (val) => (val / PRICE_MAX) * 100

  const getValFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return snapPrice(ratio * PRICE_MAX)
  }

  const startDrag = (handle) => (e) => {
    e.preventDefault()
    /* Stop the event reaching the fixed backdrop so the popover stays open */
    e.stopPropagation()

    const onMove = (ev) => {
      if (!trackRef.current) return
      const clientX = ev.clientX ?? ev.touches?.[0]?.clientX
      const val = getValFromClientX(clientX)
      const { minVal: mn, maxVal: mx } = stateRef.current
      if (handle === 'min' && val < mx) onChange(val, mx)
      if (handle === 'max' && val > mn) onChange(mn, val)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const minPct = pct(minVal)
  const maxPct = pct(maxVal)
  const minLabel = minVal === 0 ? t('filters.minPrice') : fmtPrice(minVal)
  const maxLabel = maxVal >= PRICE_MAX ? t('filters.maxPrice') : fmtPrice(maxVal)

  return (
    <div style={{ position: 'relative', paddingTop: 32, paddingBottom: 6 }}>
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: 4,
          background: 'rgba(115,13,38,0.15)',
          borderRadius: 2,
          margin: '0 10px',
        }}
      >
        {/* Filled range */}
        <div style={{
          position: 'absolute',
          left: `${minPct}%`,
          right: `${100 - maxPct}%`,
          top: 0, bottom: 0,
          background: 'linear-gradient(90deg, #730D26, #BA1932)',
          borderRadius: 2,
        }} />
        <PriceHandle pct={minPct} label={minLabel} onPointerDown={startDrag('min')} />
        <PriceHandle pct={maxPct} label={maxLabel} onPointerDown={startDrag('max')} />
      </div>
    </div>
  )
}

/* ──────────── Price zone trigger + portal popover ───────────────────── */
function PriceZone({ minPrice, maxPrice, onChange, label, isMobile = false }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const isDefault = minPrice === 0 && maxPrice === PRICE_MAX
  const summary = isDefault
    ? t('filters.anyPrice')
    : `${fmtPrice(minPrice)} – ${fmtPrice(maxPrice)}`

  const openPopover = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({
        top:  rect.bottom + 10,
        left: isMobile ? rect.left : rect.left + rect.width / 2,
      })
    }
    setOpen(true)
  }, [isMobile])

  const toggle = () => (open ? setOpen(false) : openPopover())

  /* Popover panel (rendered via portal at body level — no z-index stacking issues) */
  const popover = open
    ? createPortal(
        <>
          {/* Transparent backdrop — click it to close */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9990 }}
            onPointerDown={() => setOpen(false)}
          />

          {/* Floating panel */}
          <div
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              transform: isMobile ? 'none' : 'translateX(-50%)',
              width: isMobile ? 'calc(100vw - 32px)' : 300,
              zIndex: 9999,
              background: 'white',
              borderRadius: 18,
              boxShadow: '0 20px 60px rgba(115,13,38,0.22), 0 4px 16px rgba(0,0,0,0.10)',
              padding: '18px 22px 22px',
            }}
            /* Prevent backdrop from catching pointer events inside panel */
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(115,13,38,0.38)' }}>
              {label}
            </div>
            <PriceRangeSlider minVal={minPrice} maxVal={maxPrice} onChange={onChange} />

            {/* Reset link */}
            {!isDefault && (
              <button
                onClick={() => onChange(0, PRICE_MAX)}
                className="mt-1 text-[10px] font-semibold"
                style={{ color: '#BA1932', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {t('filters.anyPrice')} ×
              </button>
            )}
          </div>
        </>,
        document.body
      )
    : null

  return (
    <>
      {/* Trigger (inline in search bar) */}
      <div
        ref={triggerRef}
        onClick={toggle}
        className="flex items-center gap-2 cursor-pointer"
        style={isMobile
          ? { padding: '14px 20px', borderBottom: '1px solid rgba(115,13,38,0.07)' }
          : { padding: '0 16px', height: '100%', flex: '1.4 1 140px', minWidth: 0 }
        }
      >
        <DollarSign size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>
            {label}
          </div>
          <div className="text-sm font-semibold truncate" style={{ color: isDefault ? 'rgba(115,13,38,0.45)' : '#730D26' }}>
            {summary}
          </div>
        </div>
        <ChevronDown
          size={12}
          style={{ color: '#BA1932', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </div>

      {popover}
    </>
  )
}

/* ═══════════════════════════════ Hero ═══════════════════════════════════ */
export default function Hero() {
  const { t } = useTranslation()

  /* Store tab as a stable key — NEVER the translated label.
     This means language switches never lose the active state. */
  const TAB_KEYS = ['buy', 'rent', 'projects']
  const tabLabels = { buy: t('hero.tabBuy'), rent: t('hero.tabRent'), projects: t('hero.tabProjects') }

  const [activeTabKey, setActiveTabKey] = useState('buy')
  const [location, setLocation]         = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice]         = useState(0)
  const [maxPrice, setMaxPrice]         = useState(PRICE_MAX)
  const [bedrooms, setBedrooms]         = useState('Any')
  const [categories, setCategories]     = useState([])
  const [propertiesCount, setPropertiesCount] = useState(null)
  const [agentsCount, setAgentsCount]         = useState(null)
  const [citiesCount, setCitiesCount]         = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    propertiesApi.filters()
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data?.categories)) setCategories(data.categories)
        if (Array.isArray(data?.cities))     setCitiesCount(data.cities.length)
      })
      .catch(() => {})

    propertiesApi.list({ per_page: 1 })
      .then((res) => {
        const total = res?.meta?.total ?? res?.total
        if (total != null) setPropertiesCount(total)
      })
      .catch(() => {})

    agentsApi.list({ per_page: 1 })
      .then((res) => {
        const total = res?.meta?.total ?? res?.total
        if (total != null) setAgentsCount(total)
      })
      .catch(() => {})
  }, [])

  const fmtCount = (n, fallback) => {
    if (n == null) return fallback
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`
    return `${n}+`
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (activeTabKey === 'rent')     params.set('type', 'rent')
    else if (activeTabKey === 'buy') params.set('type', 'sale')
    if (location)           params.set('search', location)
    if (propertyType)       params.set('category_id', propertyType)
    if (bedrooms !== 'Any') params.set('number_bedroom', bedrooms)
    if (minPrice > 0)           params.set('min_price', minPrice)
    if (maxPrice < PRICE_MAX)   params.set('max_price', maxPrice)
    navigate(`${activeTabKey === 'projects' ? '/projects' : '/properties'}?${params.toString()}`)
  }

  const handlePriceChange = (mn, mx) => { setMinPrice(mn); setMaxPrice(mx) }

  const stats = [
    { icon: Home,        value: fmtCount(propertiesCount, '1K+'),         label: t('stats.properties') },
    { icon: Users,       value: '8K+',                                     label: t('stats.happyClients') },
    { icon: ShieldCheck, value: fmtCount(agentsCount, '50+'),              label: t('stats.verifiedAgents') },
    { icon: MapPin,      value: citiesCount ? `${citiesCount}+` : '10+',  label: t('stats.cities') },
  ]

  const divider = { borderRight: '1px solid rgba(115,13,38,0.08)' }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Luxury Villa" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,1,2,0.97) 0%, rgba(25,3,10,0.93) 22%, rgba(115,13,38,0.70) 48%, rgba(115,13,38,0.22) 70%, rgba(0,0,0,0.04) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.60) 100%)' }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 xs:px-5 sm:px-8 lg:px-10 pt-20 xs:pt-24 sm:pt-32 pb-12 sm:pb-24">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 sm:mb-7 animate-fade-in"
            style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', padding: '5px 14px' }}>
            <span style={{ color: '#BA1932', fontSize: '11px' }}>◆</span>
            <span className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="font-bold text-white leading-[1.06] tracking-tight mb-4 sm:mb-5 animate-fade-up"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: 'clamp(1.85rem, 7vw, 4.5rem)' }}>
            {t('hero.title1')}<br />
            {t('hero.title2').split(' ').slice(0, -1).join(' ')}{' '}
            <span style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 55%, #BA1932 100%)' }}>
              Mahalo
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-xs xs:text-sm sm:text-base font-light max-w-[260px] xs:max-w-xs sm:max-w-sm mb-5 sm:mb-9 animate-fade-up" style={{ animationDelay: '80ms' }}>
            {t('hero.subtitle')}
          </p>

          {/* ── Tabs — keyed so language switching never loses the active highlight ── */}
          <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
            {TAB_KEYS.map((key) => {
              const active = activeTabKey === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTabKey(key)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300"
                  style={{
                    borderRadius: '999px',
                    ...(active
                      ? { background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)', color: 'white', boxShadow: '0 4px 16px rgba(186,25,50,0.40)' }
                      : { background: 'transparent', color: 'rgba(255,255,255,0.60)' })
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.60)' }}
                >
                  {tabLabels[key]}
                </button>
              )
            })}
          </div>

          {/* ── Search bar ── */}
          <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>

            {/* Desktop pill */}
            <div
              className="hidden sm:flex items-stretch"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: '999px',
                boxShadow: '0 20px 60px rgba(115,13,38,0.28), 0 4px 16px rgba(0,0,0,0.12)',
                overflow: 'hidden',   /* keeps rounded corners on inner children */
              }}
            >
              {/* Location */}
              <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ ...divider, flex: '2 1 160px', minWidth: 0 }}>
                <MapPin size={15} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.location')}</div>
                  <input
                    type="text" placeholder={t('hero.locationPlaceholder')} value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ display: 'block', width: '100%', fontSize: 14, fontWeight: 600, background: 'transparent', outline: 'none', color: '#730D26', border: 'none', padding: 0 }}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ ...divider, flex: '1 1 100px', minWidth: 0 }}>
                <SlidersHorizontal size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.type')}</div>
                  <select
                    value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    style={{ display: 'block', width: '100%', fontSize: 13, fontWeight: 600, background: 'transparent', outline: 'none', border: 'none', color: '#730D26', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: 0 }}
                  >
                    <option value="">{t('filters.allTypes')}</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ ...divider, flex: '1 1 90px', minWidth: 0 }}>
                <BedDouble size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.bedrooms')}</div>
                  <select
                    value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                    style={{ display: 'block', width: '100%', fontSize: 13, fontWeight: 600, background: 'transparent', outline: 'none', border: 'none', color: '#730D26', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: 0 }}
                  >
                    {bedroomOptions.map((b) => (
                      <option key={b} value={b}>{b === 'Any' ? t('filters.anyBedrooms') : `${b} ${t('property.beds')}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price — portal popover, no overflow clipping issues */}
              <div style={{ ...divider, display: 'flex', alignItems: 'stretch', flex: '1.4 1 140px', minWidth: 0 }}>
                <PriceZone
                  minPrice={minPrice} maxPrice={maxPrice}
                  onChange={handlePriceChange} label={t('hero.priceRange')}
                />
              </div>

              {/* Search button */}
              <div className="p-1.5 shrink-0 flex items-center">
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 text-white font-bold text-sm transition-all duration-300 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)', borderRadius: '999px', boxShadow: '0 4px 20px rgba(186,25,50,0.40)', padding: '12px 24px', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(186,25,50,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.40)'}
                >
                  <Search size={16} />
                  {t('hero.searchBtn')}
                </button>
              </div>
            </div>

            {/* Mobile stacked card */}
            <div
              className="flex sm:hidden flex-col"
              style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', borderRadius: 24, boxShadow: '0 20px 60px rgba(115,13,38,0.28), 0 4px 16px rgba(0,0,0,0.12)', overflow: 'hidden' }}
            >
              {/* Location */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(115,13,38,0.07)' }}>
                <MapPin size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div className="flex-1">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.location')}</div>
                  <input
                    type="text" placeholder={t('hero.locationPlaceholder')} value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full text-sm font-semibold bg-transparent outline-none" style={{ color: '#730D26' }}
                  />
                </div>
              </div>

              {/* Type + Bedrooms row */}
              <div className="flex">
                <div className="flex items-center gap-2.5 flex-1 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(115,13,38,0.07)', borderRight: '1px solid rgba(115,13,38,0.07)' }}>
                  <SlidersHorizontal size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.type')}</div>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none" style={{ color: '#730D26' }}>
                      <option value="">{t('filters.allTypes')}</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-1 px-4 py-3.5" style={{ borderBottom: '1px solid rgba(115,13,38,0.07)' }}>
                  <BedDouble size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.bedrooms')}</div>
                    <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none" style={{ color: '#730D26' }}>
                      {bedroomOptions.map((b) => (
                        <option key={b} value={b}>{b === 'Any' ? t('filters.anyBedrooms') : b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price */}
              <PriceZone
                minPrice={minPrice} maxPrice={maxPrice}
                onChange={handlePriceChange} label={t('hero.priceRange')}
                isMobile
              />

              {/* Search button */}
              <div className="flex justify-end p-2 pr-3">
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-1.5 text-white font-bold text-sm px-6 py-3 transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)', borderRadius: '999px', boxShadow: '0 4px 20px rgba(186,25,50,0.40)', whiteSpace: 'nowrap' }}
                >
                  <Search size={15} /> {t('hero.searchBtn')}
                </button>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-9 animate-fade-up" style={{ animationDelay: '220ms' }}>
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(186,25,50,0.18)', border: '1px solid rgba(186,25,50,0.22)' }}>
                  <Icon size={13} style={{ color: '#f5748a' }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base leading-none mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{value}</div>
                  <div className="text-white/40 text-[10px] sm:text-xs font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: '1px solid rgba(255,255,255,0.22)' }}>
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.50)' }} />
        </div>
      </div>
    </section>
  )
}
