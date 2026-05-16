import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RotateCcw, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

export default function ServerErrorPage({ error, resetError }) {
  const { t } = useTranslation()

  const handleRetry = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center">

          {/* Big 500 */}
          <div className="relative inline-block mb-8 select-none">
            <span
              className="text-[160px] sm:text-[200px] font-black leading-none"
              style={{ color: '#730D26', opacity: 0.07 }}
            >
              500
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-navy flex items-center justify-center shadow-2xl">
                <AlertTriangle size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t('errors.500Title')}
          </h1>
          <p className="text-navy/55 text-base mb-2">
            {t('errors.500Desc')}
          </p>
          <p className="text-navy/35 text-sm mb-10">
            {t('errors.500Sub')}
          </p>

          {/* Error detail (dev only) */}
          {error?.message && (
            <div className="mb-8 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-left">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1.5">{t('errors.errorDetail')}</p>
              <code className="text-xs text-red-700 break-all leading-relaxed">{error.message}</code>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <RotateCcw size={16} /> {t('errors.retry')}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors"
            >
              <Home size={16} /> {t('errors.home')}
            </Link>
          </div>

          {/* Support nudge */}
          <div className="mt-12 flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-100 max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
              <Phone size={16} className="text-navy" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-navy">{t('errors.needHelp')}</p>
              <a href="tel:+212600000000" className="text-sm text-navy/60 hover:text-navy transition-colors font-medium">
                +212 6 00 00 00 00
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
