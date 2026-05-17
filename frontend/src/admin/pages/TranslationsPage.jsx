import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, RotateCcw, Save, CheckCircle, AlertCircle, Languages } from 'lucide-react'
import { adminLanguages } from '../api/adminApi'

function getToken() {
  return localStorage.getItem('admin_token') ?? ''
}

const API_BASE = '/api/v1/admin/translations'

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  )
}

function TranslationRow({ row, locale, onSaved, onReset }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(row.value)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setValue(row.value)
  }, [row.value])

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [editing])

  const handleSave = async () => {
    if (value === row.value) { setEditing(false); return }
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/${locale}/${encodeURIComponent(row.key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ value }),
      })
      if (!res.ok) throw new Error()
      onSaved(row.key, value)
      setEditing(false)
    } catch {
      onSaved(null, null, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!row.overridden) return
    setResetting(true)
    try {
      const res = await fetch(`${API_BASE}/${locale}/${encodeURIComponent(row.key)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      onReset(row.key, row.default)
      setValue(row.default)
      setEditing(false)
    } catch {
      onSaved(null, null, 'error')
    } finally {
      setResetting(false)
    }
  }

  const handleKeyChange = (e) => {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 group">
      <td className="px-4 py-3 align-top w-2/5">
        <div className="flex items-start gap-2">
          {row.overridden && (
            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#BA1932] shrink-0 mt-1.5" title="Overridden" />
          )}
          <span className="font-mono text-xs text-gray-500 break-all leading-relaxed">{row.key}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleKeyChange}
            rows={1}
            className="w-full text-sm border border-[#BA1932]/40 rounded-lg px-3 py-2 focus:outline-none focus:border-[#BA1932] resize-none overflow-hidden"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
        ) : (
          <span
            className="text-sm text-gray-800 cursor-pointer hover:text-[#BA1932] transition-colors block"
            onClick={() => setEditing(true)}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            {value || <span className="text-gray-300 italic">empty</span>}
          </span>
        )}
      </td>
      <td className="px-4 py-3 align-top w-36">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#730D26] text-white text-xs rounded-lg hover:bg-[#BA1932] disabled:opacity-50 transition-colors"
              >
                <Save size={12} />
                {saving ? '...' : 'Save'}
              </button>
              <button
                onClick={() => { setValue(row.value); setEditing(false) }}
                className="px-3 py-1.5 text-gray-500 text-xs rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-gray-600 text-xs rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
              {row.overridden && (
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  title="Reset to default"
                  className="p-1.5 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function TranslationsPage() {
  const [locales, setLocales]   = useState([])
  const [locale, setLocale]     = useState(null)
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [localesLoading, setLocalesLoading] = useState(true)
  const [search, setSearch]     = useState('')
  const [toast, setToast]       = useState(null)

  useEffect(() => {
    adminLanguages.list()
      .then(r => {
        const list = (r.data || []).filter(l => l.is_active)
        setLocales(list)
        if (list.length > 0) setLocale(list[0].code)
      })
      .catch(() => setToast({ message: 'Failed to load languages', type: 'error' }))
      .finally(() => setLocalesLoading(false))
  }, [])

  const fetchTranslations = useCallback(async (loc) => {
    if (!loc) return
    setLoading(true)
    setSearch('')
    try {
      const res = await fetch(`${API_BASE}?locale=${loc}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const json = await res.json()
      setRows(json.data ?? [])
    } catch {
      setToast({ message: 'Failed to load translations', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (locale) fetchTranslations(locale)
  }, [locale, fetchTranslations])

  const handleSaved = useCallback((key, value, error) => {
    if (error) {
      setToast({ message: 'Failed to save', type: 'error' })
      return
    }
    setRows(prev => prev.map(r => r.key === key ? { ...r, value, overridden: true } : r))
    setToast({ message: 'Translation saved', type: 'success' })
  }, [])

  const handleReset = useCallback((key, defaultValue) => {
    setRows(prev => prev.map(r => r.key === key ? { ...r, value: defaultValue, overridden: false } : r))
    setToast({ message: 'Reset to default', type: 'success' })
  }, [])

  const filtered = search.trim()
    ? rows.filter(r =>
        r.key.toLowerCase().includes(search.toLowerCase()) ||
        (r.value || '').toLowerCase().includes(search.toLowerCase())
      )
    : rows

  const overriddenCount = rows.filter(r => r.overridden).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#730D26]/10 flex items-center justify-center">
          <Languages size={20} className="text-[#730D26]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Translation Manager</h1>
          <p className="text-sm text-gray-500">Edit UI strings for any language without redeploying</p>
        </div>
      </div>

      {localesLoading ? (
        <div className="flex gap-2 mb-5">
          {[1,2,3,4].map(i => <div key={i} className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="flex gap-2 mb-5 flex-wrap">
          {locales.map(l => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                locale === l.code
                  ? 'bg-[#730D26] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{l.flag}</span>
              {l.native_label || l.label}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-1">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by key or value…"
            className="flex-1 text-sm outline-none placeholder-gray-400"
          />
          <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
            {overriddenCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BA1932]" />
                {overriddenCount} overridden
              </span>
            )}
            <span>{filtered.length} / {rows.length} keys</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-7 h-7 border-4 border-[#730D26] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">Key</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center text-gray-400 text-sm">
                      {rows.length === 0 ? 'No translation file found for this language' : 'No results match your search'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(row => (
                    <TranslationRow
                      key={`${locale}-${row.key}`}
                      row={row}
                      locale={locale}
                      onSaved={handleSaved}
                      onReset={handleReset}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 px-1 mt-2">
        Click any value to edit inline. Red dot = overridden from default. Changes go live immediately.
      </p>
    </div>
  )
}
