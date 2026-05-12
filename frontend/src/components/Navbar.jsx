import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Globe, ChevronDown, Menu, X, Building2 } from 'lucide-react'

const navLinks = [
  { label: 'Buy', to: '/properties?type=sale' },
  { label: 'Rent', to: '/properties?type=rent' },
  { label: 'New Projects', to: '/projects' },
  { label: 'Neighborhoods', to: '/neighborhoods' },
  { label: 'Agents', to: '/agents' },
  { label: 'About', to: '/about' },
]

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = transparent && !scrolled && !menuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTransparent ? 'bg-gold' : 'bg-navy'}`}>
            <Building2 size={16} className="text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-navy'}`}>
            Agenz
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-navy/60 hover:text-navy'}`}>
            <Globe size={15} />
            EN
            <ChevronDown size={13} />
          </button>
          <button className={`p-2 rounded-xl transition-colors ${isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-navy/60 hover:text-navy hover:bg-navy/5'}`}>
            <Heart size={18} />
          </button>
          <Link
            to="/list-property"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isTransparent
                ? 'bg-gold text-navy hover:bg-gold-dark'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            List Property
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className={`lg:hidden p-2 rounded-xl transition-colors ${isTransparent ? 'text-white' : 'text-navy'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 font-medium transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100">
            <Link
              to="/list-property"
              className="block w-full text-center px-4 py-3 bg-navy text-white rounded-xl font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              List Property
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
