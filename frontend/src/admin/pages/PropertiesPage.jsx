import { useEffect, useState, useCallback } from 'react'
import { adminProperties, adminCategories, adminFeatures, publicApi } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import ImageUploader from '../components/ImageUploader'
import { Plus, Pencil, Trash2, Building2, Star } from 'lucide-react'

const EMPTY = {
  name: '', type: 'sale', description: '', content: '', location: '',
  images: [], price: '', number_bedroom: '', number_bathroom: '',
  number_floor: '', square: '', city_id: '', status: 'selling',
  is_featured: false, latitude: '', longitude: '',
  category_ids: [], feature_ids: [],
}

function statusColor(s) {
  return s === 'selling' ? 'green' : s === 'sold' ? 'blue' : s === 'rented' ? 'gold' : 'gray'
}

export default function PropertiesPage() {
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
  const [categories, setCategories] = useState([])
  const [features, setFeatures]     = useState([])
  const [deleting, setDeleting]     = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminProperties.list({ search, page, per_page: 12 })
      .then((r) => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    publicApi.cities().then((r) => setCities(r.data?.cities || []))
    adminCategories.list().then((r) => setCategories(r.data || []))
    adminFeatures.list().then((r) => setFeatures(r.data || []))
  }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (row) => {
    setEditing(row)
    setForm({
      ...row,
      images:       Array.isArray(row.images) ? row.images : [],
      category_ids: row.category_ids || (row.categories?.map(c => c.id)) || [],
      feature_ids:  row.feature_ids  || (row.features?.map(f => f.id))  || [],
    })
    setModal(true)
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target?.value ?? e }))

  const toggleArr = (key, id) => {
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id],
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        images:          form.images,
        price:           form.price           ? parseFloat(form.price)           : null,
        number_bedroom:  form.number_bedroom  ? parseFloat(form.number_bedroom)  : 0,
        number_bathroom: form.number_bathroom ? parseFloat(form.number_bathroom) : 0,
        square:          form.square          ? parseFloat(form.square)          : null,
        city_id:         form.city_id         || null,
      }
      if (editing) await adminProperties.update(editing.id, payload)
      else await adminProperties.create(payload)
      setModal(false)
      load()
    } catch (err) {
      alert(err?.message || 'Error saving property')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this property?')) return
    setDeleting(id)
    try { await adminProperties.delete(id); load() }
    finally { setDeleting(null) }
  }

  const cols = [
    { key: 'name', label: 'Property', render: (r) => (
      <div className="flex items-center gap-2">
        {r.images?.[0] ? (
          <img src={`/storage/${r.images[0]}`} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" onError={(e) => { e.target.style.display='none' }} />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#1A1A1A]/5 flex items-center justify-center shrink-0">
            <Building2 size={14} className="text-[#1A1A1A]/40" />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-800 text-sm">{r.name}</p>
          <p className="text-xs text-gray-400">{r.city?.name || '—'}</p>
        </div>
      </div>
    )},
    { key: 'type',       label: 'Type',    render: (r) => <Badge color={r.type === 'sale' ? 'blue' : 'gold'}>{r.type}</Badge> },
    { key: 'price',      label: 'Price',   render: (r) => r.price ? `${Number(r.price).toLocaleString()} MAD` : '—' },
    { key: 'is_featured',label: 'Featured',render: (r) => r.is_featured ? <Star size={14} className="text-amber-400 fill-amber-400" /> : <Star size={14} className="text-gray-200" /> },
    { key: 'status',     label: 'Status',  render: (r) => <Badge color={statusColor(r.status)}>{r.status}</Badge> },
    { key: 'actions',    label: '',        render: (r) => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Btn>
        <Btn size="sm" variant="danger" disabled={deleting === r.id} onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Properties" subtitle={`${meta.total ?? 0} total`}>
        <Btn variant="gold" onClick={openCreate}><Plus size={15} /> Add Property</Btn>
      </PageHeader>

      <DataTable
        columns={cols} data={rows} loading={loading}
        search={search} onSearch={(v) => { setSearch(v); setPage(1) }}
        page={page} lastPage={meta.last_page || 1} onPage={setPage}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Property' : 'Add Property'} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Property Name" required>
                <Input value={form.name} onChange={f('name')} placeholder="Villa with Pool — Ain Diab" required />
              </FormField>
            </div>
            <FormField label="Type" required>
              <Select value={form.type} onChange={f('type')}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={form.status} onChange={f('status')}>
                <option value="selling">Selling</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </Select>
            </FormField>
            <FormField label="Price (MAD)">
              <Input type="number" value={form.price} onChange={f('price')} placeholder="3800000" />
            </FormField>
            <FormField label="City">
              <Select value={form.city_id} onChange={f('city_id')}>
                <option value="">Select city</option>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Bedrooms">
              <Input type="number" value={form.number_bedroom} onChange={f('number_bedroom')} placeholder="3" />
            </FormField>
            <FormField label="Bathrooms">
              <Input type="number" value={form.number_bathroom} onChange={f('number_bathroom')} placeholder="2" />
            </FormField>
            <FormField label="Area (m²)">
              <Input type="number" value={form.square} onChange={f('square')} placeholder="150" />
            </FormField>
            <FormField label="Floors">
              <Input type="number" value={form.number_floor} onChange={f('number_floor')} placeholder="2" />
            </FormField>
            <div className="col-span-2">
              <FormField label="Location">
                <Input value={form.location} onChange={f('location')} placeholder="Ain Diab, Casablanca" />
              </FormField>
            </div>
            <div className="col-span-2">
              <FormField label="Description">
                <Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Short description..." />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Images" hint="Upload files or add URLs — first image is the main photo">
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
                  folder="properties"
                />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Categories">
                <div className="flex flex-wrap gap-2 mt-1">
                  {categories.map((c) => (
                    <button key={c.id} type="button"
                      onClick={() => toggleArr('category_ids', c.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${form.category_ids.includes(c.id) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A1A1A]'}`}
                    >{c.name}</button>
                  ))}
                </div>
              </FormField>
            </div>
            <div className="col-span-2">
              <FormField label="Features">
                <div className="flex flex-wrap gap-2 mt-1">
                  {features.map((feat) => (
                    <button key={feat.id} type="button"
                      onClick={() => toggleArr('feature_ids', feat.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${form.feature_ids.includes(feat.id) ? 'bg-[#9B1232] text-white border-[#9B1232]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#9B1232]'}`}
                    >{feat.name}</button>
                  ))}
                </div>
              </FormField>
            </div>
            <div className="col-span-2 flex items-center gap-6">
              <Toggle checked={form.is_featured} onChange={(v) => setForm((p) => ({ ...p, is_featured: v }))} label="Featured property" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Property' : 'Create Property'}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
