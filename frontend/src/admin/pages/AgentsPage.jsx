import { useEffect, useState, useCallback } from 'react'
import { adminAgents, publicApi } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Textarea, Select, Toggle } from '../components/Modal'
import { Plus, Pencil, Trash2, BadgeCheck, Ban, ShieldCheck } from 'lucide-react'

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', whatsapp: '', description: '', city_id: '', is_featured: false, is_verified: false }

export default function AgentsPage() {
  const [rows, setRows]           = useState([])
  const [meta, setMeta]           = useState({})
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [cities, setCities]       = useState([])
  const [banModal, setBanModal]   = useState(false)
  const [banTarget, setBanTarget] = useState(null)
  const [banReason, setBanReason] = useState('')
  const [banning, setBanning]     = useState(false)

  const loadAgents = useCallback(() => {
    setLoading(true)
    adminAgents.list({ search, page, per_page: 12 })
      .then(r => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { loadAgents() }, [loadAgents])
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

  const openBan = (row) => {
    setBanTarget(row)
    setBanReason('')
    setBanModal(true)
  }

  const confirmBan = async () => {
    if (!banTarget) return
    setBanning(true)
    try {
      await adminAgents.ban(banTarget.id, { reason: banReason })
      setBanModal(false)
      loadAgents()
    } catch (err) {
      alert(err?.message || 'Error banning agent')
    } finally {
      setBanning(false)
    }
  }

  const unban = async (id) => {
    if (!window.confirm('Unban this agent? They will regain access to their account.')) return
    try {
      await adminAgents.unban(id)
      loadAgents()
    } catch (err) {
      alert(err?.message || 'Error unbanning agent')
    }
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
    { key: 'status',      label: 'Status',   render: r => r.is_banned
      ? <Badge color="red">Banned</Badge>
      : <Badge color="green">Active</Badge>
    },
    { key: 'actions', label: '', render: r => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Btn>
        {r.is_banned
          ? <Btn size="sm" variant="ghost" onClick={() => unban(r.id)} title="Unban agent"><ShieldCheck size={13} className="text-green-600" /></Btn>
          : <Btn size="sm" variant="ghost" onClick={() => openBan(r)} title="Ban agent"><Ban size={13} className="text-amber-600" /></Btn>
        }
        <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Agents" subtitle={`${meta.total ?? 0} total`}>
        <Btn variant="gold" onClick={openCreate}><Plus size={15} /> Add Agent</Btn>
      </PageHeader>

      <DataTable columns={agentCols} data={rows} loading={loading}
        search={search} onSearch={v => { setSearch(v); setPage(1) }}
        page={page} lastPage={meta.last_page || 1} onPage={setPage} />

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

      <Modal open={banModal} onClose={() => setBanModal(false)} title="Ban Agent" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Ban size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Suspend <span className="font-bold">{banTarget?.name}</span></p>
              <p className="text-xs text-amber-600 mt-0.5">This agent and their linked user account will be signed out and blocked from logging in.</p>
            </div>
          </div>
          <FormField label="Reason (optional)">
            <Input
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder="e.g. Fraudulent listings"
              maxLength={500}
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setBanModal(false)}>Cancel</Btn>
            <Btn variant="danger" disabled={banning} onClick={confirmBan}>
              <Ban size={14} /> {banning ? 'Banning…' : 'Ban Agent'}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
