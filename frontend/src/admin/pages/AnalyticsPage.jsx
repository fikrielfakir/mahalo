import { useEffect, useState, useCallback } from 'react'
import { adminApi } from '../api/adminApi'
import {
  Eye, Users, Globe, Monitor, Smartphone, Tablet,
  TrendingUp, TrendingDown, Activity, Map, Chrome,
  BarChart2, Clock, RefreshCw
} from 'lucide-react'

const DAYS_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
]

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

const BROWSER_COLORS = {
  Chrome: '#4285F4',
  Firefox: '#FF7139',
  Safari: '#0FB5EE',
  Edge: '#0078D4',
  Opera: '#FF1B2D',
  IE: '#1EBBEE',
  Other: '#94a3b8',
}

const DEVICE_COLORS = {
  desktop: '#730D26',
  mobile: '#BA1932',
  tablet: '#e57994',
}

function StatCard({ label, value, sub, icon: Icon, color, change, changeLabel }) {
  const colors = {
    red:    { bg: 'bg-[#730D26]/5',   text: 'text-[#730D26]',   icon: 'bg-[#730D26]/10' },
    rose:   { bg: 'bg-rose-50',        text: 'text-rose-600',    icon: 'bg-rose-100' },
    blue:   { bg: 'bg-blue-50',        text: 'text-blue-600',    icon: 'bg-blue-100' },
    green:  { bg: 'bg-emerald-50',     text: 'text-emerald-600', icon: 'bg-emerald-100' },
    purple: { bg: 'bg-violet-50',      text: 'text-violet-600',  icon: 'bg-violet-100' },
    amber:  { bg: 'bg-amber-50',       text: 'text-amber-600',   icon: 'bg-amber-100' },
  }
  const c = colors[color] || colors.blue
  const isPositive = change > 0
  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={c.text} />
        </div>
        {change != null && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold ${c.text} mb-1`}>{value ?? '—'}</div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
      {sub && <div className="text-gray-400 text-xs mt-0.5">{sub}</div>}
      {changeLabel && change != null && <div className="text-gray-400 text-xs mt-0.5">{changeLabel}</div>}
    </div>
  )
}

function MiniBarChart({ data, valueKey = 'views', labelKey = 'date', height = 80 }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div className="flex items-end gap-0.5 w-full" style={{ height }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100
        return (
          <div
            key={i}
            className="flex-1 bg-[#730D26]/20 rounded-t hover:bg-[#730D26]/40 transition-colors relative group"
            style={{ height: `${Math.max(pct, 2)}%` }}
            title={`${d[labelKey]}: ${d[valueKey].toLocaleString()} views`}
          />
        )
      })}
    </div>
  )
}

function DonutChart({ data, colorMap, valueKey = 'views', labelKey }) {
  if (!data?.length) return null
  const total = data.reduce((s, d) => s + Number(d[valueKey]), 0)
  if (total === 0) return null

  let offset = 0
  const r = 40
  const circumference = 2 * Math.PI * r
  const segments = data.map((d, i) => {
    const pct = Number(d[valueKey]) / total
    const dash = pct * circumference
    const seg = { ...d, dash, offset, color: colorMap?.[d[labelKey]] || colorMap?.[d.browser] || colorMap?.[d.device_type] || '#94a3b8' }
    offset += dash
    return seg
  })

  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="50" cy="50" r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={-seg.offset + circumference * 0.25}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
        <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">
          {total.toLocaleString()}
        </text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {segments.map((seg, i) => {
          const lbl = seg[labelKey] || seg.browser || seg.device_type || seg.os || '—'
          const pct = ((Number(seg[valueKey]) / total) * 100).toFixed(1)
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
              <span className="text-gray-700 font-medium capitalize truncate flex-1">{lbl}</span>
              <span className="text-gray-400 text-xs">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BarList({ data, valueKey = 'views', labelKey, max }) {
  if (!data?.length) return <p className="text-gray-400 text-sm text-center py-6">No data</p>
  const m = max || Math.max(...data.map(d => Number(d[valueKey])), 1)
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const lbl = row[labelKey] || row.country || row.page || row.browser || row.os || '—'
        const val = Number(row[valueKey])
        const pct = (val / m) * 100
        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 truncate max-w-[70%]" title={lbl}>{lbl}</span>
              <span className="text-sm font-semibold text-gray-900 ml-2">{val.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#730D26]/70 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RecentVisitorsTable({ rows }) {
  if (!rows?.length) return <p className="text-gray-400 text-sm text-center py-10">No visitors yet</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['IP Address', 'Page', 'Country', 'Device', 'Browser', 'OS', 'Time'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-gray-400 py-2 px-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map(r => {
            const DIcon = DEVICE_ICONS[r.device_type] || Monitor
            const t = new Date(r.created_at)
            const timeStr = t.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            return (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3 font-mono text-xs text-gray-600">{r.ip_address || '—'}</td>
                <td className="py-2 px-3 max-w-[200px]">
                  <span className="truncate block text-gray-700" title={r.page}>{r.page || '/'}</span>
                </td>
                <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{r.country || '—'}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1 text-gray-500">
                    <DIcon size={13} />
                    <span className="capitalize">{r.device_type || '—'}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-gray-600">{r.browser || '—'}</td>
                <td className="py-2 px-3 text-gray-600">{r.os || '—'}</td>
                <td className="py-2 px-3 text-gray-400 whitespace-nowrap text-xs">{timeStr}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState({})

  const load = useCallback(async (d, isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true)
    try {
      const params = { days: d }
      const [overview, timeSeries, topPages, countries, devices, browsers, os, recent] = await Promise.all([
        adminApi.get('/admin/analytics/overview', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/time-series', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/top-pages', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/countries', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/devices', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/browsers', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/os', { params }).then(r => r.data),
        adminApi.get('/admin/analytics/recent').then(r => r.data),
      ])
      setData({ overview, timeSeries, topPages, countries, devices, browsers, os, recent })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load(days) }, [days, load])

  const handleRefresh = () => load(days, true)

  if (loading) {
    return (
      <div>
        <div className="h-8 bg-gray-100 rounded-xl w-48 animate-pulse mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { overview, timeSeries, topPages, countries, devices, browsers, os, recent } = data

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Visitor traffic, devices, locations & more</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {DAYS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${days === opt.value ? 'bg-white text-[#730D26] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Page Views"
          value={overview?.total_views?.toLocaleString()}
          icon={Eye}
          color="red"
          change={overview?.views_change}
          changeLabel="vs previous period"
        />
        <StatCard
          label="Unique Visitors"
          value={overview?.unique_visitors?.toLocaleString()}
          icon={Users}
          color="blue"
          change={overview?.uniq_change}
          changeLabel="vs previous period"
        />
        <StatCard
          label="Unique IPs"
          value={overview?.unique_ips?.toLocaleString()}
          icon={Globe}
          color="green"
        />
        <StatCard
          label="Bot Traffic"
          value={overview?.bot_views?.toLocaleString()}
          icon={Activity}
          color="amber"
          sub="Filtered from stats"
        />
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <BarChart2 size={16} className="text-[#730D26]" />
            Traffic Over Time
          </h2>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#730D26]/60 inline-block" /> Views
            </span>
          </div>
        </div>
        <MiniBarChart data={timeSeries} valueKey="views" labelKey="date" height={120} />
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>{timeSeries?.[0]?.date}</span>
          <span>{timeSeries?.[timeSeries?.length - 1]?.date}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Eye size={16} className="text-[#730D26]" /> Top Pages
          </h2>
          <BarList data={topPages?.slice(0, 10)} valueKey="views" labelKey="page" />
        </div>

        {/* Countries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Map size={16} className="text-[#730D26]" /> Top Countries
          </h2>
          <BarList data={countries?.slice(0, 10)} valueKey="views" labelKey="country" />
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Monitor size={16} className="text-[#730D26]" /> Devices
          </h2>
          <DonutChart data={devices} colorMap={DEVICE_COLORS} valueKey="views" labelKey="device_type" />
        </div>

        {/* Browsers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Chrome size={16} className="text-[#730D26]" /> Browsers
          </h2>
          <DonutChart data={browsers} colorMap={BROWSER_COLORS} valueKey="views" labelKey="browser" />
        </div>
      </div>

      {/* OS & Recent Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Activity size={16} className="text-[#730D26]" /> Operating Systems
          </h2>
          <BarList data={os} valueKey="views" labelKey="os" />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#730D26]" /> Recent Visitors
            <span className="ml-auto text-xs text-gray-400 font-normal">Last 50</span>
          </h2>
          <RecentVisitorsTable rows={recent} />
        </div>
      </div>
    </div>
  )
}
