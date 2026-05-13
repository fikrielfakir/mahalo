import { useEffect, useState } from 'react'
import { adminCategories } from '../api/adminApi'
import { PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'

export default function CategoriesPage() {
  const [rows, setRows]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]   = useState({ name: '', description: '', order: 0 })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminCategories.list().then((r) => setRows(r.data || [])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const open = (row = null) => {
    setEditing(row)
    setForm(row ? { name: row.name, description: row.description || '', order: row.order || 0 } : { name: '', description: '', order: 0 })
    setModal(true)
  }
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      editing ? await adminCategories.update(editing.id, form) : await adminCategories.create(form)
      setModal(false); load()
    } catch (err) { alert(err?.message || 'Error') } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return
    await adminCategories.delete(id); load()
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle={`${rows.length} total`}>
        <Btn variant="gold" onClick={() => open()}><Plus size={15} /> Add Category</Btn>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No categories yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center">
                  <Tag size={14} className="text-[#BA1932]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.properties_count ?? 0} properties</p>
                </div>
                <Badge color="gray">Order {r.order}</Badge>
                <div className="flex gap-1">
                  <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Name" required><Input value={form.name} onChange={f('name')} required placeholder="Apartment" /></FormField>
          <FormField label="Description"><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Optional description" /></FormField>
          <FormField label="Order (sort priority)"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
