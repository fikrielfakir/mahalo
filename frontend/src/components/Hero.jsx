import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal, BedDouble, DollarSign, Home, Users, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi, agentsApi } from '../api/client'

const tabs = ['Buy', 'Rent', 'New Projects']
const bedroomOptions = ['Any', '1', '2', '3', '4', '5+']
const priceRanges = [
  { label: 'Any', min: '', max: '' },
  { label: '< 500K', min: '', max: '500000' },
  { label: '500K – 1M', min: '500000', max: '1000000' },
  { label: '1M – 3M', min: '1000000', max: '3000000' },
  { label: '3M – 5M', min: '3000000', max: '5000000' },
  { label: '5M+', min: '5000000', max: '' },
]

export default function Hero() {
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
    if (activeTab === 'Rent') params.set('type', 'rent')
    else if (activeTab === 'Buy') params.set('type', 'sale')
    if (location) params.set('search', location)
    if (propertyType) params.set('category_id', propertyType)
    if (bedrooms !== 'Any') params.set('number_bedroom', bedrooms)
    const selected = priceRanges.find(r => r.label === priceRange)
    if (selected?.min) params.set('min_price', selected.min)
    if (selected?.max) params.set('max_price', selected.max)
    const path = activeTab === 'New Projects' ? '/projects' : '/properties'
    navigate(`${path}?${params.toString()}`)
  }

  const stats = [
    { icon: Home,        value: fmtCount(propertiesCount, '1K+'), label: 'Properties' },
    { icon: Users,       value: '8K+',                             label: 'Happy Clients' },
    { icon: ShieldCheck, value: fmtCount(agentsCount, '50+'),      label: 'Verified Agents' },
    { icon: MapPin,      value: citiesCount ? `${citiesCount}+` : '10+', label: 'Cities' },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=90&auto=format&fit=crop"
          alt="Luxury Villa"
          className="w-full h-full object-cover object-center"
        />

        {/* Primary overlay: very dark left → reveals image right */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(8,1,3,0.97) 0%, rgba(30,4,12,0.93) 25%, rgba(115,13,38,0.72) 50%, rgba(115,13,38,0.28) 72%, rgba(0,0,0,0.05) 100%)'
        }} />

        {/* Top + bottom vignette */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.55) 100%)'
        }} />
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-7 animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '999px',
              padding: '6px 16px',
            }}>
            <span style={{ color: '#BA1932', fontSize: '12px' }}>◆</span>
            <span className="text-white/85 text-xs font-semibold uppercase tracking-widest">Premium Real Estate Platform</span>
          </div>

          {/* Heading */}
          <h1
            className="font-bold text-white leading-[1.05] tracking-tight mb-5 animate-fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            }}
          >
            Find Your Dream<br />
            Home in{' '}
            <span style={{
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 55%, #BA1932 100%)',
            }}>
              Morocco
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-white/55 text-base font-light max-w-sm mb-9 animate-fade-up" style={{ animationDelay: '80ms' }}>
            Discover premium properties across Morocco's most prestigious neighborhoods.
          </p>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={activeTab === tab
                  ? {
                      background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(186,25,50,0.40)',
                    }
                  : {
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.65)',
                    }
                }
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div
            className="flex flex-col lg:flex-row items-stretch lg:items-center gap-0 animate-fade-up"
            style={{
              animationDelay: '160ms',
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: '20px',
              boxShadow: '0 24px 64px rgba(115,13,38,0.28), 0 4px 16px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* Location */}
            <div className="flex items-center gap-3 flex-1 min-w-0 px-5 py-4 cursor-text"
              style={{ borderRight: '1px solid rgba(115,13,38,0.08)' }}>
              <MapPin size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>Location</div>
                <input
                  type="text"
                  placeholder="City or neighborhood..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm font-semibold bg-transparent outline-none"
                  style={{ color: '#730D26' }}
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer min-w-[130px]"
              style={{ borderRight: '1px solid rgba(115,13,38,0.08)' }}>
              <SlidersHorizontal size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>Type</div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                  style={{ color: '#730D26' }}
                >
                  <option value="">All Types</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer min-w-[120px]"
              style={{ borderRight: '1px solid rgba(115,13,38,0.08)' }}>
              <BedDouble size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>Bedrooms</div>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                  style={{ color: '#730D26' }}
                >
                  {bedroomOptions.map((b) => (
                    <option key={b} value={b}>{b === 'Any' ? 'Any' : `${b} bd`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer min-w-[130px]">
              <DollarSign size={16} style={{ color: '#BA1932', flexShrink: 0 }} />
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>Price Range</div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent outline-none cursor-pointer appearance-none"
                  style={{ color: '#730D26' }}
                >
                  {priceRanges.map((r) => (
                    <option key={r.label} value={r.label}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 text-white font-bold text-sm px-8 py-4 transition-all duration-300 active:scale-95 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                minWidth: '130px',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.10)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <Search size={17} />
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-9 animate-fade-up" style={{ animationDelay: '220ms' }}>
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(186,25,50,0.20)', border: '1px solid rgba(186,25,50,0.25)' }}>
                  <Icon size={15} style={{ color: '#f5748a' }} />
                </div>
                <div>
                  <div className="text-white font-bold text-base leading-none mb-0.5"
                    style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    {value}
                  </div>
                  <div className="text-white/45 text-xs font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.55)' }} />
        </div>
      </div>
    </section>
  )
}
