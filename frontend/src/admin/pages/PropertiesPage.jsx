import { useEffect, useState, useCallback } from 'react'
import { adminProperties, adminCategories, adminFeatures, adminAgents, adminCities } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import ImageUploader from '../components/ImageUploader'
import LocationPicker from '../../components/LocationPicker'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import { Plus, Pencil, Trash2, Building2, Star, CheckCircle, XCircle, Clock, Link as LinkIcon, Languages, Sparkles } from 'lucide-react'
import AiDescriptionGenerator from '../components/AiDescriptionGenerator'

const EMPTY = {
  name: '', type: 'sale', description: '', content: '', location: '',
  images: [], price: '', number_bedroom: '', number_bathroom: '',
  number_floor: '', square: '', city_id: '', agent_id: '', status: 'selling',
  is_featured: false, latitude: '', longitude: '',
  category_ids: [], feature_ids: [],
  condition: '', age_range: '', orientation: '', flooring: '',
  slug: '',
}

const MOD_TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const CONDITION_OPTIONS = [
  { value: '', label: 'Select condition' },
  { value: 'New development', label: 'New development' },
  { value: 'Resale', label: 'Resale' },
  { value: 'Off-plan', label: 'Off-plan' },
  { value: 'Under construction', label: 'Under construction' },
  { value: 'Renovated', label: 'Renovated' },
]

const AGE_OPTIONS = [
  { value: '', label: 'Select age' },
  { value: 'Less than 1 year', label: 'Less than 1 year' },
  { value: '1-5 years', label: '1-5 years' },
  { value: '5-10 years', label: '5-10 years' },
  { value: '10-20 years', label: '10-20 years' },
  { value: 'Over 20 years', label: 'Over 20 years' },
]

const ORIENTATION_OPTIONS = [
  { value: '', label: 'Select orientation' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'East', label: 'East' },
  { value: 'West', label: 'West' },
  { value: 'Northeast', label: 'Northeast' },
  { value: 'Northwest', label: 'Northwest' },
  { value: 'Southeast', label: 'Southeast' },
  { value: 'Southwest', label: 'Southwest' },
]

