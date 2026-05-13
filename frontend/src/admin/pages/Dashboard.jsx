import { useEffect, useState } from 'react'
import { adminStats } from '../api/adminApi'
import { Building2, FolderKanban, Users, MessageSquare, TrendingUp, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/DataTable'

function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    blue:  { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    gold:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
    green: { bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100' },
    navy:  { bg: 'bg-slate-50',  text: 'text-slate-700',  icon: 'bg-slate-100' },
    red:   { bg: 'bg-red-50',    text: 'text-red-600',    icon: 'bg-red-100' },
    purple:{ bg: 'bg-violet-50', text: 'text-violet-600', icon: 'bg-violet-100' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={c.text} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${c.text} mb-1`}>{value ?? '—'}</div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
      {sub && <div className="text-gray-400 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

function statusColor(s) {
  if (s === 'selling') return 'green'
  if (s === 'sold') return 'blue'
  if (s === 'rented') return 'gold'
  return 'gray'
}

function consultColor(s) {
  if (s === 'unread') return 'red'
  if (s === 'processing') return 'blue'
  if (s === 'done') return 'green'
  return 'gray'
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminStats.get()
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="mb-6"><div className="h-8 bg-gray-100 rounded-xl w-48 animate-pulse" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { stats, recent_properties, recent_consults } = data || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back — here's what's happening</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Properties"  value={stats?.properties}        icon={Building2}    color="blue"   sub={`${stats?.properties_active} active`} />
        <StatCard label="Featured"          value={stats?.featured_properties} icon={Star}        color="gold"   />
        <StatCard label="Projects"          value={stats?.projects}           icon={FolderKanban} color="navy"   />
        <StatCard label="Agents"            value={stats?.agents}             icon={Users}        color="green"  />
        <StatCard label="Total Inquiries"   value={stats?.consults}           icon={MessageSquare}color="purple" />
        <StatCard label="Unread Inquiries"  value={stats?.consults_unread}    icon={TrendingUp}   color="red"    />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Properties</h2>
            <Link to="/admin/properties" className="text-xs text-[#BA1932] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_properties?.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-xl bg-[#730D26]/5 flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-[#730D26]/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.city} • {p.type}</p>
                </div>
                <Badge color={statusColor(p.status)}>{p.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Consults */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Inquiries</h2>
            <Link to="/admin/consults" className="text-xs text-[#BA1932] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_consults?.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">No inquiries yet</p>
            )}
            {recent_consults?.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#BA1932] text-xs font-bold">{c.name?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email || c.phone}</p>
                </div>
                <Badge color={consultColor(c.status)}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
