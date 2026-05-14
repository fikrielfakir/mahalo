import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Globe, ChevronDown, Menu, X, UserCircle, LogOut } from 'lucide-react'
import logo from '/logo.png'
import logoLight from '/logo-light.png'
import { useUserAuth } from '../context/UserAuthContext'

const navLinks = [
  { label: 'Buy',           to: '/properties?type=sale' },
  { label: 'Rent',          to: '/properties?type=rent' },
  { label: 'New Projects',  to: '/projects' },
  { label: 'Neighborhoods', to: '/neighborhoods' },
  { label: 'Agents',        to: '/agents' },
  { label: 'About',         to: '/about' },
]

export default function Navbar({ transparent = false }) {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const dropdownRef                     = useRef(null)
  const location                        = useLocation()
  const navigate                        = useNavigate()
  const { user, isAuthenticated, isEmailVerified, logout } = useUserAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserDropdown(false) }, [location])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false)
      }
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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

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
                key={link.label}
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
          {/* Language */}
          <button className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-full ${
            isTransparent ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-navy/60 hover:text-navy hover:bg-navy/5'
          }`}>
            <Globe size={14} /> EN <ChevronDown size={12} />
          </button>

          {/* Favorites */}
          <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isTransparent ? 'text-white/80 hover:text-white hover:bg-white/12' : 'text-navy/60 hover:text-navy hover:bg-navy/6'
          }`}>
            <Heart size={17} />
          </button>

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
                <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
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
                    <UserCircle size={14} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-1"
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <LogOut size={14} /> Sign Out
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
                Sign In
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
            List Property
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
              key={link.label}
              to={link.to}
              className="flex items-center px-4 py-3 rounded-2xl text-navy/70 hover:text-navy hover:bg-navy/5 font-medium text-sm transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-1 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{user?.name}</p>
                    <p className="text-xs text-navy/40 truncate">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 w-full px-4 py-3 text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl font-medium text-sm transition-all"
                >
                  <UserCircle size={15} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-medium text-sm transition-all"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"
                  className="flex-1 text-center px-4 py-3 bg-gold text-white rounded-2xl font-semibold text-sm hover:bg-gold-dark">
                  Sign In
                </Link>
              </div>
            )}
            <Link
              to="/list-property"
              className="flex items-center justify-center px-4 py-3 bg-navy text-white rounded-2xl font-semibold text-sm w-full"
            >
              List Property
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
