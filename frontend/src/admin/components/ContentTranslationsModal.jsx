import { useState, useEffect } from 'react'
import Modal, { FormField, Input, Textarea } from './Modal'
import { adminContentTranslations } from '../api/adminApi'
import { Languages, Save, Check } from 'lucide-react'

const LOCALES = [
  { code: 'fr', label: 'French',     flag: '🇫🇷' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic',     flag: '🇸🇦', rtl: true },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸' },
  { code: 'tr', label: 'Turkish',    flag: '🇹🇷' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
]

const TYPE_FIELDS = {
  property:  [
    { key: 'name',        label: 'Name',        type: 'input' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'content',     label: 'Content',     type: 'textarea', rows: 5 },
  ],
  project:   [
    { key: 'name',        label: 'Name',        type: 'input' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'content',     label: 'Content',     type: 'textarea', rows: 5 },
  ],
  agent:     [
    { key: 'description', label: 'Bio / Description', type: 'textarea', rows: 4 },
  ],
  category:  [
    { key: 'name',        label: 'Name',        type: 'input' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
  ],
  feature:   [{ key: 'name', label: 'Name', type: 'input' }],
  facility:  [{ key: 'name', label: 'Name', type: 'input' }],
  investor:  [{ key: 'name', label: 'Name', type: 'input' }],
  city:      [{ key: 'name', label: 'Name', type: 'input' }],
}

function emptyTranslations() {
  const obj = {}
  LOCALES.forEach(l => { obj[l.code] = {} })
  return obj
}

export default function ContentTranslationsModal({ open, onClose, type, item }) {
  const [activeLocale, setActiveLocale]   = useState('fr')
  const [translations, setTranslations]   = useState(emptyTranslations)
  const [loading, setLoading]             = useState(false)
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [error, setError]                 = useState(null)

  const fields = TYPE_FIELDS[type] || []

  useEffect(() => {
    if (!open || !item?.id) return
    setLoading(true)
    setError(null)
    setTranslations(emptyTranslations())
    adminContentTranslations.get(type, item.id)
      .then(r => setTranslations(r.data || emptyTranslations()))
      .catch(() => setError('Failed to load translations'))
      .finally(() => setLoading(false))
  }, [open, type, item?.id])

  const setValue = (locale, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }

  const save = async () => {
    if (!item?.id) return
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
      setError('Failed to save translations')
    } finally {
      setSaving(false)
    }
  }

  const currentData  = translations[activeLocale] || {}
  const activeLocMeta = LOCALES.find(l => l.code === activeLocale)

  const itemLabel = item?.name || (item?.first_name ? `${item.first_name} ${item.last_name}` : `#${item?.id}`)

  return (
    <Modal open={open} onClose={onClose} title={
      <div className="flex items-center gap-2">
        <Languages size={18} className="text-[#BA1932]" />
        <span>Translations — <span className="text-[#BA1932]">{itemLabel}</span></span>
      </div>
    } size="lg">
      <div className="flex gap-4 h-full" style={{ minHeight: 360 }}>
        <div className="w-36 shrink-0 flex flex-col gap-1">
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setActiveLocale(loc.code)}
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

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading translations…</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-100">
                <span className="text-xl">{activeLocMeta?.flag}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{activeLocMeta?.label}</p>
                  <p className="text-xs text-gray-400">
                    Leave blank to fall back to the default value
                  </p>
                </div>
              </div>

              {fields.map(field => (
                <FormField key={field.key} label={field.label}>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={currentData[field.key] || ''}
                      onChange={e => setValue(activeLocale, field.key, e.target.value)}
                      rows={field.rows || 3}
                      placeholder={`${field.label} in ${activeLocMeta?.label}…`}
                      dir={activeLocMeta?.rtl ? 'rtl' : 'ltr'}
                    />
                  ) : (
                    <Input
                      value={currentData[field.key] || ''}
                      onChange={e => setValue(activeLocale, field.key, e.target.value)}
                      placeholder={`${field.label} in ${activeLocMeta?.label}…`}
                      dir={activeLocMeta?.rtl ? 'rtl' : 'ltr'}
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
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    saved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#BA1932] hover:bg-[#9a1525] text-white'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {saved
                    ? <><Check size={15} /> Saved!</>
                    : saving
                      ? <><Save size={15} className="animate-pulse" /> Saving…</>
                      : <><Save size={15} /> Save {activeLocMeta?.label}</>
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