const FLOORING_OPTIONS = [
  { value: '', label: 'Select flooring' },
  { value: 'Marble', label: 'Marble' },
  { value: 'Wood', label: 'Wood' },
  { value: 'Parquet', label: 'Parquet' },
  { value: 'Tiles', label: 'Tiles' },
  { value: 'Ceramic', label: 'Ceramic' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Laminate', label: 'Laminate' },
  { value: 'Other', label: 'Other' },
]

function slugify(str) {
  return str.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-')
}

function statusColor(s) {
  return s === 'selling' || s === 'renting' ? 'green' : s === 'sold' ? 'blue' : s === 'rented' ? 'gold' : 'gray'
}

function modColor(s) {
  return s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold'
}

function ModIcon({ status }) {
  if (status === 'approved') return <CheckCircle size={14} className="text-emerald-500" />
  if (status === 'rejected') return <XCircle size={14} className="text-red-400" />
  return <Clock size={14} className="text-amber-400" />
}

export default function PropertiesPage() {
  const [rows, setRows]       = useState([])
  const [meta, setMeta]       = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [modTab, setModTab]   = useState('')
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [cities, setCities]   = useState([])
  const [agents, setAgents]   = useState([])
  const [categories, setCategories] = useState([])
  const [features, setFeatures]     = useState([])
  const [deleting, setDeleting]     = useState(null)
  const [moderating, setModerating] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [transModal, setTransModal] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = { search, page, per_page: 12 }
    if (modTab) params.moderation_status = modTab
    adminProperties.list(params)
      .then((r) => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page, modTab])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    adminCities.list({ per_page: 500 }).then((r) => setCities(r.data || []))
    adminCategories.list().then((r) => setCategories(r.data || []))
    adminFeatures.list().then((r) => setFeatures(r.data || []))
    adminAgents.list({ per_page: 200 }).then((r) => setAgents(r.data || []))
  }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setSlugManual(false); setModal(true) }
  const openEdit   = (row) => {
    setEditing(row)
    setSlugManual(false)
    setForm({
      ...row,
      images:       Array.isArray(row.images) ? row.images : [],
      category_ids: row.category_ids || (row.categories?.map(c => c.id)) || [],
      feature_ids:  row.feature_ids  || (row.features?.map(f => f.id))  || [],
      latitude:     row.latitude  || '',
      longitude:    row.longitude || '',
      agent_id:     row.agent_id  || '',
      condition:    row.condition    || '',
      age_range:    row.age_range    || '',
      orientation:  row.orientation  || '',
      flooring:     row.flooring     || '',
      slug:         row.slug         || '',
    })
    setModal(true)
  }

  const f = (k) => (e) => {
    const val = e.target?.value ?? e
    setForm((p) => {
      const next = { ...p, [k]: val }
      if (k === 'name' && !slugManual && !editing) {
        next.slug = slugify(val)
      }
      return next
    })
  }

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
        latitude:        form.latitude        || null,
        longitude:       form.longitude       || null,
        condition:       form.condition       || null,
        age_range:       form.age_range       || null,
        orientation:     form.orientation     || null,
        flooring:        form.flooring        || null,
        slug:            form.slug            || null,
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

  const moderate = async (id, status, reason = '') => {
    setModerating(id)
    try {
      await adminProperties.moderate(id, { moderation_status: status, reject_reason: reason || undefined })
      load()
    } catch (err) {
      alert(err?.message || 'Error updating status')
    } finally {
      setModerating(null)
    }
  }

  const openReject = (row) => { setRejectModal(row); setRejectReason('') }
  const submitReject = async () => {
    await moderate(rejectModal.id, 'rejected', rejectReason)
    setRejectModal(null)
  }

  const pendingCount = modTab === 'pending' ? meta.total : undefined

  const cols = [
    { key: 'name', label: 'Property', render: (r) => (
      <div className="flex items-center gap-2">
        {(() => {
          const firstImg = r.images?.[0]
          const isVid = firstImg && /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(firstImg)
          const src = isVid
            ? (r.video_thumbnails?.[firstImg] || r.thumbnail_url || null)
            : r.thumbnail_url || (firstImg ? (firstImg.startsWith('http') ? firstImg : `/storage/${firstImg}`) : null)
          return src ? (
            <img src={src} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" onError={(e) => { e.target.style.display='none' }} />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#730D26]/5 flex items-center justify-center shrink-0">
              <Building2 size={14} className="text-[#730D26]/40" />
            </div>
          )
        })()}
        <div>
          <p className="font-medium text-gray-800 text-sm">{r.name}</p>
          <p className="text-xs text-gray-400">{r.city?.name || '—'}</p>
        </div>
      </div>
    )},
    { key: 'slug', label: 'Slug', render: (r) => r.slug ? (
      <span className="text-xs font-mono text-gray-500 truncate max-w-[120px] block">{r.slug}</span>
    ) : <span className="text-xs text-gray-300">—</span> },
    { key: 'agent',      label: 'Agent',      render: (r) => r.agent ? (
      <span className="text-xs font-medium text-gray-700">{r.agent.name}</span>
    ) : <span className="text-xs text-gray-300">—</span> },
    { key: 'type',       label: 'Type',       render: (r) => <Badge color={r.type === 'sale' ? 'blue' : 'gold'}>{r.type}</Badge> },
    { key: 'price',      label: 'Price',      render: (r) => r.price ? `${Number(r.price).toLocaleString()} MAD` : '—' },
    { key: 'is_featured',label: 'Featured',   render: (r) => r.is_featured ? <Star size={14} className="text-amber-400 fill-amber-400" /> : <Star size={14} className="text-gray-200" /> },
    { key: 'status',     label: 'Status',     render: (r) => <Badge color={statusColor(r.status)}>{r.status}</Badge> },
    { key: 'moderation', label: 'Review',     render: (r) => (
      <div className="flex items-center gap-1.5">
        <ModIcon status={r.moderation_status} />
        <Badge color={modColor(r.moderation_status)}>{r.moderation_status || 'pending'}</Badge>
      </div>
    )},
    { key: 'actions', label: '', render: (r) => (
      <div className="flex gap-1 justify-end items-center">
        {r.moderation_status === 'pending' && (
          <>
            <Btn size="sm" variant="ghost"
              disabled={moderating === r.id}
              onClick={() => moderate(r.id, 'approved')}
              title="Approve"
              className="text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle size={13} />
            </Btn>
            <Btn size="sm" variant="ghost"
              disabled={moderating === r.id}
              onClick={() => openReject(r)}
              title="Reject"
              className="text-red-500 hover:bg-red-50"
            >
              <XCircle size={13} />
            </Btn>
          </>
        )}
        {r.moderation_status === 'rejected' && (
          <Btn size="sm" variant="ghost"
            disabled={moderating === r.id}
            onClick={() => moderate(r.id, 'approved')}
            title="Approve"
            className="text-emerald-600 hover:bg-emerald-50"
          >
            <CheckCircle size={13} />
          </Btn>
        )}
        {r.moderation_status === 'approved' && (
          <Btn size="sm" variant="ghost"
            disabled={moderating === r.id}
            onClick={() => openReject(r)}
            title="Revoke approval"
            className="text-red-500 hover:bg-red-50"
          >
            <XCircle size={13} />
          </Btn>
        )}
        <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={13} className="text-blue-500" /></Btn>
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

      {/* Moderation tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-2xl w-fit">
        {MOD_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setModTab(t.key); setPage(1) }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              modTab === t.key
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy/50 hover:text-navy'
            }`}
          >
            {t.label}
            {t.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <ContentTranslationsModal
        open={!!transModal}
        onClose={() => setTransModal(null)}
        type="property"
        item={transModal}
      />

      <DataTable
        columns={cols} data={rows} loading={loading}
        search={search} onSearch={(v) => { setSearch(v); setPage(1) }}
        page={page} lastPage={meta.last_page || 1} onPage={setPage}
      />

      {/* Reject reason modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-navy mb-1">Reject Listing</h3>
            <p className="text-sm text-navy/50 mb-4">Optionally provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Missing price information, unclear photos..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-navy resize-none focus:outline-none focus:border-red-300"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <Btn variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={submitReject} disabled={moderating === rejectModal?.id}>
                {moderating === rejectModal?.id ? 'Rejecting…' : 'Reject Listing'}
              </Btn>
            </div>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Property' : 'Add Property'} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Property Name" required>
                <Input value={form.name} onChange={f('name')} placeholder="Villa with Pool — Ain Diab" required />
              </FormField>
            </div>

            {/* SEO Slug */}
            <div className="col-span-2">
              <FormField label="SEO Slug" hint="Auto-generated from name — edit to customise the URL">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#730D26]/40 focus-within:bg-white transition-all">
                    <LinkIcon size={13} className="text-gray-400 shrink-0" />
                    <span className="text-gray-400 text-xs shrink-0">/properties/</span>
                    <input
                      value={form.slug}
                      onChange={(e) => { setSlugManual(true); setForm(p => ({ ...p, slug: e.target.value })) }}
                      placeholder={editing ? 'property-slug' : 'auto-generated'}
                      className="flex-1 bg-transparent text-sm text-navy outline-none font-mono min-w-0"
                    />
                  </div>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => { setSlugManual(false); setForm(p => ({ ...p, slug: slugify(p.name) })) }}
                      className="text-xs text-[#730D26] hover:underline shrink-0"
                    >
                      Reset
                    </button>
                  )}
                </div>
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
            <FormField label="Agent">
              <Select value={form.agent_id} onChange={f('agent_id')}>
                <option value="">No agent</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
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

            {/* General Characteristics */}
            <FormField label="Condition">
              <Select value={form.condition} onChange={f('condition')}>
                {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Age">
              <Select value={form.age_range} onChange={f('age_range')}>
                {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Orientation">
              <Select value={form.orientation} onChange={f('orientation')}>
                {ORIENTATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Flooring">
              <Select value={form.flooring} onChange={f('flooring')}>
                {FLOORING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </FormField>

            <div className="col-span-2">
              <FormField label="Address / Location">
                <Input value={form.location} onChange={f('location')} placeholder="Ain Diab, Casablanca" />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Map Location" hint="Click on the map to place a pin — drag to adjust">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input type="number" step="any" value={form.latitude} onChange={f('latitude')} placeholder="Latitude (e.g. 33.5731)" />
                  <Input type="number" step="any" value={form.longitude} onChange={f('longitude')} placeholder="Longitude (e.g. -7.5898)" />
                </div>
                {modal && (
                  <LocationPicker
                    lat={form.latitude} lng={form.longitude}
                    onChange={({ lat, lng }) => setForm(p => ({ ...p, latitude: lat, longitude: lng }))}
                    height={260}
                  />
                )}
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Description">
                <Textarea value={form.description} onChange={f('description')} rows={2} placeholder="Short description..." />
              </FormField>
              <div className="mt-2">
                <AiDescriptionGenerator
                  form={form}
                  onInsert={(text) => setForm(p => ({ ...p, description: text }))}
                />
              </div>
            </div>

            <div className="col-span-2">
              <FormField label="Images & Videos" hint="Upload files or add URLs — first image is the main photo. Videos will be watermarked.">
                <ImageUploader images={form.images} onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))} folder="properties" allowVideo />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Categories">
                <div className="flex flex-wrap gap-2 mt-1">
                  {categories.map((c) => (
                    <button key={c.id} type="button"
                      onClick={() => toggleArr('category_ids', c.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${form.category_ids.includes(c.id) ? 'bg-[#730D26] text-white border-[#730D26]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#730D26]'}`}
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
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${form.feature_ids.includes(feat.id) ? 'bg-[#BA1932] text-white border-[#BA1932]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#BA1932]'}`}
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
