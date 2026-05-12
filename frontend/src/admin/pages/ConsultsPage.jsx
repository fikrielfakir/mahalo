import { useEffect, useState, useCallback } from 'react'
import { adminConsults } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal from '../components/Modal'
import { Trash2, Eye, MessageSquare } from 'lucide-react'

const STATUS_OPTIONS = ['unread', 'read', 'processing', 'done']

function statusColor(s) {
  if (s === 'unread') return 'red'
  if (s === 'processing') return 'blue'
  if (s === 'done') return 'green'
  return 'gray'
}

export default function ConsultsPage() {
  const [rows, setRows]       = useState([])
  const [meta, setMeta]       = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [filter, setFilter]   = useState('')
  const [detail, setDetail]   = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminConsults.list({ search, page, per_page: 15, status: filter || undefined })
      .then((r) => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page, filter])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    await adminConsults.update(id, { status })
    load()
    if (detail?.id === id) setDetail(p => ({ ...p, status }))
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return
    await adminConsults.delete(id); load()
    if (detail?.id === id) setDetail(null)
  }

  const cols = [
    { key: 'name', label: 'From', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] font-bold text-xs">{r.name?.[0]}</div>
        <div>
          <p className="font-medium text-sm text-gray-800">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email || r.phone || '—'}</p>
        </div>
      </div>
    )},
    { key: 'content', label: 'Message', render: (r) => <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">{r.content || '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => (
      <select
        value={r.status}
        onChange={(e) => updateStatus(r.id, e.target.value)}
        className={`text-xs font-semibold rounded-lg px-2 py-1 border-0 outline-none cursor-pointer ${r.status === 'unread' ? 'bg-red-50 text-red-600' : r.status === 'done' ? 'bg-emerald-50 text-emerald-600' : r.status === 'processing' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString() },
    { key: 'actions', label: '', render: (r) => (
      <div className="flex gap-1 justify-end">
        <Btn size="sm" variant="ghost" onClick={() => setDetail(r)}><Eye size={13} /></Btn>
        <Btn size="sm" variant="danger" onClick={() => remove(r.id)}><Trash2 size={13} /></Btn>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Inquiries" subtitle={`${meta.total ?? 0} total`}>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A97E]"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </PageHeader>

      <DataTable columns={cols} data={rows} loading={loading} search={search} onSearch={(v) => { setSearch(v); setPage(1) }} page={page} lastPage={meta.last_page || 1} onPage={setPage} />

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Inquiry Detail" size="sm">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] font-bold text-xl">{detail.name?.[0]}</div>
              <div>
                <p className="font-bold text-gray-900">{detail.name}</p>
                <p className="text-sm text-gray-500">{detail.email || '—'} {detail.phone ? `· ${detail.phone}` : ''}</p>
              </div>
            </div>
            {detail.content && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{detail.content}</div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={detail.status}
                onChange={(e) => updateStatus(detail.id, e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#C8A97E]"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-400">Received {new Date(detail.created_at).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
