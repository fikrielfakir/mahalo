import { useEffect, useState, useCallback } from 'react'
import { adminCities } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import { Plus, Pencil, Trash2, Globe, Building2 } from 'lucide-react'

const EMPTY = { name: '', country: 'Morocco', state: '', image_url: '', description: '' }

export default function CitiesPage() {
  const [rows, setRows]     = useState([])
  const [meta, setMeta]     = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminCities.list({ search, page, per_page: 15 })
      .then((r) => { setRows(r.data || []); setMeta(r.meta || {}) })
      .catch(() => setError('Cities API not available on this backend yet.'))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const open = (row = null) => {
    setEditing(row)
    setForm(row ? {
      name: row.name || '',
      country: row.country || 'Morocco',
      state: row.state || '',
      image_url: row.image_url || '',
      description: row.description || '',
    } : EMPTY)
    setModal(true)
  }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      editing
        ? await adminCities.update(editing.id, form)
        : await adminCities.create(form)
      setModal(false)
      load()
    } catch (err) {
      alert(err?.message || 'Error saving city')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this city? Properties linked to it will lose their city.')) return
    await adminCities.delete(id)
    load()
  }

  const cols = [
    {
      key: 'name', label: 'City',
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.image_url ? (
            <img src={r.image_url} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-[#C8A97E]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-gray-800">{r.name}</p>
            <p className="text-xs text-gray-400">{r.country || 'Morocco'}{r.state ? ` · ${r.state}` : ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'properties_count', label: 'Properties',
      render: (r) => (
        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
          <Building2 size={13} className="text-gray-400" />
          {r.properties_count ?? 0}
        </div>
      ),
    },
    {
      key: 'description', label: 'Description',
      render: (r) => <span className="text-xs text-gray-400 line-clamp-1 max-w-xs">{r.description || '—'}</span>,
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex gap-1 justify-end">
          <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
          <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Cities" subtitle={`${meta.total ?? rows.length} cities`}>
        <Btn variant="gold" onClick={() => open()}>
          <Plus size={15} /> Add City
        </Btn>
      </PageHeader>

      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> {error} You can still manage cities here once the backend endpoint is deployed.
        </div>
      )}

      <DataTable
        columns={cols}
        data={rows}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        page={page}
        lastPage={meta.last_page || 1}
        onPage={setPage}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit City' : 'Add City'} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="City Name" required>
            <Input value={form.name} onChange={f('name')} required placeholder="Casablanca" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Country">
              <Input value={form.country} onChange={f('country')} placeholder="Morocco" />
            </FormField>
            <FormField label="State / Region">
              <Input value={form.state} onChange={f('state')} placeholder="Grand Casablanca" />
            </FormField>
          </div>
          <FormField label="Cover Image URL" hint="Used on the Neighborhoods page">
            <Input value={form.image_url} onChange={f('image_url')} placeholder="https://images.unsplash.com/..." />
          </FormField>
          {form.image_url && (
            <div className="rounded-xl overflow-hidden aspect-video border border-gray-100">
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
          )}
          <FormField label="Description">
            <Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Brief description of the city..." />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
