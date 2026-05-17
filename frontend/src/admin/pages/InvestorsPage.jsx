import { useEffect, useState } from 'react'
import { adminInvestors } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import { Plus, Pencil, Trash2, TrendingUp, Languages } from 'lucide-react'

export default function InvestorsPage() {
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
    catch (err) { alert(err?.message || 'Error') } finally { setSaving(false) }
  }

  const remove = async (id) => { if (!window.confirm('Delete?')) return; await adminInvestors.delete(id); load() }

  return (
    <div>
      <PageHeader title="Investors" subtitle={`${rows.length} total`}>
        <Btn variant="gold" onClick={() => open()}><Plus size={15} /> Add Investor</Btn>
      </PageHeader>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : rows.length === 0 ? <div className="p-8 text-center text-gray-400">No investors yet</div> : (
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Investor' : 'Add Investor'} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Name" required><Input value={form.name} onChange={f('name')} required placeholder="Horizon Group" /></FormField>
          <FormField label="Description"><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="About this investor..." /></FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
