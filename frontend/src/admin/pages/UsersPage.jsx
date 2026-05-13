import { useEffect, useState, useCallback } from 'react'
import { adminUsers } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField, Input, Select } from '../components/Modal'
import { Plus, Pencil, Trash2, Shield, UserCog } from 'lucide-react'

const ROLES = ['admin', 'agent', 'viewer']
const EMPTY = { name: '', email: '', password: '', role: 'viewer' }

function roleColor(role) {
  if (role === 'admin')  return 'red'
  if (role === 'agent')  return 'blue'
  return 'gray'
}

export default function UsersPage() {
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
      alert(err?.message || 'Error saving user')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    await adminUsers.delete(id)
    load()
  }

  const cols = [
    {
      key: 'name', label: 'User',
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
      key: 'role', label: 'Role',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-gray-400" />
          <Badge color={roleColor(r.role)}>{r.role || 'viewer'}</Badge>
        </div>
      ),
    },
    {
      key: 'created_at', label: 'Joined',
      render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
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
      <PageHeader title="Users & Roles" subtitle={`${meta.total ?? rows.length} users`}>
        <Btn variant="gold" onClick={() => open()}>
          <Plus size={15} /> Add User
        </Btn>
      </PageHeader>

      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> {error}
        </div>
      )}

      {/* Role legend */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { role: 'admin',  color: 'bg-red-50 border-red-100',   text: 'text-red-700',  icon: '🔴', desc: 'Full access — manage all content, users and settings.' },
          { role: 'agent',  color: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon: '🔵', desc: 'Can manage listings and view inquiries.' },
          { role: 'viewer', color: 'bg-gray-50 border-gray-100', text: 'text-gray-600', icon: '⚪', desc: 'Read-only access to the admin panel.' },
        ].map(({ role, color, text, icon, desc }) => (
          <div key={role} className={`p-4 rounded-2xl border ${color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{icon}</span>
              <span className={`font-bold text-sm capitalize ${text}`}>{role}</span>
            </div>
            <p className={`text-xs ${text} opacity-75`}>{desc}</p>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit User' : 'Add User'} size="sm">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Full Name" required>
            <Input value={form.name} onChange={f('name')} required placeholder="Sarah Johnson" />
          </FormField>
          <FormField label="Email Address" required>
            <Input type="email" value={form.email} onChange={f('email')} required placeholder="sarah@mahalo.ma" />
          </FormField>
          <FormField label={editing ? 'New Password (leave blank to keep current)' : 'Password'} required={!editing}>
            <Input type="password" value={form.password} onChange={f('password')} required={!editing} placeholder="••••••••" autoComplete="new-password" />
          </FormField>
          <FormField label="Role" required>
            <Select value={form.role} onChange={f('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </Select>
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
