import { useEffect, useState, useCallback } from 'react'
import { adminProfessionalApplications } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal, { FormField } from '../components/Modal'
import { Briefcase, Check, X, CheckCircle, XCircle, Phone, Calendar, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function statusBadge(status, t) {
  if (status === 'approved') return <Badge color="green">{t('admin.applications.statusApproved')}</Badge>
  if (status === 'rejected') return <Badge color="red">{t('admin.applications.statusRejected')}</Badge>
  return <Badge color="amber">{t('admin.applications.statusPending')}</Badge>
}

export default function ProfessionalApplicationsPage() {
  const { t } = useTranslation()
  const [rows, setRows]         = useState([])
  const [meta, setMeta]         = useState({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('all')
  const [selected, setSelected] = useState(null)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [saving, setSaving]     = useState(false)

  const STATUS_FILTERS = [
    { value: 'all',      label: t('admin.applications.filterAll') },
    { value: 'pending',  label: t('admin.applications.filterPending') },
    { value: 'approved', label: t('admin.applications.filterApproved') },
    { value: 'rejected', label: t('admin.applications.filterRejected') },
  ]

  const load = useCallback(() => {
    setLoading(true)
    const params = { search, page, per_page: 15 }
    if (status !== 'all') params.status = status
    adminProfessionalApplications.list(params)
      .then((r) => { setRows(r.data || []); setMeta(r.meta || {}) })
      .catch(() => { setRows([]) })
      .finally(() => setLoading(false))
  }, [search, page, status])

  useEffect(() => { load() }, [load])

  const approve = async (row) => {
    if (!window.confirm(t('admin.applications.confirmApprove', { name: row.name }))) return
    setSaving(true)
    try {
      await adminProfessionalApplications.approve(row.id); load()
    } catch (err) { alert(err?.message || t('admin.applications.failedApprove')) } finally { setSaving(false) }
  }

  const openReject = (row) => { setSelected(row); setRejectReason(''); setRejectModal(true) }

  const submitReject = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await adminProfessionalApplications.reject(selected.id, rejectReason)
      setRejectModal(false); load()
    } catch (err) { alert(err?.message || t('admin.applications.failedReject')) } finally { setSaving(false) }
  }

  const cols = [
    {
      key: 'name', label: t('admin.applications.colApplicant'),
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
      key: 'professional_specialty', label: t('admin.applications.colSpecialty'),
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-amber-400" />
          <span className="text-sm text-gray-700">{r.professional_specialty || '—'}</span>
        </div>
      ),
    },
    {
      key: 'professional_experience_years', label: t('admin.applications.colExperience'),
      render: (r) => r.professional_experience_years
        ? <span className="text-sm text-gray-700">{r.professional_experience_years} yr{r.professional_experience_years !== 1 ? 's' : ''}</span>
        : <span className="text-gray-400">—</span>,
    },
    {
      key: 'professional_phone', label: t('admin.applications.colPhone'),
      render: (r) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone size={12} className="text-gray-400" />
          {r.professional_phone || r.phone || '—'}
        </div>
      ),
    },
    {
      key: 'professional_applied_at', label: t('admin.applications.colApplied'),
      render: (r) => (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={11} className="text-gray-400" />
          {r.professional_applied_at
            ? new Date(r.professional_applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—'}
        </div>
      ),
    },
    { key: 'professional_status', label: t('admin.applications.colStatus'), render: (r) => statusBadge(r.professional_status, t) },
    {
      key: 'actions', label: '',
      render: (r) => r.professional_status === 'pending' ? (
        <div className="flex gap-1.5 justify-end">
          <Btn size="sm" variant="gold" disabled={saving} onClick={() => approve(r)}>
            <Check size={13} /> {t('admin.applications.approveBtn')}
          </Btn>
          <Btn size="sm" variant="danger" disabled={saving} onClick={() => openReject(r)}>
            <X size={13} /> {t('admin.applications.rejectBtn')}
          </Btn>
        </div>
      ) : (
        <span className="text-xs text-gray-400 pr-2">
          {r.professional_status === 'approved' ? `✓ ${t('admin.applications.agentCreated')}` : `✗ ${t('admin.applications.statusRejected')}`}
        </span>
      ),
    },
  ]

  const pendingCount = meta.total

  return (
    <div>
      <PageHeader title={t('admin.applications.title')} subtitle={`${pendingCount ?? rows.length} ${t('admin.applications.subtitle')}`}>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${status === f.value ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </PageHeader>

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
              <div><p className="text-xs text-gray-400 mb-0.5">{t('admin.applications.detailSpecialty')}</p><p className="font-medium text-gray-700">{selected.professional_specialty}</p></div>
            )}
            {selected.professional_experience_years && (
              <div><p className="text-xs text-gray-400 mb-0.5">{t('admin.applications.detailExperience')}</p><p className="font-medium text-gray-700">{selected.professional_experience_years} {t('admin.applications.years')}</p></div>
            )}
            {selected.professional_phone && (
              <div><p className="text-xs text-gray-400 mb-0.5">{t('admin.applications.detailPhone')}</p><p className="font-medium text-gray-700">{selected.professional_phone}</p></div>
            )}
            {selected.company_name && (
              <div><p className="text-xs text-gray-400 mb-0.5">{t('admin.applications.detailCompany')}</p><p className="font-medium text-gray-700">{selected.company_name}</p></div>
            )}
            {selected.license_number && (
              <div><p className="text-xs text-gray-400 mb-0.5">{t('admin.applications.detailLicense')}</p><p className="font-medium text-gray-700">{selected.license_number}</p></div>
            )}
          </div>
          {selected.professional_bio && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">{t('admin.applications.detailBio')}</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.professional_bio}</p>
            </div>
          )}
          {selected.professional_reject_reason && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <strong>{t('admin.applications.rejectReasonLabel')}</strong> {selected.professional_reject_reason}
            </div>
          )}
          {selected.professional_status === 'pending' && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Btn variant="gold" disabled={saving} onClick={() => approve(selected)}>
                <Check size={14} /> {t('admin.applications.approveCreateAgent')}
              </Btn>
              <Btn variant="danger" disabled={saving} onClick={() => openReject(selected)}>
                <X size={14} /> {t('admin.applications.rejectBtn')}
              </Btn>
            </div>
          )}
        </div>
      )}

      <DataTable
        columns={cols} data={rows} loading={loading}
        search={search} onSearch={(v) => { setSearch(v); setPage(1) }}
        page={page} lastPage={meta.last_page || 1} onPage={setPage}
        actions={rows.length > 0 && <span className="text-xs text-gray-400">{t('admin.applications.clickRowHint')}</span>}
      />

      <style>{`tbody tr { cursor: pointer; }`}</style>

      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title={t('admin.applications.rejectModalTitle')} size="sm">
        <form onSubmit={submitReject} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
            <XCircle size={18} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{selected?.name}</p>
              <p className="text-xs text-red-500">{selected?.professional_specialty}</p>
            </div>
          </div>
          <FormField label={t('admin.applications.rejectReasonField')}>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder={t('admin.applications.rejectReasonPlaceholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#BA1932] resize-none"
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Btn type="button" variant="ghost" onClick={() => setRejectModal(false)}>{t('admin.common.cancel')}</Btn>
            <Btn type="submit" variant="danger" disabled={saving}>{saving ? t('admin.applications.rejecting') : t('admin.applications.confirmReject')}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
