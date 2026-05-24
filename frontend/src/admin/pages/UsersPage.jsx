import { useEffect, useState, useCallback } from 'react'
import { adminUsers } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Select } from '../components/Modal'
import { Plus, Pencil, Trash2, Shield, Ban, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ROLES = ['admin', 'agent', 'viewer']
const EMPTY = { name: '', email: '', password: '', role: 'viewer' }

function roleColor(role) {
  if (role === 'admin')  return 'red'
  if (role === 'agent')  return 'blue'
  return 'gray'
}

export default function UsersPage() {
  const { t } = useTranslation()
  const [rows, setRows]         = useState([])
  const [meta, setMeta]         = useState({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [banModal, setBanModal] = useState(false)
  const [banTarget, setBanTarget] = useState(null)
  const [banReason, setBanReason] = useState('')
  const [banning, setBanning]   = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    adminUsers.list({ search, page, per_page: 15 })
      .then((r) => { setRows(r.data || []); setMeta(r.meta || {}) })
      .catch(() => {
        setError('Users API not available on this backend yet.')
        setRows([])
      })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const open = (row = null) => {
    setEditing(row)
    setForm(row ? { name: row.name, email: row.email, password: '', role: row.role || 'viewer' } : EMPTY)
    setModal(true)
  }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      editing
        ? await adminUsers.update(editing.id, payload)
        : await adminUsers.create(payload)
      setModal(false)
      load()
    } catch (err) {
      alert(err?.message || t('admin.users.errorSave'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm(t('admin.users.confirmDelete'))) return
    await adminUsers.delete(id)
    load()
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
      await adminUsers.ban(banTarget.id, { reason: banReason })
      setBanModal(false)
      load()
    } catch (err) {
      alert(err?.message || t('admin.users.errorBan'))
    } finally {
      setBanning(false)
    }
  }

  const unban = async (id) => {
    if (!window.confirm(t('admin.users.confirmUnban'))) return
    try {
      await adminUsers.unban(id)
      load()
    } catch (err) {
      alert(err?.message || t('admin.users.errorUnban'))
    }
  }

  const cols = [
    {
      key: 'name', label: t('admin.users.colUser'),
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#730D26] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {r.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{r.name}</p>
            <p className="text-xs text-gray-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: t('admin.users.colRole'),
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-gray-400" />
          <Badge color={roleColor(r.role)}>{r.role || 'viewer'}</Badge>
        </div>
      ),
    },
    {
      key: 'status', label: t('admin.users.colStatus'),
      render: (r) => r.is_banned
        ? <Badge color="red">{t('admin.common.banned')}</Badge>
        : <Badge color="green">{t('admin.users.activeStatus')}</Badge>,
    },
    {
      key: 'ban_reason', label: t('admin.users.colBanReason'),
      render: (r) => r.ban_reason
        ? <span className="text-xs text-gray-500 max-w-[140px] truncate block" title={r.ban_reason}>{r.ban_reason}</span>
        : <span className="text-gray-300 text-xs">—</span>,
    },
    {
      key: 'created_at', label: t('admin.users.colJoined'),
      render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex gap-1 justify-end">
          <Btn size="sm" variant="ghost" onClick={() => open(r)}><Pencil size={13} /></Btn>
          {r.role !== 'admin' && (
            r.is_banned
              ? <Btn size="sm" variant="ghost" onClick={() => unban(r.id)} title={t('admin.users.confirmUnban')}><ShieldCheck size={13} className="text-green-600" /></Btn>
              : <Btn size="sm" variant="ghost" onClick={() => openBan(r)} title={t('admin.users.banTitle')}><Ban size={13} className="text-amber-600" /></Btn>
          )}
          <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('admin.users.title')} subtitle={`${meta.total ?? rows.length} ${t('admin.common.total')}`}>
        <Btn variant="gold" onClick={() => open()}>
          <Plus size={15} /> {t('admin.users.addUser')}
        </Btn>
      </PageHeader>

      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { role: 'admin',  color: 'bg-red-50 border-red-100',   text: 'text-red-700',  icon: '🔴', descKey: 'admin.users.roleAdminDesc' },
          { role: 'agent',  color: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon: '🔵', descKey: 'admin.users.roleAgentDesc' },
          { role: 'viewer', color: 'bg-gray-50 border-gray-100', text: 'text-gray-600', icon: '⚪', descKey: 'admin.users.roleViewerDesc' },
        ].map(({ role, color, text, icon, descKey }) => (
          <div key={role} className={`p-4 rounded-2xl border ${color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{icon}</span>
              <span className={`font-bold text-sm capitalize ${text}`}>{role}</span>
            </div>
            <p className={`text-xs ${text} opacity-75`}>{t(descKey)}</p>
          </div>
        ))}
      </div>

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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? t('admin.users.editUser') : t('admin.users.addUser')} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label={t('admin.users.fullNameLabel')} required>
            <Input value={form.name} onChange={f('name')} required placeholder={t('admin.users.fullNamePlaceholder')} />
          </FormField>
          <FormField label={t('admin.users.emailLabel')} required>
            <Input type="email" value={form.email} onChange={f('email')} required placeholder={t('admin.users.emailPlaceholder')} />
          </FormField>
          <FormField label={editing ? t('admin.users.passwordNewLabel') : t('admin.users.passwordLabel')} required={!editing}>
            <Input type="password" value={form.password} onChange={f('password')} required={!editing} placeholder={t('admin.users.passwordPlaceholder')} autoComplete="new-password" />
          </FormField>
          <FormField label={t('admin.users.roleLabel')} required>
            <Select value={form.role} onChange={f('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </Select>
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="gold" disabled={saving}>{saving ? t('admin.common.saving') : editing ? t('admin.common.update') : t('admin.common.create')}</Btn>
          </div>
        </form>
      </Modal>

      <Modal open={banModal} onClose={() => setBanModal(false)} title={t('admin.users.banTitle')} size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Ban size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">{banTarget?.name}</p>
              <p className="text-xs text-amber-600 mt-0.5">{t('admin.users.suspendDesc')}</p>
            </div>
          </div>
          <FormField label={t('admin.users.banReasonLabel')}>
            <Input
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder={t('admin.users.banReasonPlaceholder')}
              maxLength={500}
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setBanModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn variant="danger" disabled={banning} onClick={confirmBan}>
              <Ban size={14} /> {banning ? t('admin.common.banning') : t('admin.users.banTitle')}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
