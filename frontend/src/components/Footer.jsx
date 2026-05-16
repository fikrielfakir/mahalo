import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, Mail } from 'lucide-react'
import logoLight from '/logo-light.png'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const settings = useSiteSettings()

  const footerLinks = {
    [t('footer.company')]:   [
      { label: t('footer.aboutUs'),        to: '/about' },
      { label: t('footer.agents'),         to: '/agents' },
      { label: t('footer.contact'),        to: '/contact' },
    ],
    [t('footer.discover')]:  [
      { label: t('footer.buy'),            to: '/properties?type=sale' },
      { label: t('footer.rent'),           to: '/properties?type=rent' },
      { label: t('footer.newProjects'),    to: '/projects' },
      { label: t('footer.neighborhoods'),  to: '/neighborhoods' },
    ],
    [t('footer.resources')]: [
      { label: t('footer.listProperty'),   to: '/list-property' },
      { label: t('footer.helpCenter'),     to: '#' },
      { label: t('footer.marketInsights'), to: '#' },
    ],
    [t('footer.legal')]:     [
      { label: t('footer.termsOfUse'),    to: '#' },
      { label: t('footer.privacy'),       to: '#' },
      { label: t('footer.cookiePolicy'),  to: '#' },
    ],
  }

  const socials = [
    { Icon: Facebook,  href: settings.facebook_url,  label: 'Facebook' },
    { Icon: Instagram, href: settings.instagram_url, label: 'Instagram' },
    { Icon: Twitter,   href: settings.twitter_url,   label: 'Twitter' },
    { Icon: Youtube,   href: settings.youtube_url,   label: 'YouTube' },
  ].filter(s => s.href)

  const footerDesc = settings.footer_description || t('footer.defaultDesc')
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'linear-gradient(180deg, #730D26 0%, #1a0208 60%, #0d0208 100%)' }}>
      <div className="max-w-7xl mx-auto px-5 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={settings.footer_logo_url || logoLight} alt="Mahalo" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              {footerDesc}
            </p>
            {socials.length > 0 ? (
              <div className="flex gap-2.5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
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
            ) : (
              <div className="flex gap-2.5">
                {[
                  { Icon: Facebook,  label: 'Facebook' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Twitter,   label: 'Twitter' },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white/20"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    title={`${label} — configure in admin settings`}
                  >
                    <Icon size={15} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={`${section}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="text-white/35 text-sm hover:text-white/70 transition-colors duration-200"
                    >
                      {link.label}
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
                <h4 className="text-white font-semibold mb-0.5">{t('footer.stayUpdated')}</h4>
                <p className="text-white/40 text-sm">{t('footer.newsletterDesc')}</p>
              </div>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
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
          <p className="text-white/25 text-sm">© {year} {settings.site_name || 'Agenz'}. {t('footer.rights')}.</p>
          <p className="text-white/25 text-sm">{t('footer.premiumRealEstate')}</p>
        </div>
      </div>
    </footer>
  )
}
