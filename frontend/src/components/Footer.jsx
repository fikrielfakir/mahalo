import { Link } from 'react-router-dom'
import { Building2, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react'

const footerLinks = {
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  Discover: ['Buy', 'Rent', 'New Projects', 'Neighborhoods'],
  Resources: ['Blog', 'Guides', 'Market Insights', 'Help Center'],
  Legal: ['Terms of Use', 'Privacy Policy', 'Cookie Policy'],
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gold flex items-center justify-center">
                <Building2 size={16} className="text-navy" />
              </div>
              <span className="text-xl font-bold tracking-tight">Agenz</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Premium real estate experiences in Morocco. Discover your dream home with our curated selection.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'Linkedin' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={`${section}-${link}`}>
                    <Link
                      to="#"
                      className="text-white/40 text-sm hover:text-white/80 transition-colors duration-200"
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
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay Updated</h4>
              <p className="text-white/40 text-sm">Subscribe to our newsletter</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold/50 focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center hover:bg-gold-dark transition-colors duration-200 shrink-0"
              >
                <ArrowRight size={16} className="text-navy" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2024 Agenz. All rights reserved.
          </p>
          <p className="text-white/30 text-sm">Morocco (MAD) · All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
