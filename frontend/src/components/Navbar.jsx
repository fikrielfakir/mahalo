import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Globe, ChevronDown, Menu, X, UserCircle, LogOut, MessageCircle, LayoutDashboard, Check } from 'lucide-react'
import logo from '/logo.png'
import logoLight from '/logo-light.png'
import { useUserAuth } from '../context/UserAuthContext'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LOCALES } from '../i18n.js'

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

  const activeLng   = i18n.resolvedLanguage?.split('-')[0] || 'en'
  const currentLang = LANG_LABELS[activeLng] || LANG_LABELS.en

  const navLinks = [
    { label: t('nav.buy'),           to: '/properties?type=sale' },
    { label: t('nav.rent'),          to: '/properties?type=rent' },
    { label: t('nav.newProjects'),   to: '/projects' },
    { label: t('nav.neighborhoods'), to: '/neighborhoods' },
    { label: t('nav.agents'),        to: '/agents' },
    { label: t('nav.about'),         to: '/about' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
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

  const isTransparent = transparent && !scrolled && !menuOpen
  const showBanner    = isAuthenticated && !isEmailVerified

  const handleLogout = async () => {
    await logout()
    setUserDropdown(false)
    navigate('/')
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLangDropdown(false)
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        showBanner ? 'top-[42px]' : 'top-0'
      } ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(115,13,38,0.08)] border-b border-white/60'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={isTransparent ? logoLight : logo}
            alt="Mahalo"
            className="h-9 w-auto object-contain transition-all duration-300"
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
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-full ${
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-xl mx-auto ${
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

          {/* Auth section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 ${
                  isTransparent
                    ? 'hover:bg-white/12 text-white'
                    : 'hover:bg-navy/6 text-navy'
                }`}
              >
                <img
                  src={user?.avatar_url || '/avatars/man1.png'}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium max-w-[90px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={12} className={`transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-float border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-semibold text-navy truncate">{user?.name}</p>
                    <p className="text-xs text-navy/40 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors rounded-xl mx-1"
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <UserCircle size={14} /> {t('nav.myProfile')}
                  </Link>
                  <Link
                    to="/messages"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors rounded-xl mx-1"
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <MessageCircle size={14} /> {t('nav.myMessages')}
                  </Link>
                  {!!(user?.professional_agent_id || user?.role === 'agent') && (
                    <Link
                      to="/agent-dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#730D26] hover:bg-[#730D26]/8 transition-colors rounded-xl mx-1 font-semibold"
                      style={{ width: 'calc(100% - 8px)' }}
                    >
                      <LayoutDashboard size={14} /> {t('nav.agentDashboard')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-1"
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <LogOut size={14} /> {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-white"
                style={{
                  border: '1.5px solid transparent',
                  backgroundClip: 'padding-box',
                  boxShadow: '0 0 0 1.5px #730D26',
                  color: '#730D26',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 1.5px #BA1932'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 1.5px #730D26'}
              >
                {t('nav.signIn')}
              </Link>
            </div>
          )}

          <Link
            to="/list-property"
            className="ml-1 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
              boxShadow: '0 2px 12px rgba(186,25,50,0.30)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(186,25,50,0.50)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(186,25,50,0.30)'}
          >
            {t('nav.listProperty')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isTransparent ? 'text-white hover:bg-white/12' : 'text-navy hover:bg-navy/6'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100/80 px-5 py-4 space-y-0.5 shadow-float">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center px-4 py-3 rounded-2xl text-navy/70 hover:text-navy hover:bg-navy/5 font-medium text-sm transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="pt-2 pb-1 border-t border-gray-100 mt-1">
            <p className="px-4 text-xs font-semibold text-navy/40 uppercase tracking-wider mb-1">Language</p>
            <div className="grid grid-cols-2 gap-1">
              {SUPPORTED_LOCALES.map((lng) => {
                const meta = LANG_LABELS[lng]
                const active = activeLng === lng
                return (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#730D26]/10 text-[#730D26] font-semibold'
                        : 'text-navy/60 hover:bg-navy/5 hover:text-navy'
                    }`}
                  >
                    <span>{meta.flag}</span>
                    <span>{meta.label}</span>
                    {active && <Check size={12} className="text-[#730D26] ml-auto" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-3 mt-1 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <img
                    src={user?.avatar_url || '/avatars/man1.png'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{user?.name}</p>
                    <p className="text-xs text-navy/40 truncate">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 w-full px-4 py-3 text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl font-medium text-sm transition-all"
                >
                  <UserCircle size={15} /> {t('nav.myProfile')}
                </Link>
                <Link
                  to="/messages"
                  className="flex items-center gap-2 w-full px-4 py-3 text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl font-medium text-sm transition-all"
                >
                  <MessageCircle size={15} /> {t('nav.myMessages')}
                </Link>
                {!!(user?.professional_agent_id || user?.role === 'agent') && (
                  <Link
                    to="/agent-dashboard"
                    className="flex items-center gap-2 w-full px-4 py-3 text-[#730D26] hover:bg-[#730D26]/8 rounded-2xl font-semibold text-sm transition-all"
                  >
                    <LayoutDashboard size={15} /> {t('nav.agentDashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-medium text-sm transition-all"
                >
                  <LogOut size={15} /> {t('nav.signOut')}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"
                  className="flex-1 text-center px-4 py-3 bg-gold text-white rounded-2xl font-semibold text-sm hover:bg-gold-dark">
                  {t('nav.signIn')}
                </Link>
              </div>
            )}
            <Link
              to="/list-property"
              className="flex items-center justify-center px-4 py-3 bg-navy text-white rounded-2xl font-semibold text-sm w-full"
            >
              {t('nav.listProperty')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
