import { useState, useEffect } from 'react'
import { HelpCircle, ChevronDown, Search, Phone, Loader2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { faqsApi } from '../api/client'

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="text-sm font-semibold text-navy leading-snug">{question}</span>
        <ChevronDown size={16} className={`text-[#BA1932] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-sm text-navy/60 leading-relaxed pb-4 pr-6">{answer}</p>
      )}
    </div>
  )
}

export default function HelpCenterPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    faqsApi.list()
      .then(res => {
        const d = res.data ?? {}
        setGrouped(Array.isArray(d) ? {} : d)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const allCategories = Object.entries(grouped)

  const filtered = allCategories.map(([cat, items]) => ({
    cat,
    items: items.filter(
      ({ question, answer }) =>
        !query ||
        question.toLowerCase().includes(query.toLowerCase()) ||
        answer.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(({ items }) => items.length > 0)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title={t('helpCenter.seoTitle')}
        description={t('helpCenter.seoDesc')}
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <HelpCircle size={12} /> {t('helpCenter.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('helpCenter.title')}</h1>
        <div className="max-w-md mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('helpCenter.searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
          />
        </div>
      </section>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-navy/40">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">{t('helpCenter.loading')}</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-24 text-navy/40">
              <AlertCircle size={36} className="opacity-40" />
              <p className="text-sm font-medium">{t('helpCenter.loadError')}</p>
              <Link to="/contact" className="text-[#BA1932] text-sm hover:underline">{t('helpCenter.contactUs')}</Link>
            </div>
          )}

          {!loading && !error && allCategories.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-24 text-navy/40">
              <HelpCircle size={40} className="opacity-30" />
              <p className="font-medium text-sm">{t('helpCenter.noQuestions')}</p>
              <Link to="/contact" className="text-[#BA1932] text-sm hover:underline">{t('helpCenter.contactUs')}</Link>
            </div>
          )}

          {!loading && !error && allCategories.length > 0 && query && filtered.length === 0 && (
            <div className="text-center py-16 text-navy/40">
              <HelpCircle size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">{t('helpCenter.noResults', { query })}</p>
              <p className="text-sm mt-1">
                {t('helpCenter.noResultsHint')} <Link to="/contact" className="text-[#BA1932] hover:underline">{t('helpCenter.noResultsLink')}</Link>.
              </p>
            </div>
          )}

          {!loading && !error && filtered.map(({ cat, items }) => (
            <div key={cat} className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center">
                  <HelpCircle size={15} className="text-[#BA1932]" />
                </div>
                <h2 className="font-bold text-gray-800 text-sm capitalize">{cat}</h2>
              </div>
              <div className="px-6">
                {items.map(item => <FAQItem key={item.id} {...item} />)}
              </div>
            </div>
          ))}

          {!loading && !error && allCategories.length > 0 && (
            <div className="text-center pt-4">
              <p className="text-navy/50 text-sm mb-3">{t('helpCenter.notFound')}</p>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BA1932] text-white font-semibold text-sm hover:bg-[#730D26] transition-colors">
                <Phone size={14} /> {t('helpCenter.contactBtn')}
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
