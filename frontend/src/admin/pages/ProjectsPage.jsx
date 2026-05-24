import { useEffect, useState, useCallback } from 'react'
import { adminProjects, adminInvestors, publicApi } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import ImageUploader from '../components/ImageUploader'
import LocationPicker from '../../components/LocationPicker'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import { Plus, Pencil, Trash2, FolderKanban, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY = {
  name: '', description: '', content: '', location: '', images: [],
  investor_id: '', city_id: '', price_from: '', price_to: '',
  is_featured: false, status: 'selling',
  latitude: '', longitude: '',
}

export default function ProjectsPage() {
  const { t } = useTranslation()
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
  const [transModal, setTransModal] = useState(null)

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
    setForm({
      ...row,
      images:    Array.isArray(row.images) ? row.images : [],
      latitude:  row.latitude  || '',
      longitude: row.longitude || '',
    })
    setModal(true)
  }
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target?.value ?? e }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        ...form,
        images:      form.images,
        price_from:  form.price_from  || null,
        price_to:    form.price_to    || null,
        city_id:     form.city_id     || null,
        investor_id: form.investor_id || null,
        latitude:    form.latitude    || null,
        longitude:   form.longitude   || null,
      }
      editing ? await adminProjects.update(editing.id, payload) : await adminProjects.create(payload)
      setModal(false); load()
    } catch (err) { alert(err?.message || t('admin.common.error')) } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm(t('admin.projects.confirmDelete'))) return
    await adminProjects.delete(id); load()
  }

  const cols = [
    { key: 'name', label: t('admin.projects.colProject'), render: (r) => (
      <div className="flex items-center gap-2">
        {r.images?.[0] ? (
          <img src={`/storage/${r.images[0]}`} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" onError={(e) => { e.target.style.display='none' }} />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#730D26]/5 flex items-center justify-center">
            <FolderKanban size={14} className="text-[#730D26]/40" />
          </div>
        )}
        <div>
          <p className="font-medium text-sm text-gray-800">{r.name}</p>
          <p className="text-xs text-gray-400">{r.city?.name || '—'}</p>
        </div>
      </div>
    )},
    { key: 'investor',   label: t('admin.projects.colInvestor'),  render: (r) => r.investor?.name || '—' },
    { key: 'price_from', label: t('admin.projects.colPriceFrom'), render: (r) => r.price_from ? `${Number(r.price_from).toLocaleString()} MAD` : '—' },
    { key: 'is_featured',label: t('admin.projects.colFeatured'),  render: (r) => <Badge color={r.is_featured ? 'gold' : 'gray'}>{r.is_featured ? t('admin.common.yes') : t('admin.common.no')}</Badge> },
    { key: 'status',     label: t('admin.projects.colStatus'),    render: (r) => <Badge color={r.status === 'selling' ? 'green' : 'gray'}>{r.status}</Badge> },
    { key: 'coords',     label: t('admin.projects.colMap'),       render: (r) => r.latitude && r.longitude
      ? <span className="text-xs text-emerald-500 font-semibold">✓ {t('admin.projects.located')}</span>
      : <span className="text-xs text-gray-300">{t('admin.projects.noLocation')}</span>
    },
    { key: 'actions', label: '', render: (r) => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={13} className="text-blue-500" /></Btn>
        <Btn size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Btn>
        <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title={t('admin.projects.title')} subtitle={`${meta.total ?? 0} ${t('admin.common.total')}`}>
        <Btn variant="gold" onClick={openCreate}><Plus size={15} /> {t('admin.projects.addProject')}</Btn>
      </PageHeader>
      <DataTable columns={cols} data={rows} loading={loading} search={search} onSearch={(v) => { setSearch(v); setPage(1) }} page={page} lastPage={meta.last_page || 1} onPage={setPage} />

      <ContentTranslationsModal
        open={!!transModal}
        onClose={() => setTransModal(null)}
        type="project"
        item={transModal}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('admin.projects.editProject') : t('admin.projects.addProject')} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <FormField label={t('admin.projects.nameLabel')} required>
            <Input value={form.name} onChange={f('name')} required placeholder={t('admin.projects.namePlaceholder')} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('admin.projects.investorLabel')}>
              <Select value={form.investor_id} onChange={f('investor_id')}>
                <option value="">{t('admin.projects.selectInvestor')}</option>
                {investors.map((inv) => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
              </Select>
            </FormField>
            <FormField label={t('admin.projects.cityLabel')}>
              <Select value={form.city_id} onChange={f('city_id')}>
                <option value="">{t('admin.projects.selectCity')}</option>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label={t('admin.projects.priceFromLabel')}>
              <Input type="number" value={form.price_from} onChange={f('price_from')} placeholder="1500000" />
            </FormField>
            <FormField label={t('admin.projects.priceToLabel')}>
              <Input type="number" value={form.price_to} onChange={f('price_to')} placeholder="5000000" />
            </FormField>
            <FormField label={t('admin.projects.statusLabel')}>
              <Select value={form.status} onChange={f('status')}>
                <option value="selling">{t('admin.projects.statusSelling')}</option>
                <option value="pending">{t('admin.projects.statusPending')}</option>
                <option value="completed">{t('admin.projects.statusCompleted')}</option>
              </Select>
            </FormField>
          </div>
          <FormField label={t('admin.projects.addressLabel')}>
            <Input value={form.location} onChange={f('location')} placeholder={t('admin.projects.addressPlaceholder')} />
          </FormField>

          <FormField label={t('admin.projects.mapLabel')} hint={t('admin.projects.mapHint')}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input type="number" step="any" value={form.latitude} onChange={f('latitude')} placeholder="Latitude (e.g. 33.5731)" />
              <Input type="number" step="any" value={form.longitude} onChange={f('longitude')} placeholder="Longitude (e.g. -7.5898)" />
            </div>
            {modal && (
              <LocationPicker
                lat={form.latitude}
                lng={form.longitude}
                onChange={({ lat, lng }) => setForm(p => ({ ...p, latitude: lat, longitude: lng }))}
                height={260}
              />
            )}
          </FormField>

          <FormField label={t('admin.projects.descLabel')}>
            <Textarea value={form.description} onChange={f('description')} rows={2} placeholder={t('admin.projects.descPlaceholder')} />
          </FormField>

          <FormField label={t('admin.projects.imagesLabel')} hint={t('admin.projects.imagesHint')}>
            <ImageUploader
              images={form.images}
              onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
              folder="projects"
              allowVideo
            />
          </FormField>

          <Toggle checked={form.is_featured} onChange={(v) => setForm(p => ({ ...p, is_featured: v }))} label={t('admin.projects.featuredLabel')} />
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? t('admin.common.saving') : editing ? t('admin.common.update') : t('admin.common.create')}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
