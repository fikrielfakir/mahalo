import { useEffect, useState, useCallback, useRef } from 'react'
import { adminCities, adminSettings } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea } from '../components/Modal'
import ContentTranslationsModal from '../components/ContentTranslationsModal'
import { Plus, Pencil, Trash2, Globe, Building2, Download, Upload, CheckCircle, AlertCircle, X, Languages, ImagePlus, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY = { name: '', country: 'Morocco', state: '', image_url: '', description: '' }
const CSV_HEADERS = ['name', 'country', 'state', 'description', 'image_url']

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return { rows: [], error: 'CSV must have a header row and at least one data row.' }
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const nameIdx = headers.indexOf('name')
  if (nameIdx === -1) return { rows: [], error: 'CSV must have a "name" column.' }
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
    const row = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] || '' })
    if (row.name) rows.push(row)
  }
  return { rows, error: null }
}

function generateCSV(cities) {
  const header = CSV_HEADERS.join(',')
  const rows = cities.map(c =>
    CSV_HEADERS.map(h => {
      const v = c[h] || ''
      return v.includes(',') ? `"${v}"` : v
    }).join(',')
  )
  return [header, ...rows].join('\n')
}

export default function CitiesPage() {
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
  const [error, setError]     = useState(null)

  const [transModal, setTransModal] = useState(null)
  const [exporting, setExporting]     = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [importFile, setImportFile]   = useState(null)
  const [importRows, setImportRows]   = useState([])
  const [importError, setImportError] = useState(null)
  const [importing, setImporting]     = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileInputRef    = useRef()
  const imgInputRef     = useRef()

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
      name: row.name || '', country: row.country || 'Morocco',
      state: row.state || '', image_url: row.image_url || '', description: row.description || '',
    } : EMPTY)
    setModal(true)
  }
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleImageUpload = async (file) => {
    if (!file) return
    setUploadingImg(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const r = await adminSettings.uploadLogo(fd)
      const url = r.url || r.data?.url
      if (url) setForm(p => ({ ...p, image_url: url }))
    } catch { alert(t('admin.common.error')) } finally { setUploadingImg(false) }
  }

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      editing ? await adminCities.update(editing.id, form) : await adminCities.create(form)
      setModal(false); load()
    } catch (err) { alert(err?.message || t('admin.common.error')) } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm(t('admin.cities.confirmDelete'))) return
    await adminCities.delete(id); load()
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const all = []
      let p = 1
      while (true) {
        const r = await adminCities.list({ per_page: 200, page: p })
        const data = r.data || []
        all.push(...data)
        if (!r.meta?.last_page || p >= r.meta.last_page) break
        p++
      }
      const csv = generateCSV(all)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `mahalo-cities-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert(t('admin.cities.exportFailed')) } finally { setExporting(false) }
  }

  const downloadTemplate = () => {
    const sample = [
      CSV_HEADERS.join(','),
      'Casablanca,Morocco,Grand Casablanca-Settat,Economic capital of Morocco,https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
      'Marrakech,Morocco,Marrakech-Safi,The Red City — famous for its medina,,',
      'Rabat,Morocco,Rabat-Salé-Kénitra,Capital of Morocco,,',
    ].join('\n')
    const blob = new Blob([sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'cities-import-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFile(file); setImportError(null); setImportResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const { rows, error } = parseCSV(ev.target.result)
      if (error) { setImportError(error); setImportRows([]) } else setImportRows(rows)
    }
    reader.readAsText(file)
  }

  const openImport = () => {
    setImportFile(null); setImportRows([]); setImportError(null); setImportResult(null); setImportModal(true)
  }

  const runImport = async () => {
    if (!importRows.length) return
    setImporting(true)
    let created = 0, failed = 0, skipped = 0
    const errors = []
    for (const row of importRows) {
      try {
        await adminCities.create({ name: row.name || '', country: row.country || 'Morocco', state: row.state || '', description: row.description || '', image_url: row.image_url || '' })
        created++
      } catch (err) {
        const msg = err?.message || 'Unknown error'
        if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) { skipped++ }
        else { failed++; errors.push(`"${row.name}": ${msg}`) }
      }
    }
    setImportResult({ created, failed, skipped, errors }); setImporting(false); load()
  }

  const cols = [
    {
      key: 'name', label: t('admin.cities.colCity'),
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.image_url ? (
            <img src={r.image_url} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#BA1932]/10 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-[#BA1932]" />
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
      key: 'properties_count', label: t('admin.cities.colProperties'),
      render: (r) => (
        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
          <Building2 size={13} className="text-gray-400" /> {r.properties_count ?? 0}
        </div>
      ),
    },
    {
      key: 'description', label: t('admin.cities.colDescription'),
      render: (r) => <span className="text-xs text-gray-400 line-clamp-1 max-w-xs">{r.description || '—'}</span>,
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex gap-1 justify-end">
          <Btn size="sm" variant="ghost" onClick={() => setTransModal(r)} title="Translations"><Languages size={13} className="text-blue-500" /></Btn>
          <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
          <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('admin.cities.title')} subtitle={`${meta.total ?? rows.length} ${t('admin.cities.citiesLabel')}`}>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={handleExport} disabled={exporting}>
            <Download size={14} /> {exporting ? t('admin.cities.exporting') : t('admin.cities.exportCsv')}
          </Btn>
          <Btn variant="ghost" onClick={openImport}>
            <Upload size={14} /> {t('admin.cities.importCsv')}
          </Btn>
          <Btn variant="gold" onClick={() => open()}>
            <Plus size={15} /> {t('admin.cities.addCity')}
          </Btn>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> {error}
        </div>
      )}

      <DataTable columns={cols} data={rows} loading={loading} search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }} page={page} lastPage={meta.last_page || 1} onPage={setPage} />

      <ContentTranslationsModal open={!!transModal} onClose={() => setTransModal(null)} type="city" item={transModal} />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('admin.cities.editCity') : t('admin.cities.addCity')} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label={t('admin.cities.nameLabel')} required>
            <Input value={form.name} onChange={f('name')} required placeholder={t('admin.cities.namePlaceholder')} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('admin.cities.countryLabel')}>
              <Input value={form.country} onChange={f('country')} placeholder={t('admin.cities.countryPlaceholder')} />
            </FormField>
            <FormField label={t('admin.cities.stateLabel')}>
              <Input value={form.state} onChange={f('state')} placeholder={t('admin.cities.statePlaceholder')} />
            </FormField>
          </div>
          <FormField label={t('admin.cities.imageUrlLabel')} hint={t('admin.cities.imageUrlHint')}>
            {/* Upload zone */}
            <div
              className={`relative flex items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors mb-2
                ${uploadingImg ? 'border-[#BA1932]/30 bg-[#BA1932]/5' : 'border-gray-200 hover:border-[#BA1932]/50 hover:bg-[#BA1932]/5'}`}
              onClick={() => !uploadingImg && imgInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleImageUpload(f) }}
            >
              {uploadingImg ? (
                <Loader2 size={18} className="animate-spin text-[#BA1932]" />
              ) : (
                <ImagePlus size={18} className="text-gray-400 shrink-0" />
              )}
              <span className="text-sm text-gray-500">
                {uploadingImg ? t('admin.common.uploading') || 'Uploading…' : t('admin.cities.uploadOrDrag') || 'Click to upload or drag & drop an image'}
              </span>
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = '' }}
              />
            </div>
            {/* URL fallback */}
            <div className="flex gap-2 items-center">
              <Input value={form.image_url} onChange={f('image_url')} placeholder="https://images.unsplash.com/..." />
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                  className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Clear image"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </FormField>
          {form.image_url && (
            <div className="rounded-xl overflow-hidden aspect-video border border-gray-100">
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
          )}
          <FormField label={t('admin.cities.descLabel')}>
            <Textarea value={form.description} onChange={f('description')} rows={2} placeholder={t('admin.cities.descPlaceholder')} />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? t('admin.common.saving') : editing ? t('admin.common.update') : t('admin.common.create')}</Btn>
          </div>
        </form>
      </Modal>

      {importModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800 text-base">{t('admin.cities.importTitle')}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{t('admin.cities.importSubtitle')}</p>
              </div>
              <button onClick={() => setImportModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{t('admin.cities.downloadTemplate')}</p>
                  <p className="text-xs text-gray-400">{t('admin.cities.downloadTemplateHint')}</p>
                </div>
                <Btn size="sm" variant="ghost" onClick={downloadTemplate}>
                  <Download size={13} /> {t('admin.cities.templateBtn')}
                </Btn>
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-[#BA1932]/40 rounded-xl px-4 py-6 text-center cursor-pointer transition-colors"
              >
                <Upload size={22} className="mx-auto mb-2 text-gray-300" />
                {importFile
                  ? <p className="text-sm font-semibold text-gray-700">{importFile.name}</p>
                  : <p className="text-sm text-gray-400">{t('admin.cities.clickToSelect')}</p>}
                <p className="text-xs text-gray-300 mt-1">Columns: name, country, state, description, image_url</p>
                <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              </div>
              {importError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertCircle size={14} className="shrink-0" /> {importError}
                </div>
              )}
              {importRows.length > 0 && !importResult && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">{importRows.length} {t('admin.cities.citiesFound')}</p>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                    {importRows.slice(0, 8).map((r, i) => (
                      <div key={i} className="px-3 py-2 flex items-center gap-2">
                        <Globe size={12} className="text-gray-300 shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{r.name}</span>
                        {r.state && <span className="text-xs text-gray-400">· {r.state}</span>}
                      </div>
                    ))}
                    {importRows.length > 8 && (
                      <div className="px-3 py-2 text-xs text-gray-400">…{t('admin.cities.andMore', { count: importRows.length - 8 })}</div>
                    )}
                  </div>
                </div>
              )}
              {importResult && (
                <div className="rounded-xl border border-gray-100 px-4 py-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <CheckCircle size={15} /> {t('admin.cities.importComplete')}
                  </div>
                  <p className="text-xs text-gray-600">{importResult.created} {t('admin.cities.created')} · {importResult.skipped} {t('admin.cities.skipped')} · {importResult.failed} {t('admin.cities.failed')}</p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {importResult.errors.map((e, i) => <p key={i} className="text-xs text-red-500">{e}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-2 justify-end border-t border-gray-100 pt-4">
              <Btn variant="ghost" onClick={() => setImportModal(false)}>
                {importResult ? t('admin.common.close') : t('admin.common.cancel')}
              </Btn>
              {!importResult && (
                <Btn variant="gold" disabled={!importRows.length || importing} onClick={runImport}>
                  <Upload size={14} />
                  {importing ? t('admin.cities.importingCities') : t('admin.cities.importCount', { count: importRows.length })}
                </Btn>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
