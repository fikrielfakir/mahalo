import { useEffect, useState } from 'react'
import { adminInvestors } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import { Plus, Pencil, Trash2, TrendingUp, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function InvestorsPage() {
  const { t } = useTranslation()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [transModal, setTransModal] = useState(null)

  const load = () => { setLoading(true); adminInvestors.list().then((r) => setRows(r.data || [])).finally(() => setLoading(false)) }
  useEffect(load, [])

  const open = (row = null) => { setEditing(row); setForm(row ? { name: row.name, description: row.description || '' } : { name: '', description: '' }); setModal(true) }
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try { editing ? await adminInvestors.update(editing.id, form) : await adminInvestors.create(form); setModal(false); load() }
    catch (err) { alert(err?.message || t('admin.common.error')) } finally { setSaving(false) }
  }

  const remove = async (id) => { if (!window.confirm(t('admin.investors.confirmDelete'))) return; await adminInvestors.delete(id); load() }

  return (
    <div>
      <PageHeader title={t('admin.investors.title')} subtitle={`${rows.length} ${t('admin.common.total')}`}>
        <Btn variant="gold" onClick={() => open()}><Plus size={15} /> {t('admin.investors.addInvestor')}</Btn>
      </PageHeader>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">{t('admin.common.loading')}</div> : rows.length === 0 ? <div className="p-8 text-center text-gray-400">{t('admin.investors.noInvestors')}</div> : (
          <div className="divide-y divide-gray-50">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <TrendingUp size={15} className="text-violet-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{r.description || '—'}</p>
                </div>
                <div className="flex gap-1">
                  <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={13} className="text-blue-500" /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ContentTranslationsModal
        open={!!transModal}
        onClose={() => setTransModal(null)}
        type="investor"
        item={transModal}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('admin.investors.editInvestor') : t('admin.investors.addInvestor')} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label={t('admin.investors.nameLabel')} required><Input value={form.name} onChange={f('name')} required placeholder={t('admin.investors.namePlaceholder')} /></FormField>
          <FormField label={t('admin.investors.descLabel')}><Textarea value={form.description} onChange={f('description')} rows={2} placeholder={t('admin.investors.descPlaceholder')} /></FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? t('admin.common.saving') : editing ? t('admin.common.update') : t('admin.common.create')}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
