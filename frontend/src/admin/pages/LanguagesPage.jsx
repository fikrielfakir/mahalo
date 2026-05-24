import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Globe, Check, X, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react'
import { adminLanguages } from '../api/adminApi'
import { useTranslation } from 'react-i18next'

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {message}
    </div>
  )
}

const EMPTY_FORM = { code: '', label: '', native_label: '', flag: '', mymemory_code: '', is_rtl: false, is_active: true, sort_order: 0 }

function LanguageForm({ initial, onSave, onCancel, saving, t }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldCode')} <span className="text-red-400">*</span></label>
          <input value={form.code} onChange={e => set('code', e.target.value.toLowerCase())} placeholder="e.g. fr" maxLength={10} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldLabel')} <span className="text-red-400">*</span></label>
          <input value={form.label} onChange={e => set('label', e.target.value)} placeholder="e.g. French" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldNativeLabel')}</label>
          <input value={form.native_label} onChange={e => set('native_label', e.target.value)} placeholder="e.g. Français" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldFlag')}</label>
          <input value={form.flag} onChange={e => set('flag', e.target.value)} placeholder="e.g. 🇫🇷" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldMymemory')}</label>
          <input value={form.mymemory_code} onChange={e => set('mymemory_code', e.target.value.toLowerCase())} placeholder="e.g. fr" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t('admin.languages.fieldSortOrder')}</label>
          <input type="number" min={0} value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#BA1932]" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={!!form.is_rtl} onChange={e => set('is_rtl', e.target.checked)} className="w-4 h-4 accent-[#BA1932]" />
          <span className="text-sm text-gray-700">{t('admin.languages.rtlLabel')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#BA1932]" />
          <span className="text-sm text-gray-700">{t('admin.languages.activeLabel')}</span>
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} disabled={saving || !form.code || !form.label} className="flex items-center gap-2 px-4 py-2 bg-[#BA1932] hover:bg-[#9a1525] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
          <Check size={14} />
          {saving ? t('admin.common.saving') : t('admin.common.save')}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
          <X size={14} />
          {t('admin.common.cancel')}
        </button>
      </div>
    </div>
  )
}

export default function LanguagesPage() {
  const { t } = useTranslation()
  const [languages, setLanguages] = useState([])
  const [loading, setLoading]     = useState(true)
  const [adding, setAdding]       = useState(false)
  const [editId, setEditId]       = useState(null)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState(null)

  const load = () => {
    setLoading(true)
    adminLanguages.list()
      .then(r => setLanguages(r.data || []))
      .catch(() => setToast({ message: t('admin.languages.failedLoad'), type: 'error' }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleCreate = async (form) => {
    setSaving(true)
    try {
      await adminLanguages.create(form)
      setAdding(false)
      setToast({ message: t('admin.languages.toastAdded'), type: 'success' })
      load()
    } catch (e) {
      setToast({ message: e?.message || t('admin.languages.failedCreate'), type: 'error' })
    } finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      await adminLanguages.update(editId, form)
      setEditId(null)
      setToast({ message: t('admin.languages.toastUpdated'), type: 'success' })
      load()
    } catch (e) {
      setToast({ message: e?.message || t('admin.languages.failedUpdate'), type: 'error' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id, label) => {
    if (!confirm(t('admin.languages.confirmDelete', { label }))) return
    try {
      await adminLanguages.delete(id)
      setToast({ message: t('admin.languages.toastDeleted'), type: 'success' })
      load()
    } catch { setToast({ message: t('admin.languages.failedDelete'), type: 'error' }) }
  }

  const handleToggleActive = async (lang) => {
    try {
      await adminLanguages.update(lang.id, { is_active: !lang.is_active })
      setToast({ message: lang.is_active ? t('admin.languages.toastDisabled') : t('admin.languages.toastEnabled'), type: 'success' })
      load()
    } catch { setToast({ message: t('admin.languages.failedUpdate'), type: 'error' }) }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#730D26]/10 flex items-center justify-center">
            <Globe size={20} className="text-[#730D26]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('admin.languages.title')}</h1>
            <p className="text-sm text-gray-500">{t('admin.languages.subtitle')}</p>
          </div>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditId(null) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#BA1932] hover:bg-[#9a1525] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={15} />
            {t('admin.languages.addLanguage')}
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <LanguageForm onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} t={t} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-7 h-7 border-4 border-[#730D26] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : languages.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">{t('admin.languages.noLanguages')}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8"></th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.languages.colLanguage')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.languages.colCode')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.languages.colMymemory')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.languages.colOptions')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.languages.colStatus')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">{t('admin.languages.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {languages.map(lang => (
                editId === lang.id ? (
                  <tr key={lang.id}>
                    <td colSpan={7} className="px-4 py-3">
                      <LanguageForm initial={{ ...lang, is_rtl: !!lang.is_rtl, is_active: !!lang.is_active }} onSave={handleUpdate} onCancel={() => setEditId(null)} saving={saving} t={t} />
                    </td>
                  </tr>
                ) : (
                  <tr key={lang.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                    <td className="px-4 py-3 text-gray-300"><GripVertical size={14} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lang.flag}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{lang.label}</p>
                          {lang.native_label && <p className="text-xs text-gray-400">{lang.native_label}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{lang.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-400">{lang.mymemory_code || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {lang.is_rtl && (
                          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">RTL</span>
                        )}
                        <span className="text-xs text-gray-400">order: {lang.sort_order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(lang)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          lang.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {lang.is_active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {lang.is_active ? t('admin.languages.statusActive') : t('admin.languages.statusDisabled')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditId(lang.id); setAdding(false) }} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(lang.id, lang.label)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 px-1 mt-3">{t('admin.languages.footerNote')}</p>
    </div>
  )
}
