import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi } from '../api/client'
import { useTranslation } from 'react-i18next'
import { useSiteSettings } from '../context/SiteSettingsContext'

const CAT_SLUG = {
  'Apartment': 'apartment', 'Villa': 'villa', 'Condo': 'condo',
  'House': 'house', 'Land': 'land', 'Commercial Property': 'commercial',
  'Riad': 'riad', 'Office': 'office',
}

/* ═══════════════════════════════ Hero ═══════════════════════════════════ */
export default function Hero() {
  const { t } = useTranslation()
  const siteSettings = useSiteSettings()

  /* Store tab as a stable key — NEVER the translated label.
     This means language switches never lose the active state. */
  const TAB_KEYS = [
    ...(siteSettings.sale_enabled     !== '0' ? ['buy']      : []),
    ...(siteSettings.rent_enabled     !== '0' ? ['rent']     : []),
    ...(siteSettings.projects_enabled !== '0' ? ['projects'] : []),
  ]
  const tabLabels = { buy: t('hero.tabBuy'), rent: t('hero.tabRent'), projects: t('hero.tabProjects') }

  const [activeTabKey, setActiveTabKey] = useState('buy')
  const [location, setLocation]         = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [categories, setCategories]     = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    propertiesApi.filters()
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data?.categories)) setCategories(data.categories)
      })
      .catch(() => {})
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (activeTabKey === 'rent')     params.set('type', 'rent')
    else if (activeTabKey === 'buy') params.set('type', 'sale')
    if (location)     params.set('search', location)
    if (propertyType) params.set('category_id', propertyType)
    navigate(`${activeTabKey === 'projects' ? '/projects' : '/properties'}?${params.toString()}`)
  }

  const divider = { borderRight: '1px solid rgba(115,13,38,0.08)' }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        {siteSettings.hero_bg_url && siteSettings.hero_bg_type === 'video' ? (
          <video
            src={siteSettings.hero_bg_url}
            className="w-full h-full object-cover object-center"
            autoPlay muted loop playsInline
          />
        ) : (
          <img
            src={siteSettings.hero_bg_url || '/hero-bg.jpg'}
            alt="Luxury Villa"
            className="w-full h-full object-cover object-center"
          />
        )}
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
                    {categories.map((c) => <option key={c.id} value={c.id}>{t('filters.' + CAT_SLUG[c.name], c.name)}</option>)}
                  </select>
                </div>
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

              {/* Type row */}
              <div className="flex items-center gap-2.5 flex-1 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(115,13,38,0.07)' }}>
                <SlidersHorizontal size={14} style={{ color: '#BA1932', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(115,13,38,0.38)' }}>{t('hero.type')}</div>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full text-xs font-semibold bg-transparent outline-none cursor-pointer appearance-none" style={{ color: '#730D26' }}>
                    <option value="">{t('filters.allTypes')}</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{t('filters.' + CAT_SLUG[c.name], c.name)}</option>)}
                  </select>
                </div>
              </div>

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
