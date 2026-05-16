import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft, Building2, MapPin, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const QUICK_LINKS = [
    { to: '/properties', label: t('errors.browseProperties'), icon: Building2 },
    { to: '/projects',   label: t('errors.newProjects'),      icon: MapPin     },
    { to: '/agents',     label: t('errors.findAgent'),        icon: Phone      },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full text-center">

          {/* Big 404 */}
          <div className="relative inline-block mb-8 select-none">
            <span
              className="text-[160px] sm:text-[200px] font-black leading-none"
              style={{ color: '#730D26', opacity: 0.07 }}
            >
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-navy flex items-center justify-center shadow-2xl">
                <Search size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t('errors.404Title')}
          </h1>
          <p className="text-navy/55 text-base mb-2">
            {t('errors.404Desc')}
          </p>
          <p className="text-navy/35 text-sm mb-10">
            {t('errors.404Sub')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors"
            >
              <ArrowLeft size={16} /> {t('errors.goBack')}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <Home size={16} /> {t('errors.home')}
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-navy/10 pt-10">
            <p className="text-navy/40 text-xs font-semibold uppercase tracking-widest mb-5">
              {t('errors.maybeLooking')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-gray-100 hover:border-navy/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy/8 flex items-center justify-center shrink-0 group-hover:bg-navy/12 transition-colors">
                    <Icon size={16} className="text-navy" />
                  </div>
                  <span className="text-sm font-semibold text-navy/70 group-hover:text-navy transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
