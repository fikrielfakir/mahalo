import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Globe, ChevronDown, Menu, X, UserCircle, LogOut, MessageCircle, LayoutDashboard, Check, Sparkles } from 'lucide-react'
import logo from '/logo.png'
import logoLight from '/logo-light.png'
import { useUserAuth } from '../context/UserAuthContext'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LOCALES, USER_LANG_KEY } from '../i18n.js'
import { useSiteSettings } from '../context/SiteSettingsContext'

const LANG_LABELS = {
  en: { label: 'English',  short: 'EN', flag: '🇬🇧' },
  fr: { label: 'Français', short: 'FR', flag: '🇫🇷' },
  es: { label: 'Español',  short: 'ES', flag: '🇪🇸' },
  ar: { label: 'العربية',  short: 'AR', flag: '🇲🇦' },
}

export default function Navbar({ transparent = false }) {
  const { t, i18n } = useTranslation()
  const [scrolled,      setScrolled]      = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [userDropdown,  setUserDropdown]  = useState(false)
  const [langDropdown,  setLangDropdown]  = useState(false)
  const dropdownRef                       = useRef(null)
  const langRef                           = useRef(null)
  const location                          = useLocation()
  const navigate                          = useNavigate()
  const { user, isAuthenticated, isEmailVerified, logout } = useUserAuth()

  const siteSettings = useSiteSettings()
  const activeLng   = i18n.resolvedLanguage?.split('-')[0] || 'en'
  const currentLang = LANG_LABELS[activeLng] || LANG_LABELS.en

  const navLinks = [
    ...(siteSettings.sale_enabled !== '0' ? [{ label: t('nav.buy'),         to: '/properties?type=sale' }] : []),
    ...(siteSettings.rent_enabled !== '0' ? [{ label: t('nav.rent'),        to: '/properties?type=rent' }] : []),
    ...(siteSettings.projects_enabled !== '0' ? [{ label: t('nav.newProjects'), to: '/projects' }] : []),
    { label: t('nav.neighborhoods'), to: '/neighborhoods' },
    { label: t('nav.agents'),        to: '/agents' },
    { label: t('nav.about'),         to: '/about' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserDropdown(false); setLangDropdown(false) }, [location])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdown(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isTransparent = transparent && !scrolled && !menuOpen
  const showBanner    = isAuthenticated && !isEmailVerified

  const handleLogout = async () => {
    await logout()
    setUserDropdown(false)
    navigate('/')
  }

  const changeLanguage = async (lng) => {
    localStorage.setItem(USER_LANG_KEY, lng)
    await i18n.changeLanguage(lng)
    setLangDropdown(false)
    setMenuOpen(false)
    window.location.reload()
  }

  return (
    <>
      {/* ─── Navbar bar ─────────────────────────────────────────── */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          showBanner ? 'top-[42px]' : 'top-0'
        } ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white shadow-[0_1px_20px_rgba(115,13,38,0.08)] border-b border-gray-100'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 xs:px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={isTransparent ? logoLight : logo}
              alt="Mahalo"
              className="h-8 xs:h-9 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || location.pathname + location.search === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-pill relative transition-all duration-200 ${
                    isTransparent
                      ? 'text-white/85 hover:text-white hover:bg-white/12'
                      : isActive
                        ? 'text-navy font-semibold'
                        : 'text-navy/65 hover:text-navy hover:bg-navy/6'
                  }`}
                >
                  {link.label}
                  {!isTransparent && isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                  )}
                </Link>
              )
            })}
            <Link
              to="/find-my-property"
              className={`nav-pill relative flex items-center gap-1.5 transition-all duration-200 ${
                isTransparent
                  ? 'text-gold/90 hover:text-gold hover:bg-white/12'
                  : location.pathname === '/find-my-property'
                    ? 'text-[#730D26] font-semibold'
                    : 'text-[#730D26]/70 hover:text-[#730D26] hover:bg-[#730D26]/6'
              }`}
            >
              <Sparkles size={12} />
              AI Match
            </Link>
          </div>

          {/* Right actions — desktop only */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-full touch-manip ${
                  isTransparent
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-navy/60 hover:text-navy hover:bg-navy/5'
                }`}
              >
                <Globe size={14} />
                <span>{currentLang.short}</span>
                <ChevronDown size={12} className={`transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
              </button>

              {langDropdown && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-float border border-gray-100 py-1.5 z-50">
                  {SUPPORTED_LOCALES.map((lng) => {
                    const meta = LANG_LABELS[lng]
                    const active = activeLng === lng
                    return (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-xl mx-auto touch-manip ${
                          active
                            ? 'text-[#730D26] font-semibold bg-[#730D26]/6'
                            : 'text-navy/70 hover:text-navy hover:bg-navy/5'
                        }`}
                        style={{ width: 'calc(100% - 8px)', marginLeft: '4px' }}
                      >
                        <span className="text-base">{meta.flag}</span>
                        <span className="flex-1 text-start">{meta.label}</span>
                        {active && <Check size={13} className="text-[#730D26] shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 touch-manip ${
                    isTransparent
                      ? 'hover:bg-white/12 text-white'
                      : 'hover:bg-navy/6 text-navy'
                  }`}
                >
                  <img src={user?.avatar_url || '/avatars/man1.png'} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm font-medium max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={12} className={`transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-float border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-semibold text-navy truncate">{user?.name}</p>
                      <p className="text-xs text-navy/40 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors rounded-xl mx-1" style={{ width: 'calc(100% - 8px)' }}>
                      <UserCircle size={14} /> {t('nav.myProfile')}
                    </Link>
                    <Link to="/messages" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors rounded-xl mx-1" style={{ width: 'calc(100% - 8px)' }}>
                      <MessageCircle size={14} /> {t('nav.myMessages')}
                    </Link>
                    {!!(user?.professional_agent_id || user?.role === 'agent') && (
                      <Link to="/agent-dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#730D26] hover:bg-[#730D26]/8 transition-colors rounded-xl mx-1 font-semibold" style={{ width: 'calc(100% - 8px)' }}>
                        <LayoutDashboard size={14} /> {t('nav.agentDashboard')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-1" style={{ width: 'calc(100% - 8px)' }}>
                      <LogOut size={14} /> {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-white touch-manip"
                  style={{ boxShadow: '0 0 0 1.5px #730D26', color: '#730D26' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 1.5px #BA1932'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 1.5px #730D26'}
                >
                  {t('nav.signIn')}
                </Link>
              </div>
            )}

            <Link
              to="/list-property"
              className="ml-1 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 touch-manip"
              style={{ background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)', boxShadow: '0 2px 12px rgba(186,25,50,0.30)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(186,25,50,0.50)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(186,25,50,0.30)'}
            >
              {t('nav.listProperty')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all touch-manip relative ${
              isTransparent ? 'text-white hover:bg-white/12' : 'text-navy hover:bg-navy/6'
            }`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`absolute transition-all duration-200 ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}><X size={20} /></span>
            <span className={`absolute transition-all duration-200 ${menuOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}><Menu size={20} /></span>
          </button>
        </nav>
      </header>

      {/* ─── Mobile side-drawer backdrop ────────────────────────── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ─── Mobile side-drawer panel ───────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 right-0 z-50 h-full w-[85vw] max-w-[340px] bg-white shadow-2xl transition-all duration-300 ease-out flex flex-col"
        style={{
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          visibility: menuOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <img src={logo} alt="Mahalo" className="h-8 w-auto object-contain" />
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors touch-manip"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Nav links */}
          <div className="px-3 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.to || location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3.5 rounded-2xl font-medium text-base transition-all duration-200 min-h-[48px] touch-manip ${
                    isActive
                      ? 'bg-navy/8 text-navy font-semibold'
                      : 'text-gray-700 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Language switcher */}
          <div className="px-5 pt-2 pb-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LOCALES.map((lng) => {
                const meta = LANG_LABELS[lng]
                const active = activeLng === lng
                return (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] touch-manip border ${
                      active
                        ? 'bg-[#730D26]/8 text-[#730D26] font-semibold border-[#730D26]/20'
                        : 'text-gray-600 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span>{meta.flag}</span>
                    <span>{meta.label}</span>
                    {active && <Check size={13} className="text-[#730D26] ml-auto" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Auth section */}
          <div className="px-5 pb-6 border-t border-gray-100 space-y-2 pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <img src={user?.avatar_url || '/avatars/man1.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-2xl font-medium text-sm transition-all min-h-[48px] touch-manip">
                  <UserCircle size={16} /> {t('nav.myProfile')}
                </Link>
                <Link to="/messages" className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-2xl font-medium text-sm transition-all min-h-[48px] touch-manip">
                  <MessageCircle size={16} /> {t('nav.myMessages')}
                </Link>
                {!!(user?.professional_agent_id || user?.role === 'agent') && (
                  <Link to="/agent-dashboard" className="flex items-center gap-3 w-full px-4 py-3.5 text-[#730D26] hover:bg-[#730D26]/8 rounded-2xl font-semibold text-sm transition-all min-h-[48px] touch-manip">
                    <LayoutDashboard size={16} /> {t('nav.agentDashboard')}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl font-medium text-sm transition-all min-h-[48px] touch-manip">
                  <LogOut size={16} /> {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center justify-center w-full px-4 py-3.5 rounded-2xl font-semibold text-sm text-white min-h-[48px] touch-manip"
                style={{ background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)' }}>
                {t('nav.signIn')}
              </Link>
            )}
            <Link to="/list-property" className="flex items-center justify-center px-4 py-3.5 rounded-2xl font-semibold text-sm w-full min-h-[48px] touch-manip text-navy border-2 border-navy hover:bg-navy hover:text-white transition-all">
              {t('nav.listProperty')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
