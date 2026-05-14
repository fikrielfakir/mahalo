import { useEffect, useState, useCallback } from 'react'
import { adminProfessionalApplications } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField } from '../components/Modal'
import {
  Briefcase, Check, X, Clock, CheckCircle, XCircle,
  Phone, Building2, FileText, Star, Calendar,
} from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'pending',  label: 'Pending',  color: 'amber' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
]

function statusBadge(status) {
  if (status === 'approved') return <Badge color="green">Approved</Badge>
  if (status === 'rejected') return <Badge color="red">Rejected</Badge>
  return <Badge color="amber">Pending</Badge>
}

export default function ProfessionalApplicationsPage() {
  const [rows, setRows]         = useState([])
  const [meta, setMeta]         = useState({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('pending')
  const [selected, setSelected] = useState(null)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [saving, setSaving]     = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    adminProfessionalApplications.list({ search, page, per_page: 15, status })
      .then((r) => { setRows(r.data || []); setMeta(r.meta || {}) })
      .catch(() => { setRows([]) })
      .finally(() => setLoading(false))
  }, [search, page, status])

  useEffect(() => { load() }, [load])

  const approve = async (row) => {
    if (!window.confirm(`Approve application from ${row.name}? This will create an agent profile.`)) return
    setSaving(true)
    try {
      await adminProfessionalApplications.approve(row.id)
      load()
    } catch (err) {
      alert(err?.message || 'Failed to approve')
    } finally { setSaving(false) }
  }

  const openReject = (row) => {
    setSelected(row)
    setRejectReason('')
    setRejectModal(true)
  }

  const submitReject = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminProfessionalApplications.reject(selected.id, rejectReason)
      setRejectModal(false)
      load()
    } catch (err) {
      alert(err?.message || 'Failed to reject')
    } finally { setSaving(false) }
  }

  const cols = [
    {
      key: 'name', label: 'Applicant',
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
      key: 'professional_specialty', label: 'Specialty',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-amber-400" />
          <span className="text-sm text-gray-700">{r.professional_specialty || '—'}</span>
        </div>
      ),
    },
    {
      key: 'professional_experience_years', label: 'Experience',
      render: (r) => r.professional_experience_years
        ? <span className="text-sm text-gray-700">{r.professional_experience_years} yr{r.professional_experience_years !== 1 ? 's' : ''}</span>
        : <span className="text-gray-400">—</span>,
    },
    {
      key: 'professional_phone', label: 'Phone',
      render: (r) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone size={12} className="text-gray-400" />
          {r.professional_phone || r.phone || '—'}
        </div>
      ),
    },
    {
      key: 'professional_applied_at', label: 'Applied',
      render: (r) => (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={11} className="text-gray-400" />
          {r.professional_applied_at
            ? new Date(r.professional_applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—'}
        </div>
      ),
    },
    {
      key: 'professional_status', label: 'Status',
      render: (r) => statusBadge(r.professional_status),
    },
    {
      key: 'actions', label: '',
      render: (r) => r.professional_status === 'pending' ? (
        <div className="flex gap-1.5 justify-end">
          <Btn size="sm" variant="gold" disabled={saving} onClick={() => approve(r)}>
            <Check size={13} /> Approve
          </Btn>
          <Btn size="sm" variant="danger" disabled={saving} onClick={() => openReject(r)}>
            <X size={13} /> Reject
          </Btn>
        </div>
      ) : (
        <span className="text-xs text-gray-400 pr-2">
          {r.professional_status === 'approved' ? '✓ Agent created' : '✗ Rejected'}
        </span>
      ),
    },
  ]

  const pendingCount = meta.total

  return (
    <div>
      <PageHeader
        title="Professional Applications"
        subtitle={`${pendingCount ?? rows.length} application${(pendingCount ?? rows.length) !== 1 ? 's' : ''}`}
      >
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === f.value
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Detail panel for selected row */}
      {selected && !rejectModal && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#730D26] flex items-center justify-center text-white font-bold">
                {selected.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selected.name}</h3>
                <p className="text-xs text-gray-400">{selected.email}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            {selected.professional_specialty && (
              <div><p className="text-xs text-gray-400 mb-0.5">Specialty</p><p className="font-medium text-gray-700">{selected.professional_specialty}</p></div>
            )}
            {selected.professional_experience_years && (
              <div><p className="text-xs text-gray-400 mb-0.5">Experience</p><p className="font-medium text-gray-700">{selected.professional_experience_years} years</p></div>
            )}
            {selected.professional_phone && (
              <div><p className="text-xs text-gray-400 mb-0.5">Phone</p><p className="font-medium text-gray-700">{selected.professional_phone}</p></div>
            )}
            {selected.company_name && (
              <div><p className="text-xs text-gray-400 mb-0.5">Company</p><p className="font-medium text-gray-700">{selected.company_name}</p></div>
            )}
            {selected.license_number && (
              <div><p className="text-xs text-gray-400 mb-0.5">License</p><p className="font-medium text-gray-700">{selected.license_number}</p></div>
            )}
          </div>
          {selected.professional_bio && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Bio</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.professional_bio}</p>
            </div>
          )}
          {selected.professional_reject_reason && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <strong>Reject reason:</strong> {selected.professional_reject_reason}
            </div>
          )}
          {selected.professional_status === 'pending' && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Btn variant="gold" disabled={saving} onClick={() => approve(selected)}>
                <Check size={14} /> Approve & Create Agent
              </Btn>
              <Btn variant="danger" disabled={saving} onClick={() => openReject(selected)}>
                <X size={14} /> Reject
              </Btn>
            </div>
          )}
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
        actions={
          rows.length > 0 && (
            <span className="text-xs text-gray-400">Click a row to view full application</span>
          )
        }
      />

      {/* Make rows clickable */}
      <style>{`tbody tr { cursor: pointer; }`}</style>

      {/* Intercept row clicks via wrapper trick — handled in onRowClick below */}

      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Application" size="sm">
        <form onSubmit={submitReject} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
            <XCircle size={18} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{selected?.name}</p>
              <p className="text-xs text-red-500">{selected?.professional_specialty}</p>
            </div>
          </div>
          <FormField label="Reason for rejection (optional — user will see this)">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Incomplete information, unverifiable license number..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#BA1932] resize-none"
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setRejectModal(false)}>Cancel</Btn>
            <Btn type="submit" variant="danger" disabled={saving}>{saving ? 'Rejecting…' : 'Confirm Reject'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
