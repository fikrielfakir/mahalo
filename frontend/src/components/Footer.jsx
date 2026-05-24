import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, Mail, ChevronDown, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import logoLight from '/logo-light.png'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useTranslation } from 'react-i18next'
import { newsletterApi } from '../api/client'

export default function Footer() {
  const { t } = useTranslation()
  const settings = useSiteSettings()
  const [openSection, setOpenSection] = useState(null)
  const [email, setEmail] = useState('')
  const [nlStatus, setNlStatus] = useState(null) // null | 'loading' | 'success' | 'error' | 'duplicate'
  const [nlMessage, setNlMessage] = useState('')

  const footerLinks = {
    [t('footer.company')]:   [
      { label: t('footer.aboutUs'),        to: '/about' },
      { label: t('footer.agents'),         to: '/agents' },
      { label: t('footer.contact'),        to: '/contact' },
    ],
    [t('footer.discover')]:  [
      ...(settings.sale_enabled !== '0'     ? [{ label: t('footer.buy'),           to: '/properties?type=sale' }] : []),
      ...(settings.rent_enabled !== '0'     ? [{ label: t('footer.rent'),          to: '/properties?type=rent' }] : []),
      ...(settings.projects_enabled !== '0' ? [{ label: t('footer.newProjects'),   to: '/projects'             }] : []),
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

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section)
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || nlStatus === 'loading' || nlStatus === 'success') return
    setNlStatus('loading')
    setNlMessage('')
    try {
      const res = await newsletterApi.subscribe(email.trim())
      setNlStatus('success')
      setNlMessage(res.message || 'Inscription réussie !')
      setEmail('')
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 409) {
        setNlStatus('duplicate')
        setNlMessage(msg || 'Cette adresse est déjà inscrite.')
      } else {
        setNlStatus('error')
        setNlMessage(msg || 'Une erreur est survenue. Réessayez.')
      }
    }
  }

  return (
    <footer style={{ background: 'linear-gradient(180deg, #730D26 0%, #1a0208 60%, #0d0208 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 xs:px-5 pt-12 xs:pt-16 pb-safe">
        <div className="pb-8">
          {/* Brand — always full width on mobile, 2-col on md */}
          <div className="mb-10 md:mb-0 md:grid md:grid-cols-6 md:gap-10">
            <div className="md:col-span-2 mb-8 md:mb-0">
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
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 touch-manip"
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
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white/20"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      title={`${label} — configure in admin settings`}
                    >
                      <Icon size={15} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Link columns — accordion on mobile, static grid on md+ */}
            <div className="md:col-span-4 md:grid md:grid-cols-4 md:gap-6">
              {Object.entries(footerLinks).map(([section, links]) => {
                const isOpen = openSection === section
                return (
                  <div key={section} className="border-t border-white/8 md:border-0">
                    {/* Mobile: tappable header to toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSection(section)}
                      className="md:hidden w-full flex items-center justify-between py-4 text-left touch-manip"
                    >
                      <h4 className="text-white/70 font-semibold text-xs uppercase tracking-widest">{section}</h4>
                      <ChevronDown
                        size={16}
                        className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Desktop: always visible header */}
                    <h4 className="hidden md:block text-white/70 font-semibold text-xs uppercase tracking-widest mb-4">{section}</h4>

                    {/* Links — always visible on md+, toggleable on mobile */}
                    <ul
                      className={`space-y-3 overflow-hidden transition-all duration-300 md:block ${
                        isOpen ? 'max-h-60 pb-4' : 'max-h-0 md:max-h-none'
                      }`}
                    >
                      {links.map((link) => (
                        <li key={`${section}-${link.label}`}>
                          <Link
                            to={link.to}
                            className="text-white/35 text-sm hover:text-white/70 transition-colors duration-200 block py-0.5"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="rounded-3xl p-5 xs:p-8 mb-10"
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
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {nlStatus === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm py-2">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{nlMessage}</span>
                </div>
              ) : (
                <form className="flex gap-2 w-full md:w-auto" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (nlStatus) setNlStatus(null) }}
                    placeholder={t('footer.emailPlaceholder')}
                    disabled={nlStatus === 'loading'}
                    required
                    className="flex-1 md:w-64 text-sm text-white placeholder-white/25 outline-none px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px] disabled:opacity-50"
                    style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${nlStatus === 'error' || nlStatus === 'duplicate' ? 'rgba(220,80,80,0.5)' : 'rgba(255,255,255,0.1)'}` }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(200,169,126,0.4)'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = nlStatus === 'error' || nlStatus === 'duplicate' ? 'rgba(220,80,80,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  />
                  <button
                    type="submit"
                    disabled={nlStatus === 'loading'}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 bg-gold hover:bg-gold-dark shrink-0 touch-manip disabled:opacity-60"
                  >
                    {nlStatus === 'loading'
                      ? <Loader size={15} className="text-navy animate-spin" />
                      : <ArrowRight size={15} className="text-navy" />
                    }
                  </button>
                </form>
              )}
              {(nlStatus === 'error' || nlStatus === 'duplicate') && nlMessage && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{nlMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/25 text-sm">© {year} {settings.site_name || 'Agenz'}. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  )
}
