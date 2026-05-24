import { useState } from 'react'
import { Sparkles, Loader2, Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AiDescriptionGenerator({ form, onInsert }) {
  const { t } = useTranslation()
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [language, setLanguage] = useState('French')
  const [tone, setTone]         = useState('luxury and prestigious, targeting high-net-worth buyers')

  const TONES = [
    { value: 'luxury and prestigious, targeting high-net-worth buyers', label: t('admin.aiGenerator.toneLuxury') },
    { value: 'warm and family-friendly', label: t('admin.aiGenerator.toneFamily') },
    { value: 'professional and investment-focused', label: t('admin.aiGenerator.toneInvestment') },
    { value: 'modern and minimalist', label: t('admin.aiGenerator.toneModern') },
  ]
  const LANGUAGES = ['French', 'English', 'Arabic']

  const generate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setCopied(false)
    try {
      const features = form.feature_ids?.length
        ? form.feature_ids.join(', ')
        : form.features || ''

      const res = await fetch('/api/v1/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:      form.name      || 'Property',
          type:      form.type      || 'sale',
          area:      form.square    || null,
          bedrooms:  form.number_bedroom  || null,
          bathrooms: form.number_bathroom || null,
          city:      form.city_name || form.city || null,
          location:  form.location  || null,
          condition: form.condition || null,
          price:     form.price     || null,
          features,
          tone,
          language,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.description)
    } catch (e) {
      setError(e.message || t('admin.aiGenerator.failed'))
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-dashed border-[#730D26]/30 rounded-2xl p-4 bg-[#730D26]/3 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-[#730D26]" />
        <span className="text-xs font-semibold text-[#730D26] uppercase tracking-wide">{t('admin.aiGenerator.title')}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('admin.aiGenerator.languageLabel')}</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#730D26]/40 bg-white"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('admin.aiGenerator.toneLabel')}</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#730D26]/40 bg-white"
          >
            {TONES.map(to => <option key={to.value} value={to.value}>{to.label}</option>)}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading || !form.name}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#730D26] text-white text-sm font-semibold hover:bg-[#BA1932] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {loading ? t('admin.aiGenerator.generating') : t('admin.aiGenerator.generate')}
      </button>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {result && (
        <div className="relative">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {result}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? t('admin.aiGenerator.copied') : t('admin.aiGenerator.copy')}
            </button>
            <button
              type="button"
              onClick={() => onInsert(result)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#730D26] text-white text-xs font-semibold hover:bg-[#BA1932] transition-colors"
            >
              <Check size={12} />
              {t('admin.aiGenerator.insert')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
