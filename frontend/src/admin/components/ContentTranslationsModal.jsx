import { useState, useEffect } from 'react'
import Modal, { FormField, Input, Textarea } from './Modal'
import { adminContentTranslations, adminLanguages } from '../api/adminApi'
import { Languages, Save, Check, Wand2, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const TYPE_FIELDS = {
  property:  [
    { key: 'name',        labelKey: 'admin.contentTranslations.fieldName',        type: 'input' },
    { key: 'description', labelKey: 'admin.contentTranslations.fieldDescription', type: 'textarea', rows: 3 },
    { key: 'content',     labelKey: 'admin.contentTranslations.fieldContent',     type: 'textarea', rows: 5 },
  ],
  project:   [
    { key: 'name',        labelKey: 'admin.contentTranslations.fieldName',        type: 'input' },
    { key: 'description', labelKey: 'admin.contentTranslations.fieldDescription', type: 'textarea', rows: 3 },
    { key: 'content',     labelKey: 'admin.contentTranslations.fieldContent',     type: 'textarea', rows: 5 },
  ],
  agent:     [
    { key: 'description', labelKey: 'admin.contentTranslations.fieldBio', type: 'textarea', rows: 4 },
  ],
  category:  [
    { key: 'name',        labelKey: 'admin.contentTranslations.fieldName',        type: 'input' },
    { key: 'description', labelKey: 'admin.contentTranslations.fieldDescription', type: 'textarea', rows: 3 },
  ],
  feature:   [{ key: 'name', labelKey: 'admin.contentTranslations.fieldName', type: 'input' }],
  facility:  [{ key: 'name', labelKey: 'admin.contentTranslations.fieldName', type: 'input' }],
  investor:  [{ key: 'name', labelKey: 'admin.contentTranslations.fieldName', type: 'input' }],
  city:      [{ key: 'name', labelKey: 'admin.contentTranslations.fieldName', type: 'input' }],
  faq:       [
    { key: 'question', labelKey: 'admin.contentTranslations.fieldName',        type: 'input' },
    { key: 'answer',   labelKey: 'admin.contentTranslations.fieldDescription', type: 'textarea', rows: 4 },
  ],
}

async function translateText(text, targetLang) {
  if (!text || !text.trim()) return ''
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
  const res = await fetch(url)
  const json = await res.json()
  return json?.responseData?.translatedText || text
}

export default function ContentTranslationsModal({ open, onClose, type, item }) {
  const { t } = useTranslation()
  const [locales, setLocales]             = useState([])
  const [localesLoading, setLocalesLoading] = useState(true)
  const [activeLocale, setActiveLocale]   = useState(null)
  const [translations, setTranslations]   = useState({})
  const [loading, setLoading]             = useState(false)
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [translating, setTranslating]     = useState(false)
  const [translateError, setTranslateError] = useState(null)
  const [error, setError]                 = useState(null)

  const rawFields = TYPE_FIELDS[type] || []

  useEffect(() => {
    adminLanguages.list()
      .then(r => {
        const list = (r.data || []).filter(l => l.is_active)
        setLocales(list)
        if (list.length > 0 && !activeLocale) {
          setActiveLocale(list[0].code)
        }
      })
      .catch(() => {})
      .finally(() => setLocalesLoading(false))
  }, [])

  useEffect(() => {
    if (!open || !item?.id || locales.length === 0) return
    setLoading(true)
    setError(null)
    setTranslateError(null)
    const empty = {}
    locales.forEach(l => { empty[l.code] = {} })
    setTranslations(empty)
    adminContentTranslations.get(type, item.id)
      .then(r => setTranslations(r.data || empty))
      .catch(() => setError(t('admin.contentTranslations.loadFailed')))
      .finally(() => setLoading(false))
  }, [open, type, item?.id, locales])

  const setValue = (locale, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  const autoTranslate = async () => {
    if (!item || !activeLocale) return
    const locMeta = locales.find(l => l.code === activeLocale)
    if (!locMeta) return
    if (activeLocale === 'en') {
      const result = {}
      rawFields.forEach(f => { result[f.key] = item[f.key] || '' })
      setTranslations(prev => ({ ...prev, en: result }))
      return
    }
    setTranslating(true)
    setTranslateError(null)
    try {
      const result = {}
      for (const field of rawFields) {
        const source = item[field.key] || ''
        result[field.key] = source ? await translateText(source, locMeta.mymemory_code || locMeta.code) : ''
      }
      setTranslations(prev => ({ ...prev, [activeLocale]: result }))
    } catch {
      setTranslateError(t('admin.contentTranslations.translateFailed'))
    } finally {
      setTranslating(false)
    }
  }

  const save = async () => {
    if (!item?.id || !activeLocale) return
    setSaving(true)
    setError(null)
    try {
      await adminContentTranslations.save(type, item.id, {
        locale:       activeLocale,
        translations: translations[activeLocale] || {},
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError(t('admin.contentTranslations.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const currentData   = translations[activeLocale] || {}
  const activeLocMeta = locales.find(l => l.code === activeLocale)
  const itemLabel     = item?.name || (item?.first_name ? `${item.first_name} ${item.last_name}` : `#${item?.id}`)
  const hasSourceData = rawFields.some(f => item?.[f.key])

  return (
    <Modal open={open} onClose={onClose} title={
      <div className="flex items-center gap-2">
        <Languages size={18} className="text-[#BA1932]" />
        <span>{t('admin.contentTranslations.title')} — <span className="text-[#BA1932]">{itemLabel}</span></span>
      </div>
    } size="lg">
      <div className="flex gap-4 h-full" style={{ minHeight: 360 }}>
        {/* Locale sidebar */}
        <div className="w-36 shrink-0 flex flex-col gap-1">
          {localesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#BA1932] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : locales.map(loc => (
            <button
              key={loc.code}
              onClick={() => { setActiveLocale(loc.code); setTranslateError(null) }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                activeLocale === loc.code
                  ? 'bg-[#BA1932]/10 text-[#BA1932] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{loc.flag}</span>
              <span>{loc.label}</span>
            </button>
          ))}
        </div>

        {/* Editor area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">{t('admin.contentTranslations.loading')}</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeLocMeta?.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{activeLocMeta?.label}</p>
                    <p className="text-xs text-gray-400">{t('admin.contentTranslations.fallbackHint')}</p>
                  </div>
                </div>

                {hasSourceData && (
                  <button
                    onClick={autoTranslate}
                    disabled={translating}
                    title={`Auto-translate fields from the original content into ${activeLocMeta?.label}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-100"
                  >
                    {translating
                      ? <><Loader2 size={13} className="animate-spin" /> {t('admin.contentTranslations.translating')}</>
                      : <><Wand2 size={13} /> {t('admin.contentTranslations.autoTranslate')}</>
                    }
                  </button>
                )}
              </div>

              {translateError && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                  {translateError}
                </p>
              )}

              {rawFields.map(field => (
                <FormField key={field.key} label={t(field.labelKey)}>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={currentData[field.key] || ''}
                      onChange={e => setValue(activeLocale, field.key, e.target.value)}
                      rows={field.rows || 3}
                      placeholder={`${t(field.labelKey)} in ${activeLocMeta?.label}…`}
                      dir={activeLocMeta?.is_rtl ? 'rtl' : 'ltr'}
                    />
                  ) : (
                    <Input
                      value={currentData[field.key] || ''}
                      onChange={e => setValue(activeLocale, field.key, e.target.value)}
                      placeholder={`${t(field.labelKey)} in ${activeLocMeta?.label}…`}
                      dir={activeLocMeta?.is_rtl ? 'rtl' : 'ltr'}
                    />
                  )}
                </FormField>
              ))}

              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={save}
                  disabled={saving || !activeLocale}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    saved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#BA1932] hover:bg-[#9a1525] text-white'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {saved
                    ? <><Check size={15} /> {t('admin.contentTranslations.saved')}</>
                    : saving
                      ? <><Save size={15} className="animate-pulse" /> {t('admin.contentTranslations.saving')}</>
                      : <><Save size={15} /> {t('admin.contentTranslations.save')} {activeLocMeta?.label}</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
