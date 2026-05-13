import { useEffect, useState, useCallback } from 'react'
import { adminConsults } from '../api/adminApi'
import { DataTable, PageHeader, Badge, Btn } from '../components/DataTable'
import Modal from '../components/Modal'
import { Trash2, Eye, MessageSquare, Download, Mail, Phone, CheckSquare, Square, Building2, User } from 'lucide-react'

const STATUS_OPTIONS = ['unread', 'read', 'processing', 'done']

function statusColor(s) {
  if (s === 'unread')     return 'red'
  if (s === 'processing') return 'blue'
  if (s === 'done')       return 'green'
  return 'gray'
}

function exportCSV(rows) {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Property', 'Agent', 'Date']
  const lines = rows.map(r => [
    r.id,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    r.email || '',
    r.phone || '',
    `"${(r.content || r.message || '').replace(/"/g, '""')}"`,
    r.status || '',
    r.property?.name || '',
    r.agent?.name || '',
    r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
  ].join(','))
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inquiries-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ConsultsPage() {
  const [rows, setRows]         = useState([])
  const [meta, setMeta]         = useState({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [filter, setFilter]     = useState('')
  const [detail, setDetail]     = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkStatus, setBulkStatus] = useState('read')
  const [bulkWorking, setBulkWorking] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    adminConsults.list({ search, page, per_page: 15, status: filter || undefined })
      .then((r) => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page, filter])

  useEffect(() => { load() }, [load])

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set())
    else setSelected(new Set(rows.map(r => r.id)))
  }

  const updateStatus = async (id, status) => {
    await adminConsults.update(id, { status })
    load()
    if (detail?.id === id) setDetail(p => ({ ...p, status }))
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return
    await adminConsults.delete(id)
    load()
    if (detail?.id === id) setDetail(null)
  }

  const bulkAction = async () => {
    if (!selected.size) return
    setBulkWorking(true)
    try {
      await Promise.all([...selected].map(id => adminConsults.update(id, { status: bulkStatus })))
      setSelected(new Set())
      load()
    } catch {
      for (const id of selected) {
        await adminConsults.update(id, { status: bulkStatus }).catch(() => {})
      }
      setSelected(new Set())
      load()
    } finally {
      setBulkWorking(false)
    }
  }

  const bulkDelete = async () => {
    if (!selected.size) return
    if (!window.confirm(`Delete ${selected.size} selected inquiries?`)) return
    setBulkWorking(true)
    for (const id of selected) {
      await adminConsults.delete(id).catch(() => {})
    }
    setSelected(new Set())
    load()
    setBulkWorking(false)
  }

  const cols = [
    {
      key: '_check', label: (
        <button onClick={toggleAll} className="p-0.5">
          {selected.size === rows.length && rows.length > 0
            ? <CheckSquare size={15} className="text-[#9B1232]" />
            : <Square size={15} className="text-gray-300" />}
        </button>
      ),
      render: (r) => (
        <button onClick={(e) => { e.stopPropagation(); toggleSelect(r.id) }} className="p-0.5">
          {selected.has(r.id)
            ? <CheckSquare size={15} className="text-[#9B1232]" />
            : <Square size={15} className="text-gray-300" />}
        </button>
      ),
    },
    {
      key: 'name', label: 'From',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#9B1232]/10 flex items-center justify-center text-[#9B1232] font-bold text-xs shrink-0">
            {r.name?.[0]}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-800">{r.name}</p>
            <p className="text-xs text-gray-400">{r.email || r.phone || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'source', label: 'Source',
      render: (r) => (
        <div className="text-xs text-gray-500">
          {r.property && <div className="flex items-center gap-1"><Building2 size={11} className="text-gray-400" /> {r.property.name}</div>}
          {r.agent && <div className="flex items-center gap-1"><User size={11} className="text-gray-400" /> {r.agent.name}</div>}
          {!r.property && !r.agent && <span className="text-gray-300">—</span>}
        </div>
      ),
    },
    {
      key: 'content', label: 'Message',
      render: (r) => <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{r.content || r.message || '—'}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => updateStatus(r.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs font-semibold rounded-lg px-2 py-1 border-0 outline-none cursor-pointer ${
            r.status === 'unread'     ? 'bg-red-50 text-red-600' :
            r.status === 'done'       ? 'bg-emerald-50 text-emerald-600' :
            r.status === 'processing' ? 'bg-blue-50 text-blue-600' :
            'bg-gray-100 text-gray-600'
          }`}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: 'created_at', label: 'Date',
      render: (r) => <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex gap-1 justify-end">
          <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDetail(r) }}><Eye size={13} /></Btn>
          <Btn size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); remove(r.id) }}><Trash2 size={13} /></Btn>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Inquiries" subtitle={`${meta.total ?? 0} total`}>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#9B1232]"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Btn variant="ghost" onClick={() => exportCSV(rows)}>
            <Download size={14} /> Export CSV
          </Btn>
        </div>
      </PageHeader>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-4 p-3 bg-[#1A1A1A] rounded-2xl flex items-center gap-3 flex-wrap">
          <span className="text-white text-sm font-medium">{selected.size} selected</span>
          <div className="flex items-center gap-2 flex-1">
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              className="rounded-xl px-3 py-1.5 text-sm bg-white/10 text-white border border-white/20 outline-none"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Btn size="sm" variant="gold" onClick={bulkAction} disabled={bulkWorking}>
              {bulkWorking ? 'Working…' : 'Apply Status'}
            </Btn>
          </div>
          <Btn size="sm" variant="danger" onClick={bulkDelete} disabled={bulkWorking}>
            <Trash2 size={13} /> Delete Selected
          </Btn>
          <button onClick={() => setSelected(new Set())} className="text-white/50 hover:text-white text-xs">Clear</button>
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
      />

      {/* Rich detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Inquiry Detail" size="md">
        {detail && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#9B1232]/10 flex items-center justify-center text-[#9B1232] font-bold text-2xl shrink-0">
                {detail.name?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{detail.name}</h3>
                <div className="flex flex-wrap gap-3 mt-1">
                  {detail.email && (
                    <a href={`mailto:${detail.email}`} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                      <Mail size={13} /> {detail.email}
                    </a>
                  )}
                  {detail.phone && (
                    <a href={`tel:${detail.phone}`} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                      <Phone size={13} /> {detail.phone}
                    </a>
                  )}
                </div>
              </div>
              <Badge color={statusColor(detail.status)}>{detail.status}</Badge>
            </div>

            {/* Message */}
            {(detail.content || detail.message) && (
              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {detail.content || detail.message}
              </div>
            )}

            {/* Source */}
            {(detail.property || detail.agent) && (
              <div className="flex flex-wrap gap-3">
                {detail.property && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl text-sm text-blue-700">
                    <Building2 size={13} /> Re: {detail.property.name}
                  </div>
                )}
                {detail.agent && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl text-sm text-purple-700">
                    <User size={13} /> Agent: {detail.agent.name}
                  </div>
                )}
              </div>
            )}

            {/* Status + actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Status:</span>
              <select
                value={detail.status}
                onChange={(e) => updateStatus(detail.id, e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#9B1232]"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex-1" />
              <span className="text-xs text-gray-400">
                {new Date(detail.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            {/* Quick reply buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {detail.email && (
                <a
                  href={`mailto:${detail.email}?subject=Re: Your inquiry on Mahalo&body=Hello ${detail.name},%0D%0A%0D%0AThank you for contacting us.`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9B1232] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Mail size={13} /> Reply by Email
                </a>
              )}
              {detail.phone && (
                <a
                  href={`https://wa.me/${detail.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(detail.name)}, thank you for your inquiry on Mahalo.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MessageSquare size={13} /> WhatsApp
                </a>
              )}
              {detail.phone && (
                <a
                  href={`tel:${detail.phone}`}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Phone size={13} /> Call
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
