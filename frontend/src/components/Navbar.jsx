import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Globe, ChevronDown, Menu, X, Building2 } from 'lucide-react'

const navLinks = [
  { label: 'Buy',           to: '/properties?type=sale' },
  { label: 'Rent',          to: '/properties?type=rent' },
  { label: 'New Projects',  to: '/projects' },
  { label: 'Neighborhoods', to: '/neighborhoods' },
  { label: 'Agents',        to: '/agents' },
  { label: 'About',         to: '/about' },
]

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location                  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const isTransparent = transparent && !scrolled && !menuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(11,31,58,0.08)] border-b border-white/60'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isTransparent ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-navy'
            }`}
          >
            <Building2 size={16} className={isTransparent ? 'text-white' : 'text-white'} />
          </div>
          <span className={`text-[1.15rem] font-bold tracking-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-navy'}`}>
            Agenz
          </span>
        </Link>

        {/* Desktop centre links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`nav-pill transition-all duration-200 ${
                isTransparent
                  ? 'text-white/85 hover:text-white hover:bg-white/12'
                  : 'text-navy/65 hover:text-navy hover:bg-navy/6'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-full ${
              isTransparent ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-navy/60 hover:text-navy hover:bg-navy/5'
            }`}
          >
            <Globe size={14} />
            EN
            <ChevronDown size={12} />
          </button>

          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isTransparent ? 'text-white/80 hover:text-white hover:bg-white/12' : 'text-navy/60 hover:text-navy hover:bg-navy/6'
            }`}
          >
            <Heart size={17} />
          </button>

          <Link
            to="/list-property"
            className={`ml-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
              isTransparent
                ? 'bg-white text-navy hover:bg-white/90'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
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
          <div className="pt-3 mt-1 border-t border-gray-100">
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
