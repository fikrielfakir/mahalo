import { useEffect, useState } from 'react'
import { adminFeatures } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import Modal, { FormField, Input } from '../components/Modal'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

export default function FeaturesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '' })
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); adminFeatures.list().then((r) => setRows(r.data || [])).finally(() => setLoading(false)) }
  useEffect(load, [])

  const open = (row = null) => { setEditing(row); setForm(row ? { name: row.name, icon: row.icon || '' } : { name: '', icon: '' }); setModal(true) }
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try { editing ? await adminFeatures.update(editing.id, form) : await adminFeatures.create(form); setModal(false); load() }
    catch (err) { alert(err?.message || 'Error') } finally { setSaving(false) }
  }

  const remove = async (id) => { if (!window.confirm('Delete?')) return; await adminFeatures.delete(id); load() }

  return (
    <div>
      <PageHeader title="Features" subtitle={`${rows.length} total`}>
        <Btn variant="gold" onClick={() => open()}><Plus size={15} /> Add Feature</Btn>
      </PageHeader>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {rows.map((r) => (
              <div key={r.id} className="bg-white p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Star size={15} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{r.icon || '—'}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={12} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={12} /></Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Feature' : 'Add Feature'} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Name" required><Input value={form.name} onChange={f('name')} required placeholder="Swimming Pool" /></FormField>
          <FormField label="Icon class" hint="e.g. ti ti-pool"><Input value={form.icon} onChange={f('icon')} placeholder="ti ti-pool" /></FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
