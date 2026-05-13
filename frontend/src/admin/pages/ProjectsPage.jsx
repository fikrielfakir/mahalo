import { useEffect, useState, useCallback } from 'react'
import { adminProjects, adminInvestors, publicApi } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import ImageUploader from '../components/ImageUploader'
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react'

const EMPTY = {
  name: '', description: '', content: '', location: '', images: [],
  investor_id: '', city_id: '', price_from: '', price_to: '',
  is_featured: false, status: 'selling',
}

export default function ProjectsPage() {
  const [rows, setRows]       = useState([])
  const [meta, setMeta]       = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [cities, setCities]   = useState([])
  const [investors, setInvestors] = useState([])

  const load = useCallback(() => {
    setLoading(true)
    adminProjects.list({ search, page, per_page: 12 })
      .then((r) => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    publicApi.cities().then((r) => setCities(r.data?.cities || []))
    adminInvestors.list().then((r) => setInvestors(r.data || []))
  }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (row) => {
    setEditing(row)
    setForm({ ...row, images: Array.isArray(row.images) ? row.images : [] })
    setModal(true)
  }
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target?.value ?? e }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        ...form,
        images:     form.images,
        price_from: form.price_from  || null,
        price_to:   form.price_to    || null,
        city_id:    form.city_id     || null,
        investor_id:form.investor_id || null,
      }
      editing ? await adminProjects.update(editing.id, payload) : await adminProjects.create(payload)
      setModal(false); load()
    } catch (err) { alert(err?.message || 'Error') } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await adminProjects.delete(id); load()
  }

  const cols = [
    { key: 'name', label: 'Project', render: (r) => (
      <div className="flex items-center gap-2">
        {r.images?.[0] ? (
          <img src={`/storage/${r.images[0]}`} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" onError={(e) => { e.target.style.display='none' }} />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#1A1A1A]/5 flex items-center justify-center">
            <FolderKanban size={14} className="text-[#1A1A1A]/40" />
          </div>
        )}
        <div>
          <p className="font-medium text-sm text-gray-800">{r.name}</p>
          <p className="text-xs text-gray-400">{r.city?.name || '—'}</p>
        </div>
      </div>
    )},
    { key: 'investor',   label: 'Investor',    render: (r) => r.investor?.name || '—' },
    { key: 'price_from', label: 'Price From',  render: (r) => r.price_from ? `${Number(r.price_from).toLocaleString()} MAD` : '—' },
    { key: 'is_featured',label: 'Featured',    render: (r) => <Badge color={r.is_featured ? 'gold' : 'gray'}>{r.is_featured ? 'Yes' : 'No'}</Badge> },
    { key: 'status',     label: 'Status',      render: (r) => <Badge color={r.status === 'selling' ? 'green' : 'gray'}>{r.status}</Badge> },
    { key: 'actions',    label: '',            render: (r) => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Btn>
        <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Projects" subtitle={`${meta.total ?? 0} total`}>
        <Btn variant="gold" onClick={openCreate}><Plus size={15} /> Add Project</Btn>
      </PageHeader>
      <DataTable columns={cols} data={rows} loading={loading} search={search} onSearch={(v) => { setSearch(v); setPage(1) }} page={page} lastPage={meta.last_page || 1} onPage={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Project Name" required>
            <Input value={form.name} onChange={f('name')} required placeholder="The View Anfa" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Investor">
              <Select value={form.investor_id} onChange={f('investor_id')}>
                <option value="">Select investor</option>
                {investors.map((inv) => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
              </Select>
            </FormField>
            <FormField label="City">
              <Select value={form.city_id} onChange={f('city_id')}>
                <option value="">Select city</option>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Price From (MAD)">
              <Input type="number" value={form.price_from} onChange={f('price_from')} placeholder="1500000" />
            </FormField>
            <FormField label="Price To (MAD)">
              <Input type="number" value={form.price_to} onChange={f('price_to')} placeholder="5000000" />
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={f('status')}>
                <option value="selling">Selling</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Location">
            <Input value={form.location} onChange={f('location')} placeholder="Anfa, Casablanca" />
          </FormField>
          <FormField label="Description">
            <Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Short description..." />
          </FormField>

          <FormField label="Images" hint="Upload files or add URLs — first image is the main photo">
            <ImageUploader
              images={form.images}
              onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
              folder="projects"
            />
          </FormField>

          <Toggle checked={form.is_featured} onChange={(v) => setForm(p => ({ ...p, is_featured: v }))} label="Featured project" />
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
