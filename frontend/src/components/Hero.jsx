import { useState } from 'react'
import { Search, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const tabs = ['Buy', 'Rent', 'New Projects']

const propertyTypes = ['All Types', 'Apartment', 'Villa', 'House', 'Office', 'Land']
const bedroomOptions = ['Any', '1', '2', '3', '4', '5+']

export default function Hero() {
  const [activeTab, setActiveTab] = useState('Buy')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('All Types')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('Any')
  const navigate = useNavigate()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (activeTab === 'Rent') params.set('type', 'rent')
    else if (activeTab === 'Buy') params.set('type', 'sale')
    if (location) params.set('search', location)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    if (bedrooms !== 'Any') params.set('number_bedroom', bedrooms)
    const path = activeTab === 'New Projects' ? '/projects' : '/properties'
    navigate(`${path}?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85&auto=format&fit=crop)`,
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-start">
        {/* Headline */}
        <div className="mb-10 animate-fade-up">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-4 opacity-90">
            Premium Real Estate Platform
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
            Find Exceptional
            <br />
            Homes in{' '}
            <span className="text-gold">Morocco</span>
          </h1>
          <p className="text-white/70 text-lg font-light max-w-lg">
            Discover premium properties in the best locations across Morocco's most prestigious neighborhoods.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-4xl glass-white rounded-3xl shadow-glass p-2 animate-fade-up delay-200">
          {/* Tabs */}
          <div className="flex gap-1 px-2 pt-2 mb-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-navy/60 hover:text-navy hover:bg-navy/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 px-2 pb-2">
            {/* Location */}
            <div className="md:col-span-2 flex items-center gap-3 bg-surface rounded-2xl px-4 py-3">
              <MapPin size={18} className="text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-navy/40 text-xs font-medium block mb-0.5">Location</label>
                <input
                  type="text"
                  placeholder="City, neighborhood, or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="flex items-center gap-3 bg-surface rounded-2xl px-4 py-3">
              <SlidersHorizontal size={18} className="text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-navy/40 text-xs font-medium block mb-0.5">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-sm font-medium text-navy bg-transparent outline-none cursor-pointer"
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2 bg-surface rounded-2xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <label className="text-navy/40 text-xs font-medium block mb-0.5">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="MAD 0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30"
                  />
                  <span className="text-navy/30 text-xs">–</span>
                  <input
                    type="number"
                    placeholder="No Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms + Search */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-surface rounded-2xl px-4 py-3">
                <div className="min-w-0">
                  <label className="text-navy/40 text-xs font-medium block mb-0.5">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full text-sm font-medium text-navy bg-transparent outline-none cursor-pointer"
                  >
                    {bedroomOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-12 h-full bg-gold hover:bg-gold-dark rounded-2xl flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Search size={20} className="text-navy" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-10 animate-fade-up delay-300">
          {[
            { value: '15K+', label: 'Properties' },
            { value: '8K+', label: 'Happy Clients' },
            { value: '200+', label: 'Verified Agents' },
            { value: '20+', label: 'Cities' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl px-5 py-3 flex flex-col">
              <span className="text-white font-bold text-xl">{stat.value}</span>
              <span className="text-white/60 text-xs font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
