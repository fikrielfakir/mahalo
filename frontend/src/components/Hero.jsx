import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal, BedDouble, DollarSign, Home, Users, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi, agentsApi } from '../api/client'
import { useTranslation } from 'react-i18next'

const bedroomOptions = ['Any', '1', '2', '3', '4', '5+']
const priceRanges = [
  { label: 'Any',        min: '',        max: '' },
  { label: '< 500K',    min: '',        max: '500000' },
  { label: '500K – 1M', min: '500000',  max: '1000000' },
  { label: '1M – 3M',   min: '1000000', max: '3000000' },
  { label: '3M – 5M',   min: '3000000', max: '5000000' },
  { label: '5M+',       min: '5000000', max: '' },
]

export default function Hero() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab]       = useState('Buy')
  const [location, setLocation]         = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange]     = useState('Any')
  const [bedrooms, setBedrooms]         = useState('Any')
  const [categories, setCategories]     = useState([])

  const [propertiesCount, setPropertiesCount] = useState(null)
  const [agentsCount, setAgentsCount]         = useState(null)
  const [citiesCount, setCitiesCount]         = useState(null)

  const navigate = useNavigate()
  const tabs = [t('hero.tabBuy'), t('hero.tabRent'), t('hero.tabProjects')]

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
    if (activeTab === t('hero.tabRent')) params.set('type', 'rent')
    else if (activeTab === t('hero.tabBuy')) params.set('type', 'sale')
    if (location)            params.set('search', location)
    if (propertyType)        params.set('category_id', propertyType)
    if (bedrooms !== 'Any')  params.set('number_bedroom', bedrooms)
    const selected = priceRanges.find(r => r.label === priceRange)
    if (selected?.min) params.set('min_price', selected.min)
    if (selected?.max) params.set('max_price', selected.max)
    const path = activeTab === t('hero.tabProjects') ? '/projects' : '/properties'
    navigate(`${path}?${params.toString()}`)
  }

  const stats = [
    { icon: Home,        value: fmtCount(propertiesCount, '1K+'), label: t('stats.properties') },
    { icon: Users,       value: '8K+',                             label: t('stats.happyClients') },
    { icon: ShieldCheck, value: fmtCount(agentsCount, '50+'),      label: t('stats.verifiedAgents') },
    { icon: MapPin,      value: citiesCount ? `${citiesCount}+` : '10+', label: t('stats.cities') },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Luxury Villa"
          className="w-full h-full object-cover object-center"
        />

        {/* Dark split overlay: near-black left → transparent right */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(6,1,2,0.97) 0%, rgba(25,3,10,0.93) 22%, rgba(115,13,38,0.70) 48%, rgba(115,13,38,0.22) 70%, rgba(0,0,0,0.04) 100%)'
        }} />

        {/* Top + bottom vignette */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.60) 100%)'
        }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="max-w-2xl">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-6 sm:mb-7 animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '999px',
              padding: '5px 14px',
            }}
          >
            <span style={{ color: '#BA1932', fontSize: '11px' }}>◆</span>
            <span className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              {t('hero.badge')}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-bold text-white leading-[1.06] tracking-tight mb-4 sm:mb-5 animate-fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              fontSize: 'clamp(2.4rem, 6.5vw, 4.5rem)',
            }}
          >
            {t('hero.title1')}<br />
            {t('hero.title2').split(' ').slice(0, -1).join(' ')}{' '}
            <span style={{
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 55%, #BA1932 100%)',
            }}>
              Mahalo
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-white/50 text-sm sm:text-base font-light max-w-xs sm:max-w-sm mb-7 sm:mb-9 animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {t('hero.subtitle')}
          </p>

          {/* ── Tabs ── */}
          <div
            className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-5 animate-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300"
                style={{
                  borderRadius: '999px',
                  ...(activeTab === tab
                    ? {
                        background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(186,25,50,0.40)',
                      }
                    : {
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.60)',
                      })
                }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = 'rgba(255,255,255,0.60)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Search bar ── */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            {/* Desktop/tablet: single pill row */}
            <div
              className="hidden sm:flex items-center"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: '999px',
                boxShadow: '0 20px 60px rgba(115,13,38,0.28), 0 4px 16px rgba(0,0,0,0.12)',
                overflow: 'hidden',
              }}
            >
              {/* Location */}
              <div
                className="flex items-center gap-2.5 px-5 py-3.5 cursor-text"
                style={{ borderRight: '1px solid rgba(115,13,38,0.08)', flex: '2 1 160px', minWidth: 0 }}
              >
                <MapPin size={15} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.location')}</div>
                  <input
                    type="text"
                    placeholder={t('hero.locationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: 'transparent',
                      outline: 'none',
                      color: '#730D26',
                      border: 'none',
                      padding: 0,
                    }}
                  />
                </div>
              </div>

              {/* Type */}
              <div
                className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
                style={{ borderRight: '1px solid rgba(115,13,38,0.08)', flex: '1 1 110px', minWidth: 0 }}
              >
                <SlidersHorizontal size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.type')}</div>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: 'transparent',
                      outline: 'none',
                      border: 'none',
                      color: '#730D26',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: 0,
                    }}
                  >
                    <option value="">{t('filters.allTypes')}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bedrooms */}
              <div
                className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
                style={{ borderRight: '1px solid rgba(115,13,38,0.08)', flex: '1 1 100px', minWidth: 0 }}
              >
                <BedDouble size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.bedrooms')}</div>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: 'transparent',
                      outline: 'none',
                      border: 'none',
                      color: '#730D26',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: 0,
                    }}
                  >
                    {bedroomOptions.map((b) => (
                      <option key={b} value={b}>{b === 'Any' ? t('filters.anyBedrooms') : `${b} ${t('property.beds')}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div
                className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
                style={{ flex: '1 1 105px', minWidth: 0 }}
              >
                <DollarSign size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.priceRange')}</div>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: 'transparent',
                      outline: 'none',
                      border: 'none',
                      color: '#730D26',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: 0,
                    }}
                  >
                    {priceRanges.map((r) => (
                      <option key={r.label} value={r.label}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search button */}
              <div className="p-1.5 shrink-0">
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 text-white font-bold text-sm transition-all duration-300 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
                    borderRadius: '999px',
                    boxShadow: '0 4px 20px rgba(186,25,50,0.40)',
                    padding: '12px 24px',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(186,25,50,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(186,25,50,0.40)'}
                >
                  <Search size={16} />
                  {t('hero.searchBtn')}
                </button>
              </div>
            </div>

            {/* Mobile: stacked card */}
            <div
              className="flex sm:hidden flex-col gap-0"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(115,13,38,0.28), 0 4px 16px rgba(0,0,0,0.12)',
                overflow: 'hidden',
              }}
            >
              {/* Location */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(115,13,38,0.07)' }}
              >
                <MapPin size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div className="flex-1">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.location')}</div>
                  <input
                    type="text"
                    placeholder={t('hero.locationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full text-sm font-semibold bg-transparent outline-none"
                    style={{ color: '#730D26' }}
                  />
                </div>
              </div>

              {/* Type + Bedrooms row */}
              <div className="flex">
                <div
                  className="flex items-center gap-2.5 flex-1 px-5 py-3.5"
                  style={{ borderBottom: '1px solid rgba(115,13,38,0.07)', borderRight: '1px solid rgba(115,13,38,0.07)' }}
                >
                  <SlidersHorizontal size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.type')}</div>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                      style={{ color: '#730D26' }}
                    >
                      <option value="">{t('filters.allTypes')}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2.5 flex-1 px-4 py-3.5"
                  style={{ borderBottom: '1px solid rgba(115,13,38,0.07)' }}
                >
                  <BedDouble size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.bedrooms')}</div>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                      style={{ color: '#730D26' }}
                    >
                      {bedroomOptions.map((b) => (
                        <option key={b} value={b}>{b === 'Any' ? t('filters.anyBedrooms') : `${b}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Range + Search row */}
              <div className="flex items-center">
                <div className="flex items-center gap-2.5 flex-1 px-5 py-3.5">
                  <DollarSign size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.price')}</div>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                      style={{ color: '#730D26' }}
                    >
                      {priceRanges.map((r) => (
                        <option key={r.label} value={r.label}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-2 pr-3">
                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-1.5 text-white font-bold text-sm px-5 py-3 transition-all duration-300 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
                      borderRadius: '999px',
                      boxShadow: '0 4px 20px rgba(186,25,50,0.40)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Search size={15} /> {t('hero.searchBtn')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3 mt-7 sm:mt-9 animate-fade-up"
            style={{ animationDelay: '220ms' }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(186,25,50,0.18)', border: '1px solid rgba(186,25,50,0.22)' }}
                >
                  <Icon size={13} style={{ color: '#f5748a' }} />
                </div>
                <div>
                  <div
                    className="text-white font-bold text-sm sm:text-base leading-none mb-0.5"
                    style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-fade-in"
        style={{ animationDelay: '600ms' }}
      >
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1px solid rgba(255,255,255,0.22)' }}
        >
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.50)' }} />
        </div>
      </div>
    </section>
  )
}
