import { useEffect, useState } from 'react'
import { Cookie, Loader2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { publicSettingsApi } from '../api/client'

function renderMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-navy mt-7 mb-2">{line.slice(3)}</h2>
      if (line.startsWith('# '))  return <h1 key={i} className="text-2xl font-bold text-navy mt-8 mb-3">{line.slice(2)}</h1>
      if (line.startsWith('- '))  return <li key={i} className="ml-5 list-disc text-navy/70 text-sm leading-relaxed">{line.slice(2)}</li>
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="text-navy/70 text-sm leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy font-semibold">{part}</strong> : part)}
          </p>
        )
      }
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-navy/70 text-sm leading-relaxed">{line}</p>
    })
}

export default function CookiePolicyPage() {
  const { t, i18n } = useTranslation()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const locale = i18n.language?.slice(0, 2)
    setLoading(true)
    publicSettingsApi.get(locale)
      .then(res => {
        const val = res.data?.page_cookie
        setContent(val && val.trim() ? val : null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [i18n.language])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title={t('pages.cookie.seoTitle')}
        description={t('pages.cookie.seoDesc')}
        robots="noindex,follow"
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <Cookie size={12} /> {t('pages.cookie.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('pages.cookie.title')}</h1>
        <p className="text-white/50 text-sm">{t('pages.lastUpdated')}</p>
      </section>

      <main className="flex-1 py-14 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-10">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-16 text-navy/40">
              <Loader2 size={20} className="animate-spin" /> {t('pages.loading')}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-16 text-navy/40">
              <AlertCircle size={32} className="opacity-40" />
              <p className="text-sm">{t('pages.loadError')}</p>
            </div>
          )}

          {!loading && !error && !content && (
            <div className="flex flex-col items-center gap-3 py-16 text-navy/40">
              <Cookie size={36} className="opacity-30" />
              <p className="text-sm font-medium">{t('pages.noContent')}</p>
              <p className="text-xs text-center max-w-xs">
                {t('pages.noContentDesc')}
              </p>
            </div>
          )}

          {!loading && !error && content && (
            <div className="space-y-0.5">
              {renderMarkdown(content)}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
