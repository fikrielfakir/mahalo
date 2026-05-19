import { useState } from 'react'
import { Sparkles, Loader2, Check, Copy } from 'lucide-react'

export default function AiDescriptionGenerator({ form, onInsert }) {
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [language, setLanguage] = useState('French')
  const [tone, setTone]         = useState('luxury and prestigious, targeting high-net-worth buyers')

  const TONES = [
    { value: 'luxury and prestigious, targeting high-net-worth buyers', label: 'Luxury & Prestigious' },
    { value: 'warm and family-friendly', label: 'Family-Friendly' },
    { value: 'professional and investment-focused', label: 'Investment-Focused' },
    { value: 'modern and minimalist', label: 'Modern & Minimalist' },
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
      setError(e.message || 'Generation failed. Please try again.')
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
        <span className="text-xs font-semibold text-[#730D26] uppercase tracking-wide">AI Description Generator</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Language</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#730D26]/40 bg-white"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#730D26]/40 bg-white"
          >
            {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
        {loading ? 'Generating…' : 'Generate Description'}
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
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => onInsert(result)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#730D26] text-white text-xs font-semibold hover:bg-[#BA1932] transition-colors"
            >
              <Check size={12} />
              Insert into Description
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
