import { Link } from 'react-router-dom'
import { Building2, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Mail } from 'lucide-react'

const footerLinks = {
  Company:   ['About Us', 'Careers', 'Press', 'Contact'],
  Discover:  ['Buy', 'Rent', 'New Projects', 'Neighborhoods'],
  Resources: ['Blog', 'Guides', 'Market Insights', 'Help Center'],
  Legal:     ['Terms of Use', 'Privacy Policy', 'Cookie Policy'],
}

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #0B1F3A 0%, #071628 100%)' }}>
      <div className="max-w-7xl mx-auto px-5 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C8A97E, #d4b896)' }}>
                <Building2 size={17} className="text-navy" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Agenz</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Premium real estate experiences in Morocco. Discover your dream home with our curated selection of exceptional properties.
            </p>
            <div className="flex gap-2.5">
              {[
                { Icon: Facebook,  href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter,   href: '#', label: 'Twitter' },
                { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={`${section}-${link}`}>
                    <Link
                      to="#"
                      className="text-white/35 text-sm hover:text-white/70 transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-3xl p-8 mb-10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.2)' }}>
                <Mail size={16} className="text-gold" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-0.5">Stay Updated</h4>
                <p className="text-white/40 text-sm">Get the latest listings and market insights</p>
              </div>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 text-sm text-white placeholder-white/25 outline-none px-4 py-2.5 rounded-xl transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(200,169,126,0.4)'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 bg-gold hover:bg-gold-dark shrink-0"
              >
                <ArrowRight size={15} className="text-navy" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/25 text-sm">© 2025 Agenz. All rights reserved.</p>
          <p className="text-white/25 text-sm">Morocco (MAD) · Premium Real Estate</p>
        </div>
      </div>
    </footer>
  )
}
