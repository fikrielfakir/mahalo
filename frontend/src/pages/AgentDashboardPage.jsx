import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home, Building, MessageCircle, Eye, TrendingUp, User, Phone, Mail,
  MapPin, Edit2, Check, X, ArrowLeft, Camera, Loader2, BadgeCheck,
  ChevronLeft, ChevronRight, Search, Calendar, AlertCircle, Star,
  BarChart2, Inbox, Settings, ExternalLink,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useUserAuth } from '../context/UserAuthContext'
import { agentDashboardApi } from '../api/client'

function fmt(price) {
  if (!price) return '—'
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K MAD`
  return `${n.toLocaleString()} MAD`
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_COLORS = {
  selling: 'bg-emerald-50 text-emerald-600',
  renting: 'bg-blue-50 text-blue-600',
  sold: 'bg-gray-100 text-gray-500',
  rented: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-50 text-amber-600',
  completed: 'bg-blue-50 text-blue-600',
}
const MOD_COLORS = {
  approved: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  rejected: 'bg-red-50 text-red-500',
}

function StatCard({ icon: Icon, label, value, color = '#730D26', sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        <p className="text-xs text-navy/50 font-medium">{label}</p>
        {sub && <p className="text-[11px] text-navy/35 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function EditPropertyModal({ property, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: property.name || '',
    type: property.type || 'sale',
    description: property.description || '',
    location: property.location || '',
    price: property.price || '',
    number_bedroom: property.number_bedroom || '',
    number_bathroom: property.number_bathroom || '',
    square: property.square || '',
    status: property.status || 'selling',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await agentDashboardApi.updateProperty(property.id, form)
      onSaved(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save changes.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-navy text-lg">Edit Property</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.name} onChange={f('name')} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] focus:ring-2 focus:ring-[#730D26]/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Type</label>
              <select value={form.type} onChange={f('type')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]">
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={f('status')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]">
                <option value="selling">Selling</option>
                <option value="renting">Renting</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Location</label>
            <input value={form.location} onChange={f('location')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] focus:ring-2 focus:ring-[#730D26]/10" placeholder="Street, neighborhood..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Price (MAD)</label>
            <input type="number" value={form.price} onChange={f('price')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="0" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Beds</label>
              <input type="number" min="0" value={form.number_bedroom} onChange={f('number_bedroom')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Baths</label>
              <input type="number" min="0" value={form.number_bathroom} onChange={f('number_bathroom')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">m²</label>
              <input type="number" min="0" value={form.square} onChange={f('square')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy/60 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#730D26] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Check size={14} />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: project.name || '',
    description: project.description || '',
    location: project.location || '',
    price_from: project.price_from || '',
    price_to: project.price_to || '',
    status: project.status || 'selling',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await agentDashboardApi.updateProject(project.id, form)
      onSaved(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save changes.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-navy text-lg">Edit Project</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Project Name *</label>
            <input value={form.name} onChange={f('name')} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] focus:ring-2 focus:ring-[#730D26]/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Price From</label>
              <input type="number" value={form.price_from} onChange={f('price_from')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Price To</label>
              <input type="number" value={form.price_to} onChange={f('price_to')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Status</label>
            <select value={form.status} onChange={f('status')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]">
              <option value="selling">Selling</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Location</label>
            <input value={form.location} onChange={f('location')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="City, area..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy/60 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#730D26] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Check size={14} />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OverviewTab({ stats, recentMessages, topProperties }) {
  const maxViews = Math.max(...(topProperties || []).map(p => p.views || 0), 1)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Home} label="Properties" value={stats.properties} color="#730D26" />
        <StatCard icon={Building} label="Projects" value={stats.projects} color="#B5860D" />
        <StatCard icon={Eye} label="Total Views" value={stats.total_views.toLocaleString()} color="#2563eb" />
        <StatCard icon={MessageCircle} label="Messages" value={stats.messages} color="#059669" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top properties by views */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-[#730D26]" />
            <h3 className="font-bold text-navy text-sm">Top Properties by Views</h3>
          </div>
          {topProperties?.length === 0 ? (
            <p className="text-navy/40 text-sm text-center py-6">No properties yet</p>
          ) : (
            <div className="space-y-3">
              {topProperties?.map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-navy truncate max-w-[200px]">{p.name}</span>
                    <span className="text-xs text-navy/50 shrink-0 ml-2">{(p.views || 0).toLocaleString()} views</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#730D26] rounded-full transition-all" style={{ width: `${Math.round(((p.views || 0) / maxViews) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Inbox size={16} className="text-[#730D26]" />
            <h3 className="font-bold text-navy text-sm">Recent Messages</h3>
          </div>
          {recentMessages?.length === 0 ? (
            <p className="text-navy/40 text-sm text-center py-6">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages?.map(m => (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 rounded-xl bg-[#730D26]/10 flex items-center justify-center shrink-0 text-[#730D26] font-bold text-xs">
                    {m.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy truncate">{m.name}</p>
                    <p className="text-xs text-navy/40 truncate">{m.property?.name || m.project?.name || 'General inquiry'}</p>
                    <p className="text-xs text-navy/30 mt-0.5">{fmtDate(m.created_at)}</p>
                  </div>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="shrink-0 text-xs text-[#730D26] font-semibold hover:underline">{m.phone}</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PropertiesTab({ agentId }) {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    agentDashboardApi.properties({ search, page, per_page: 10 })
      .then(r => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const onSaved = (updated) => {
    setRows(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r))
    setEditing(null)
  }

  const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=60'

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search properties..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] bg-white" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#730D26]" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-navy/40 bg-white rounded-2xl border border-gray-100">
          <Home size={32} className="mx-auto mb-3 opacity-30" />
          <p>No properties yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(p => {
            const img = p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`) : FALLBACK
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={img} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = FALLBACK }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{p.name}</p>
                  {p.location && <p className="text-xs text-navy/40 flex items-center gap-1 mt-0.5 truncate"><MapPin size={10} />{p.location}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${MOD_COLORS[p.moderation_status] || 'bg-gray-100 text-gray-500'}`}>
                      {p.moderation_status}
                    </span>
                    <span className="text-[11px] text-navy/40 flex items-center gap-1"><Eye size={10} />{(p.views || 0).toLocaleString()}</span>
                    <span className="text-[11px] text-navy/40 flex items-center gap-1"><MessageCircle size={10} />{p.inquiries || 0} inquiries</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <p className="font-bold text-[#730D26] text-sm">{fmt(p.price)}</p>
                  <button onClick={() => setEditing(p)} className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 hover:text-navy px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-navy/40">{meta.total} total</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-navy/50 flex items-center px-2">{page} / {meta.last_page}</span>
            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {editing && <EditPropertyModal property={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </div>
  )
}

function ProjectsTab() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    agentDashboardApi.projects({ search, page, per_page: 10 })
      .then(r => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  const onSaved = (updated) => {
    setRows(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r))
    setEditing(null)
  }

  const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60'

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search projects..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] bg-white" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#730D26]" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-navy/40 bg-white rounded-2xl border border-gray-100">
          <Building size={32} className="mx-auto mb-3 opacity-30" />
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(p => {
            const img = p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`) : FALLBACK
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={img} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = FALLBACK }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{p.name}</p>
                  {p.location && <p className="text-xs text-navy/40 flex items-center gap-1 mt-0.5"><MapPin size={10} />{p.location}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
                    </span>
                    <span className="text-[11px] text-navy/40 flex items-center gap-1"><Eye size={10} />{(p.views || 0).toLocaleString()}</span>
                    <span className="text-[11px] text-navy/40 flex items-center gap-1"><MessageCircle size={10} />{p.inquiries || 0} inquiries</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <p className="font-bold text-[#730D26] text-sm">{fmt(p.price_from)}{p.price_to ? ` – ${fmt(p.price_to)}` : ''}</p>
                  <button onClick={() => setEditing(p)} className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 hover:text-navy px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-navy/40">{meta.total} total</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-navy/50 flex items-center px-2">{page} / {meta.last_page}</span>
            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {editing && <EditProjectModal project={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </div>
  )
}

function MessagesTab() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(() => {
    setLoading(true)
    agentDashboardApi.messages({ search, page, status, per_page: 15 })
      .then(r => { setRows(r.data); setMeta(r.meta) })
      .finally(() => setLoading(false))
  }, [search, page, status])

  useEffect(() => { load() }, [load])

  const MSG_STATUS = { unread: 'bg-blue-50 text-blue-600', read: 'bg-gray-100 text-gray-500', processing: 'bg-amber-50 text-amber-600', done: 'bg-emerald-50 text-emerald-600' }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, phone..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] bg-white" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] bg-white">
          <option value="">All statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="processing">Processing</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#730D26]" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-navy/40 bg-white rounded-2xl border border-gray-100">
          <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p>No messages yet</p>
          <p className="text-xs mt-1">Messages from users inquiring about your properties/projects will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#730D26]/10 flex items-center justify-center shrink-0 text-[#730D26] font-bold">
                  {m.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-navy text-sm">{m.name}</p>
                    {m.status && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${MSG_STATUS[m.status] || 'bg-gray-100 text-gray-500'}`}>{m.status}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-xs text-navy/60 hover:text-[#730D26] transition-colors">
                        <Phone size={11} />{m.phone}
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-xs text-navy/60 hover:text-[#730D26] transition-colors">
                        <Mail size={11} />{m.email}
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-xs text-navy/35">
                      <Calendar size={10} />{fmtDate(m.created_at)}
                    </span>
                  </div>
                  {m.content && <p className="text-sm text-navy/60 mt-2 leading-relaxed">{m.content}</p>}
                  {(m.property?.name || m.project?.name) && (
                    <p className="text-xs text-navy/40 mt-1.5 flex items-center gap-1">
                      {m.property ? <Home size={10} /> : <Building size={10} />}
                      Re: {m.property?.name || m.project?.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-navy/40">{meta.total} total</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-navy/50 flex items-center px-2">{page} / {meta.last_page}</span>
            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-navy/50 hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileTab({ agent, onUpdated }) {
  const [form, setForm] = useState({
    first_name: agent.first_name || '',
    last_name: agent.last_name || '',
    email: agent.email || '',
    phone: agent.phone || '',
    whatsapp: agent.whatsapp || '',
    description: agent.description || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileRef = useRef(null)
  const f = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setSuccess(false); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess(false)
    try {
      const res = await agentDashboardApi.updateProfile(form)
      setSuccess(true)
      onUpdated(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save changes.')
    } finally { setSaving(false) }
  }

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const res = await agentDashboardApi.uploadAvatar(fd)
      onUpdated({ ...agent, avatar_url: res.data.avatar_url })
    } catch {
      setError('Failed to upload avatar.')
    } finally { setAvatarLoading(false) }
  }

  const avatarUrl = agent.avatar_url || null

  return (
    <div className="max-w-xl space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-navy text-sm mb-4">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#730D26] flex items-center justify-center text-white text-2xl font-bold">
                {(agent.first_name?.[0] || '?').toUpperCase()}
              </div>
            )}
            {agent.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <BadgeCheck size={12} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-navy hover:bg-gray-100 transition-colors disabled:opacity-60">
              {avatarLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              Change Photo
            </button>
            <p className="text-xs text-navy/35 mt-1.5">JPG, PNG — max 4MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
        </div>
      </div>

      {/* Info form */}
      <form onSubmit={submit} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-navy text-sm">Personal Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">First Name</label>
            <input value={form.first_name} onChange={f('first_name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] focus:ring-2 focus:ring-[#730D26]/10" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Last Name</label>
            <input value={form.last_name} onChange={f('last_name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] focus:ring-2 focus:ring-[#730D26]/10" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
            <input type="email" value={form.email} onChange={f('email')} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Phone</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="tel" value={form.phone} onChange={f('phone')} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="+212..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">WhatsApp</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="tel" value={form.whatsapp} onChange={f('whatsapp')} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26]" placeholder="+212..." />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Bio / Description</label>
          <textarea value={form.description} onChange={f('description')} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#730D26] resize-none" placeholder="Tell clients about your experience..." />
        </div>
        {success && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <Check size={15} /> Profile saved successfully.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} /> {error}
          </div>
        )}
        <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-[#730D26] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Check size={14} />Save Profile</>}
        </button>
      </form>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-navy text-sm mb-3">Your Public Profile</h3>
        <p className="text-xs text-navy/50 mb-3">View how your profile appears to clients on the site.</p>
        <Link to={`/agents/${agent.id}`} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-[#730D26] hover:underline">
          <ExternalLink size={14} /> View Public Profile
        </Link>
      </div>
    </div>
  )
}

const TABS = [
  { key: 'overview',    label: 'Overview',    icon: TrendingUp },
  { key: 'properties', label: 'Properties',  icon: Home },
  { key: 'projects',   label: 'Projects',    icon: Building },
  { key: 'messages',   label: 'Messages',    icon: MessageCircle },
  { key: 'profile',    label: 'Profile',     icon: Settings },
]

export default function AgentDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useUserAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [overview, setOverview] = useState(null)
  const [overviewLoading, setOverviewLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login', { replace: true })
    if (!authLoading && isAuthenticated && user?.professional_status !== 'approved') navigate('/profile', { replace: true })
  }, [authLoading, isAuthenticated, user, navigate])

  useEffect(() => {
    if (isAuthenticated && user?.professional_status === 'approved') {
      agentDashboardApi.overview()
        .then(r => setOverview(r.data))
        .catch(() => {})
        .finally(() => setOverviewLoading(false))
    }
  }, [isAuthenticated, user])

  const updateAgent = (updated) => {
    setOverview(prev => prev ? { ...prev, agent: { ...prev.agent, ...updated } } : prev)
  }

  if (authLoading || overviewLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-8 h-8 border-2 border-[#730D26] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const agent = overview?.agent
  const stats = overview?.stats || { properties: 0, projects: 0, total_views: 0, messages: 0 }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 mt-4">
            <Link to="/profile" className="flex items-center gap-1.5 text-navy/50 hover:text-navy text-sm transition-colors">
              <ArrowLeft size={15} /> Back to Profile
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
            {agent?.avatar_url ? (
              <img src={agent.avatar_url} alt={agent.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#730D26] flex items-center justify-center text-white font-bold text-xl shrink-0">
                {agent?.first_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-navy text-xl truncate">{agent?.name || 'Agent'}</h1>
                {agent?.is_verified && <BadgeCheck size={18} className="text-blue-500 shrink-0" />}
              </div>
              <p className="text-sm text-navy/50 truncate">{agent?.email}</p>
              {agent?.city?.name && (
                <p className="text-xs text-navy/35 flex items-center gap-1 mt-0.5"><MapPin size={10} />{agent.city.name}</p>
              )}
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              ✓ Verified Agent
            </span>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
            {TABS.map(t => {
              const Icon = t.icon
              const isActive = tab === t.key
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                    isActive ? 'bg-[#730D26] text-white shadow-sm' : 'text-navy/50 hover:text-navy'
                  }`}>
                  <Icon size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {tab === 'overview' && (
            <OverviewTab stats={stats} recentMessages={overview?.recent_messages || []} topProperties={overview?.top_properties || []} />
          )}
          {tab === 'properties' && <PropertiesTab agentId={agent?.id} />}
          {tab === 'projects' && <ProjectsTab />}
          {tab === 'messages' && <MessagesTab />}
          {tab === 'profile' && agent && <ProfileTab agent={agent} onUpdated={updateAgent} />}
        </div>
      </div>
      <Footer />
    </div>
  )
}
