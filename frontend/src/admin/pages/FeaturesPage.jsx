import { useEffect, useState, useMemo } from 'react'
import { adminFeatures } from '../api/adminApi'
import { AdminTableSkeleton } from '../../components/Skeletons'
import { PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input } from '../components/Modal'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import {
  Plus, Pencil, Trash2, Search, Sparkles,
  Eye, EyeOff, LayoutGrid, List, CheckCircle2, Languages,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

function TablerIcon({ icon, size = 18, className = '' }) {
  if (!icon) return null
  return <i className={`${icon} text-[${size}px] ${className}`} style={{ fontSize: size }} />
}

function IconSwatch({ icon, active }) {
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
      ${active ? 'bg-[#730D26]/10 text-[#730D26]' : 'bg-gray-100 text-gray-400'}`}>
      {icon ? <TablerIcon icon={icon} size={18} /> : <Sparkles size={16} />}
    </div>
  )
}

const ICON_SUGGESTIONS = [
  'ti ti-wifi', 'ti ti-parking', 'ti ti-swim', 'ti ti-garden-cart',
  'ti ti-shield-check', 'ti ti-barbell', 'ti ti-air-conditioning',
  'ti ti-elevator', 'ti ti-fireplace', 'ti ti-dog', 'ti ti-balcony',
  'ti ti-solar-panel', 'ti ti-camera', 'ti ti-droplet', 'ti ti-plug',
  'ti ti-building-warehouse', 'ti ti-sofa', 'ti ti-bath', 'ti ti-bed',
  'ti ti-car-garage', 'ti ti-door', 'ti ti-key', 'ti ti-smart-home',
]

export default function FeaturesPage() {
  const { t } = useTranslation()
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({ name: '', icon: '', status: 'published' })
  const [saving, setSaving]   = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch]   = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [transModal, setTransModal] = useState(null)

  const load = () => {
    setLoading(true)
    adminFeatures.list().then(r => setRows(r.data || [])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = useMemo(() => {
    let list = rows
    if (search.trim()) list = list.filter(r => r.name.toLowerCase().includes(search.toLowerCase().trim()))
    if (filterStatus !== 'all') list = list.filter(r => r.status === filterStatus)
    return list
  }, [rows, search, filterStatus])

  const publishedCount = rows.filter(r => r.status === 'published').length
  const draftCount     = rows.filter(r => r.status === 'draft').length

  const open = (row = null) => {
    setEditing(row)
    setForm(row ? { name: row.name, icon: row.icon || '', status: row.status || 'published' } : { name: '', icon: '', status: 'published' })
    setModal(true)
  }
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      editing ? await adminFeatures.update(editing.id, form) : await adminFeatures.create(form)
      setModal(false); load()
    } catch (err) { alert(err?.message || t('admin.amenities.errorSaving')) } finally { setSaving(false) }
  }

  const toggleStatus = async row => {
    setTogglingId(row.id)
    try {
      const next = row.status === 'published' ? 'draft' : 'published'
      await adminFeatures.update(row.id, { status: next })
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: next } : r))
    } catch {} finally { setTogglingId(null) }
  }

  const remove = async id => {
    if (!window.confirm(t('admin.amenities.confirmDelete'))) return
    setDeletingId(id)
    try {
      await adminFeatures.delete(id)
      setRows(prev => prev.filter(r => r.id !== id))
    } catch { alert(t('admin.amenities.failedDelete')) } finally { setDeletingId(null) }
  }

  return (
    <div>
      <PageHeader title={t('admin.amenities.title')} subtitle={`${publishedCount} ${t('admin.amenities.active')} · ${draftCount} ${t('admin.amenities.hidden')}`}>
        <Btn variant="gold" onClick={() => open()}><Plus size={15} /> {t('admin.amenities.addAmenity')}</Btn>
      </PageHeader>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text" placeholder={t('admin.amenities.searchPlaceholder')} value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#730D26]/20 focus:border-[#730D26]/30 transition-all"
          />
        </div>

        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {[['all', t('admin.amenities.filterAll')], ['published', t('admin.amenities.filterActive')], ['draft', t('admin.amenities.filterHidden')]].map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${filterStatus === val ? 'bg-[#730D26] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {label}
              {val === 'all'       && rows.length       ? ` (${rows.length})`       : ''}
              {val === 'published' && publishedCount     ? ` (${publishedCount})`    : ''}
              {val === 'draft'     && draftCount         ? ` (${draftCount})`        : ''}
            </button>
          ))}
        </div>

        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-[#730D26] text-white' : 'text-gray-400 hover:bg-gray-50'}`} title={t('admin.amenities.gridView')}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setViewMode('list')} className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-[#730D26] text-white' : 'text-gray-400 hover:bg-gray-50'}`} title={t('admin.amenities.listView')}>
            <List size={15} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <AdminTableSkeleton rows={8} />
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={22} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {search || filterStatus !== 'all' ? t('admin.amenities.noMatch') : t('admin.amenities.noAmenities')}
            </p>
            {!search && filterStatus === 'all' && (
              <button onClick={() => open()} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#730D26] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                <Plus size={15} /> {t('admin.amenities.addFirst')}
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filtered.map(r => {
              const isPublished = r.status === 'published'
              const isToggling  = togglingId === r.id
              const isDeleting  = deletingId === r.id
              return (
                <div key={r.id} className={`bg-white p-4 flex items-center gap-3 group transition-colors hover:bg-gray-50/60 ${!isPublished ? 'opacity-60' : ''}`}>
                  <IconSwatch icon={r.icon} active={isPublished} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isPublished ? 'text-gray-800' : 'text-gray-400'}`}>{r.name}</p>
                    {r.icon && <p className="text-xs text-gray-400 font-mono truncate mt-0.5">{r.icon}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mr-1 ${isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {isPublished ? t('admin.amenities.statusActive') : t('admin.amenities.statusHidden')}
                    </span>
                    <button onClick={() => toggleStatus(r)} disabled={isToggling} title={isPublished ? t('admin.amenities.hideTitle') : t('admin.amenities.showTitle')} className="p-1.5 rounded-lg text-gray-300 hover:text-[#730D26] hover:bg-[#730D26]/5 transition-colors disabled:opacity-40">
                      {isToggling ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" /> : isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={12} className="text-blue-500" /></Btn>
                    <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={12} /></Btn>
                    <Btn size="sm" variant="danger" onClick={() => remove(r.id)} disabled={isDeleting}>
                      {isDeleting ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />}
                    </Btn>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 px-5 py-2.5 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="w-10 mr-3" />
              <div>{t('admin.amenities.colAmenity')}</div>
              <div className="text-right mr-4">{t('admin.amenities.colStatus')}</div>
              <div className="w-20" />
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map(r => {
                const isPublished = r.status === 'published'
                const isToggling  = togglingId === r.id
                const isDeleting  = deletingId === r.id
                return (
                  <div key={r.id} className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors ${!isPublished ? 'opacity-60' : ''}`}>
                    <IconSwatch icon={r.icon} active={isPublished} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{r.name}</p>
                      {r.icon && <code className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{r.icon}</code>}
                    </div>
                    <button onClick={() => toggleStatus(r)} disabled={isToggling} title={isPublished ? t('admin.amenities.hideTitle') : t('admin.amenities.showTitle')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 ${isPublished ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {isToggling
                        ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        : isPublished
                          ? <><CheckCircle2 size={12} /> {t('admin.amenities.statusActive')}</>
                          : <><EyeOff size={12} /> {t('admin.amenities.statusHidden')}</>}
                    </button>
                    <div className="flex gap-1">
                      <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={13} className="text-blue-500" /></Btn>
                      <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => remove(r.id)} disabled={isDeleting}>
                        {isDeleting ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 size={13} />}
                      </Btn>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {!loading && rows.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 px-1">
          {t('admin.amenities.showing', { count: filtered.length, total: rows.length })} ·{' '}
          <span className="text-emerald-600 font-medium">{publishedCount} {t('admin.amenities.visibleInForm')}</span>
          {draftCount > 0 && <span className="text-gray-400"> · {draftCount} {t('admin.amenities.statusHidden')}</span>}
        </p>
      )}

      <ContentTranslationsModal open={!!transModal} onClose={() => setTransModal(null)} type="feature" item={transModal} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `${t('admin.amenities.editAmenity')} — ${editing.name}` : t('admin.amenities.newAmenity')} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label={t('admin.amenities.nameLabel')} required>
            <Input value={form.name} onChange={f('name')} required placeholder={t('admin.amenities.namePlaceholder')} autoFocus />
          </FormField>

          <FormField label={t('admin.amenities.iconLabel')} hint={
            <a href="https://tabler-icons.io" target="_blank" rel="noreferrer" className="underline hover:text-[#730D26]">
              {t('admin.amenities.browseIcons')}
            </a>
          }>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input value={form.icon} onChange={f('icon')} placeholder="ti ti-swim" className="font-mono" />
              </div>
              <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 text-[#730D26]">
                {form.icon ? <TablerIcon icon={form.icon} size={18} /> : <Sparkles size={16} className="text-gray-300" />}
              </div>
            </div>
          </FormField>

          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">{t('admin.amenities.quickPick')}</p>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {ICON_SUGGESTIONS.map(cls => (
                <button key={cls} type="button" title={cls} onClick={() => setForm(p => ({ ...p, icon: cls }))}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all text-base ${form.icon === cls ? 'border-[#730D26] bg-[#730D26]/5 text-[#730D26]' : 'border-gray-200 text-gray-500 hover:border-[#730D26]/40 hover:bg-gray-50'}`}>
                  <TablerIcon icon={cls} size={16} />
                </button>
              ))}
            </div>
          </div>

          <FormField label={t('admin.amenities.visibilityLabel')}>
            <div className="flex gap-2">
              {[['published', t('admin.amenities.visibleActive'), CheckCircle2], ['draft', t('admin.amenities.visibleHidden'), EyeOff]].map(([val, label, Icon]) => (
                <button key={val} type="button" onClick={() => setForm(p => ({ ...p, status: val }))}
                  className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${form.status === val
                    ? val === 'published' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-300 bg-gray-50 text-gray-500'
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </FormField>

          <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>
              {saving ? t('admin.common.saving') : editing ? t('admin.amenities.updateAmenity') : t('admin.amenities.createAmenity')}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
