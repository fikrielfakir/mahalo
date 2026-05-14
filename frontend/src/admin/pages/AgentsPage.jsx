import { useEffect, useState, useCallback } from 'react'
import { adminAgents, adminProfessionalApplications, publicApi } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import { Plus, Pencil, Trash2, BadgeCheck, Users, ClipboardList, Check, X } from 'lucide-react'

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', whatsapp: '', description: '', city_id: '', is_featured: false, is_verified: false }

export default function AgentsPage() {
  const [view, setView] = useState('agents')

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

  const [apps, setApps]           = useState([])
  const [appsMeta, setAppsMeta]   = useState({})
  const [appsLoading, setAppsLoading] = useState(false)
  const [appsPage, setAppsPage]   = useState(1)
  const [appsSearch, setAppsSearch] = useState('')
  const [appsStatus, setAppsStatus] = useState('pending')
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionSaving, setActionSaving] = useState(false)

  const loadAgents = useCallback(() => {
    setLoading(true)
    adminAgents.list({ search, page, per_page: 12 })
      .then(r => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  const loadApps = useCallback(() => {
    setAppsLoading(true)
    adminProfessionalApplications.list({ search: appsSearch, page: appsPage, status: appsStatus, per_page: 12 })
      .then(r => { setApps(r.data); setAppsMeta(r.meta) })
      .finally(() => setAppsLoading(false))
  }, [appsSearch, appsPage, appsStatus])

  useEffect(() => { if (view === 'agents') loadAgents() }, [loadAgents, view])
  useEffect(() => { if (view === 'applications') loadApps() }, [loadApps, view])
  useEffect(() => { publicApi.cities().then(r => setCities(r.data?.cities || [])) }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target?.value ?? e }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, city_id: form.city_id || null }
      editing ? await adminAgents.update(editing.id, payload) : await adminAgents.create(payload)
      setModal(false); loadAgents()
    } catch (err) { alert(err?.message || 'Error') } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this agent?')) return
    await adminAgents.delete(id); loadAgents()
  }

  const approve = async (id) => {
    setActionSaving(true)
    try { await adminProfessionalApplications.approve(id); loadApps() }
    catch (err) { alert(err?.message || 'Error approving') }
    finally { setActionSaving(false) }
  }

  const openReject = (app) => { setRejectModal(app); setRejectReason('') }

  const confirmReject = async () => {
    if (!rejectModal) return
    setActionSaving(true)
    try {
      await adminProfessionalApplications.reject(rejectModal.id, rejectReason)
      setRejectModal(null); loadApps()
    } catch (err) { alert(err?.message || 'Error') }
    finally { setActionSaving(false) }
  }

  const agentCols = [
    { key: 'name', label: 'Agent', render: r => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#730D26] flex items-center justify-center text-white text-xs font-bold">{r.name?.[0]}</div>
        <div>
          <p className="font-medium text-sm text-gray-800 flex items-center gap-1">
            {r.name} {r.is_verified && <BadgeCheck size={13} className="text-blue-500" />}
          </p>
          <p className="text-xs text-gray-400">{r.email || '—'}</p>
        </div>
      </div>
    )},
    { key: 'phone',       label: 'Phone',    render: r => r.phone || '—' },
    { key: 'city',        label: 'City',     render: r => r.city?.name || '—' },
    { key: 'is_featured', label: 'Featured', render: r => <Badge color={r.is_featured ? 'gold' : 'gray'}>{r.is_featured ? 'Yes' : 'No'}</Badge> },
    { key: 'is_verified', label: 'Verified', render: r => <Badge color={r.is_verified ? 'blue' : 'gray'}>{r.is_verified ? 'Yes' : 'No'}</Badge> },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Btn>
        <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  const appCols = [
    { key: 'name', label: 'Applicant', render: r => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold">{r.name?.[0]}</div>
        <div>
          <p className="font-medium text-sm text-gray-800">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'specialty', label: 'Specialty', render: r => (
      <span className="text-sm text-gray-700">{r.professional_specialty || '—'}</span>
    )},
    { key: 'experience', label: 'Experience', render: r => (
      r.professional_experience_years != null
        ? <span className="text-sm text-gray-700">{r.professional_experience_years} yr{r.professional_experience_years !== 1 ? 's' : ''}</span>
        : '—'
    )},
    { key: 'company', label: 'Company', render: r => r.company_name || '—' },
    { key: 'applied', label: 'Applied', render: r => (
      r.professional_applied_at
        ? <span className="text-xs text-gray-500">{new Date(r.professional_applied_at).toLocaleDateString()}</span>
        : '—'
    )},
    { key: 'status', label: 'Status', render: r => {
      const map = { pending: ['amber', 'Pending'], approved: ['blue', 'Approved'], rejected: ['red', 'Rejected'] }
      const [color, label] = map[r.professional_status] || ['gray', r.professional_status]
      return <Badge color={color}>{label}</Badge>
    }},
    { key: 'bio', label: 'Bio', render: r => (
      <span className="text-xs text-gray-500 line-clamp-2 max-w-xs">{r.professional_bio || '—'}</span>
    )},
    { key: 'actions', label: '', render: r => (
      r.professional_status === 'pending' ? (
        <div className="flex gap-1 justify-end">
          <Btn size="sm" variant="gold" onClick={() => approve(r.id)} disabled={actionSaving}>
            <Check size={13} /> Approve
          </Btn>
          <Btn size="sm" variant="danger" onClick={() => openReject(r)} disabled={actionSaving}>
            <X size={13} /> Reject
          </Btn>
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic">
          {r.professional_status === 'approved' ? 'Approved ✓' : 'Rejected'}
        </span>
      )
    )},
  ]

  return (
    <div>
      <PageHeader title="Agents" subtitle={view === 'agents' ? `${meta.total ?? 0} total` : `${appsMeta.total ?? 0} applications`}>
        {view === 'agents' && <Btn variant="gold" onClick={openCreate}><Plus size={15} /> Add Agent</Btn>}
      </PageHeader>

      {/* View switcher */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('agents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'agents' ? 'bg-[#730D26] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
          <Users size={15} /> Agents
        </button>
        <button onClick={() => setView('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'applications' ? 'bg-[#730D26] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
          <ClipboardList size={15} /> Professional Applications
        </button>
      </div>

      {view === 'agents' && (
        <DataTable columns={agentCols} data={rows} loading={loading}
          search={search} onSearch={v => { setSearch(v); setPage(1) }}
          page={page} lastPage={meta.last_page || 1} onPage={setPage} />
      )}

      {view === 'applications' && (
        <>
          <div className="flex gap-2 mb-3">
            {['pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => { setAppsStatus(s); setAppsPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${appsStatus === s ? 'bg-[#730D26] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <DataTable columns={appCols} data={apps} loading={appsLoading}
            search={appsSearch} onSearch={v => { setAppsSearch(v); setAppsPage(1) }}
            page={appsPage} lastPage={appsMeta.last_page || 1} onPage={setAppsPage} />
        </>
      )}

      {/* Agent create/edit modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Agent' : 'Add Agent'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required><Input value={form.first_name} onChange={f('first_name')} required placeholder="Youssef" /></FormField>
            <FormField label="Last Name" required><Input value={form.last_name} onChange={f('last_name')} required placeholder="El Amrani" /></FormField>
            <FormField label="Email"><Input type="email" value={form.email} onChange={f('email')} placeholder="agent@example.com" /></FormField>
            <FormField label="Phone"><Input value={form.phone} onChange={f('phone')} placeholder="+212 6 12 34 56 78" /></FormField>
            <FormField label="WhatsApp"><Input value={form.whatsapp} onChange={f('whatsapp')} placeholder="+212 6 12 34 56 78" /></FormField>
            <FormField label="City">
              <Select value={form.city_id} onChange={f('city_id')}>
                <option value="">Select city</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Bio"><Textarea value={form.description} onChange={f('description')} rows={3} placeholder="Agent biography..." /></FormField>
          <div className="flex gap-6">
            <Toggle checked={form.is_featured} onChange={v => setForm(p => ({ ...p, is_featured: v }))} label="Featured agent" />
            <Toggle checked={form.is_verified} onChange={v => setForm(p => ({ ...p, is_verified: v }))} label="Verified" />
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>

      {/* Reject modal */}
      {rejectModal && (
        <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title={`Reject Application — ${rejectModal.name}`}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Optionally provide a reason. The applicant will see this message.</p>
            <FormField label="Reason (optional)">
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                placeholder="e.g. Incomplete information, invalid license number..." />
            </FormField>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <Btn type="button" variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Btn>
              <Btn type="button" variant="danger" disabled={actionSaving} onClick={confirmReject}>
                {actionSaving ? 'Rejecting…' : 'Confirm Reject'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
