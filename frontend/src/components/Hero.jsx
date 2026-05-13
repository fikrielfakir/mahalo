import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal, BedDouble, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi, agentsApi } from '../api/client'

const tabs = ['Buy', 'Rent', 'New Projects']
const bedroomOptions = ['Any', '1', '2', '3', '4', '5+']

export default function Hero() {
  const [activeTab, setActiveTab]       = useState('Buy')
  const [location, setLocation]         = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice]         = useState('')
  const [maxPrice, setMaxPrice]         = useState('')
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
    if (location)            params.set('search', location)
    if (propertyType)        params.set('category_id', propertyType)
    if (minPrice)            params.set('min_price', minPrice)
    if (maxPrice)            params.set('max_price', maxPrice)
    if (bedrooms !== 'Any')  params.set('number_bedroom', bedrooms)
    const path = activeTab === 'New Projects' ? '/projects' : '/properties'
    navigate(`${path}?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85&auto=format&fit=crop"
          alt="Hero background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/45 to-navy/80" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(186,25,50,0.12) 0%, transparent 65%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 pt-28 pb-20 flex flex-col items-center text-center">

        {/* Label */}
        <div className="glass-pill mb-5 animate-fade-in">
          ✦ Premium Real Estate Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-5 animate-fade-up">
          Find Your Dream
          <br />
          Home in{' '}
          <span
            className="relative inline-block"
            style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 50%, #BA1932 100%)' }}
          >
            Morocco
          </span>
        </h1>

        <p className="text-white/65 text-lg font-light max-w-md mb-10 animate-fade-up delay-100">
          Discover premium properties across Morocco's most prestigious neighborhoods.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-3xl animate-fade-up delay-200">

          {/* Tabs */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                    activeTab === tab
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main search box */}
          <div
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-2 rounded-3xl shadow-glass-lg"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.75)' }}
          >
            {/* Location */}
            <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 rounded-2xl bg-transparent hover:bg-navy/4 transition-colors duration-200 cursor-text">
              <MapPin size={17} className="text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-navy/40 text-[10px] font-semibold uppercase tracking-wider block mb-0.5">Location</label>
                <input
                  type="text"
                  placeholder="City or neighborhood..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm font-semibold text-navy bg-transparent outline-none placeholder-navy/30"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-navy/8 self-center shrink-0" />

            {/* Property type */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-navy/4 transition-colors duration-200 cursor-pointer min-w-[140px]">
              <SlidersHorizontal size={17} className="text-gold shrink-0" />
              <div className="flex-1">
                <label className="text-navy/40 text-[10px] font-semibold uppercase tracking-wider block mb-0.5">Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-sm font-semibold text-navy bg-transparent outline-none cursor-pointer appearance-none"
                >
                  <option value="">All Types</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-navy/8 self-center shrink-0" />

            {/* Bedrooms */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-navy/4 transition-colors duration-200 cursor-pointer min-w-[120px]">
              <BedDouble size={17} className="text-gold shrink-0" />
              <div className="flex-1">
                <label className="text-navy/40 text-[10px] font-semibold uppercase tracking-wider block mb-0.5">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full text-sm font-semibold text-navy bg-transparent outline-none cursor-pointer appearance-none"
                >
                  {bedroomOptions.map((b) => (
                    <option key={b} value={b}>{b === 'Any' ? 'Any' : `${b} bd`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-250 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 shrink-0 m-0.5"
            >
              <Search size={17} />
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up delay-300">
          {[
            { value: fmtCount(propertiesCount, '1K+'),  label: 'Properties' },
            { value: '8K+',                              label: 'Happy Clients' },
            { value: fmtCount(agentsCount, '50+'),       label: 'Verified Agents' },
            { value: citiesCount ? `${citiesCount}+` : '10+', label: 'Cities' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl px-5 py-3 text-left min-w-[90px]">
              <div className="text-white font-bold text-xl leading-none mb-1">{stat.value}</div>
              <div className="text-white/55 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-fade-in delay-500 z-10">
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
