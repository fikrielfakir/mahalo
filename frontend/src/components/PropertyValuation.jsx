import { useState } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { aiApi } from '../api/aiApi'

const LANG_NAMES = { fr: 'French', en: 'English', ar: 'Arabic', es: 'Spanish', de: 'German' }

export default function PropertyValuation({ property }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen]       = useState(false)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const run = async () => {
    if (result) { setOpen(o => !o); return }
    setOpen(true)
    setLoading(true)
    setError(null)
    try {
      const features = [
        ...(property.features?.map(f => f.name) ?? []),
      ].join(', ') || 'None'

      const langCode = i18n.language?.split('-')[0] || 'fr'
      const language = LANG_NAMES[langCode] || 'French'

      const res = await aiApi.valuation({
        type:      property.type,
        area:      property.square,
        bedrooms:  property.number_bedroom,
        bathrooms: property.number_bathroom,
        city:      property.city?.name,
        location:  property.location,
        condition: property.condition,
        age:       property.age_range,
        features,
        language,
      })
      setResult(res.result)
    } catch {
      setError(t('property.valuationError') || 'Could not generate valuation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatted = result
    ? result
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+\.\s)/gm, '<br/><span class="text-gold font-bold">$1</span>')
        .replace(/^[-•]\s/gm, '<br/>• ')
        .trim()
    : null

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      <button
        onClick={run}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
            <Sparkles size={17} className="text-gold" />
          </div>
          <div className="text-left">
            <div className="font-bold text-navy text-sm">{t('property.aiPriceEstimate') || 'AI Price Estimate'}</div>
            <div className="text-navy/40 text-xs">{t('property.poweredByMahaloAi') || 'Powered by Mahalo AI'}</div>
          </div>
        </div>
        {loading
          ? <Loader2 size={16} className="animate-spin text-navy/30" />
          : open
            ? <ChevronUp size={16} className="text-navy/30" />
            : <ChevronDown size={16} className="text-navy/30" />
        }
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          {loading && (
            <div className="flex items-center gap-2 py-6 text-navy/50 text-sm">
              <Loader2 size={15} className="animate-spin" />
              {t('property.analyzingMarket') || 'Analyzing market data…'}
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm py-4">{error}</p>
          )}
          {formatted && !loading && (
            <div
              className="prose prose-sm max-w-none mt-4 text-navy/80 text-sm leading-relaxed [&_strong]:text-navy [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          )}
        </div>
      )}
    </div>
  )
}
