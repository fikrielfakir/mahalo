/* ─────────────────────────────────────────────────────────
   Shared skeleton components — shimmer via the .skeleton CSS class
   ───────────────────────────────────────────────────────── */

/* ── base shim ── */
const S = ({ className = '', style = {} }) => (
  <div className={`skeleton rounded-xl ${className}`} style={style} />
)

/* ────────── listing row (agent dashboard: properties / projects) ────────── */
export function ListingRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4 items-center">
      <S className="w-16 h-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <S className="h-3.5 w-3/4" />
        <S className="h-2.5 w-1/2" />
        <div className="flex gap-2 mt-1">
          <S className="h-5 w-16 rounded-lg" />
          <S className="h-5 w-16 rounded-lg" />
          <S className="h-5 w-20 rounded-lg" />
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        <S className="h-4 w-16" />
        <S className="h-7 w-14 rounded-lg" />
      </div>
    </div>
  )
}

/* ── list of 5 listing rows ── */
export function ListingListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => <ListingRowSkeleton key={i} />)}
    </div>
  )
}

/* ────────── message sidebar row ────────── */
export function MessageRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-50">
      <S className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <S className="h-3 w-2/3" />
        <S className="h-2.5 w-full" />
        <S className="h-2.5 w-1/2" />
      </div>
    </div>
  )
}

/* ── list of 6 message rows ── */
export function MessageListSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => <MessageRowSkeleton key={i} />)}
    </div>
  )
}

/* ────────── chat thread skeleton ────────── */
export function ThreadSkeleton() {
  return (
    <div className="flex flex-col flex-1 p-5 gap-4">
      {/* incoming */}
      <div className="flex items-start gap-3">
        <S className="w-8 h-8 rounded-xl shrink-0" />
        <div className="space-y-1.5 max-w-xs">
          <S className="h-3 w-32" />
          <S className="h-16 w-64 rounded-2xl" />
        </div>
      </div>
      {/* outgoing */}
      <div className="flex items-start gap-3 flex-row-reverse">
        <S className="w-8 h-8 rounded-xl shrink-0" />
        <div className="space-y-1.5 max-w-xs">
          <S className="h-3 w-24 ml-auto" />
          <S className="h-10 w-48 rounded-2xl" />
        </div>
      </div>
      {/* incoming */}
      <div className="flex items-start gap-3">
        <S className="w-8 h-8 rounded-xl shrink-0" />
        <div className="space-y-1.5 max-w-xs">
          <S className="h-3 w-28" />
          <S className="h-12 w-56 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

/* ────────── agent dashboard full-page skeleton ────────── */
export function AgentDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* fake navbar */}
      <div className="h-16 bg-white border-b border-gray-100" />

      <div className="pt-20 pb-16 max-w-5xl mx-auto px-4">
        {/* agent header card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
          <S className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <S className="h-5 w-48" />
            <S className="h-3 w-36" />
          </div>
          <S className="h-8 w-28 rounded-xl shrink-0" />
        </div>

        {/* 4 stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
              <S className="h-3 w-20" />
              <S className="h-7 w-12" />
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>

        {/* rows */}
        <ListingListSkeleton />
      </div>
    </div>
  )
}

/* ────────── profile page full-page skeleton ────────── */
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="h-16 bg-white border-b border-gray-100" />

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {/* profile card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex items-center gap-5">
          <S className="w-20 h-20 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <S className="h-5 w-40" />
            <S className="h-3 w-56" />
            <S className="h-3 w-32" />
          </div>
          <S className="h-9 w-24 rounded-xl shrink-0" />
        </div>

        {/* tabs */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="h-9 w-28 rounded-xl" />
          ))}
        </div>

        {/* property grid 2-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <S className="h-44 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <S className="h-4 w-3/4" />
                <S className="h-3 w-1/2" />
                <div className="flex gap-2 pt-1">
                  <S className="h-3 w-10" />
                  <S className="h-3 w-10" />
                  <S className="h-3 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ────────── professional tab skeleton ────────── */
export function ProfessionalTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <S className="h-4 w-40" />
        <S className="h-3 w-full" />
        <S className="h-3 w-4/5" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <S className="w-8 h-8 rounded-full" />
              <S className="h-2.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ────────── admin table rows (features / categories / etc.) ────────── */
export function AdminTableRowSkeleton() {
  return (
    <div className="bg-white p-4 flex items-center gap-3 border-b border-gray-100">
      <S className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <S className="h-3.5 w-32" />
        <S className="h-2.5 w-20" />
      </div>
      <S className="h-5 w-14 rounded-full shrink-0" />
      <div className="flex gap-1.5 shrink-0">
        <S className="w-7 h-7 rounded-lg" />
        <S className="w-7 h-7 rounded-lg" />
        <S className="w-7 h-7 rounded-lg" />
      </div>
    </div>
  )
}

export function AdminTableSkeleton({ rows = 8 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => <AdminTableRowSkeleton key={i} />)}
    </div>
  )
}

/* ────────── admin full-page skeleton (AdminLayout auth check) ────────── */
export function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* fake sidebar */}
      <div className="w-64 bg-[#730D26] flex flex-col shrink-0 p-4 gap-4">
        <S className="h-8 w-32 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <S key={i} className="h-9 w-full rounded-xl" style={{ background: 'rgba(255,255,255,0.10)' }} />
          ))}
        </div>
      </div>

      {/* main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* top bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
          <S className="flex-1 h-4 max-w-xs" />
          <S className="w-8 h-8 rounded-xl shrink-0" />
        </div>

        {/* content area */}
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          {/* stat cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                <div className="flex justify-between items-start">
                  <S className="h-3 w-20" />
                  <S className="w-9 h-9 rounded-xl" />
                </div>
                <S className="h-7 w-16" />
              </div>
            ))}
          </div>

          {/* main content block */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <S className="h-5 w-40" />
              <div className="flex-1" />
              <S className="h-8 w-24 rounded-xl" />
            </div>
            <AdminTableSkeleton rows={6} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────── site gate skeleton (SiteModeGate — checks site settings on boot) ── */
export function SiteGateSkeleton() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0d0d' }}>
      {/* navbar */}
      <div className="h-16 flex items-center px-6 gap-8 border-b border-white/5">
        <S className="h-7 w-24" style={{ background: 'rgba(255,255,255,0.10)' }} />
        <div className="flex gap-5 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <S key={i} className="h-3 w-14" style={{ background: 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>
        <div className="flex gap-3">
          <S className="h-8 w-20 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <S className="h-8 w-28 rounded-xl" style={{ background: 'rgba(115,13,38,0.40)' }} />
        </div>
      </div>

      {/* hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-24">
        <S className="h-6 w-48 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <S className="h-14 w-[520px] max-w-full" style={{ background: 'rgba(255,255,255,0.09)' }} />
        <S className="h-14 w-80 max-w-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <S className="h-4 w-64 max-w-full mt-2" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* search bar */}
        <div className="mt-4 w-full max-w-2xl h-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  )
}

/* ────────── auth callback skeleton (Google sign-in redirect) ────────── */
export function AuthCallbackSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F5' }}>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 w-full max-w-sm flex flex-col items-center gap-5">
        <S className="w-14 h-14 rounded-2xl" />
        <S className="h-5 w-44" />
        <S className="h-3.5 w-56" />
        <div className="w-full space-y-3 pt-2">
          <S className="h-11 w-full rounded-xl" />
          <S className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/* ────────── admin auth callback skeleton (Google admin redirect) ────────── */
export function AdminAuthCallbackSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a0509' }}>
      <div className="rounded-3xl p-10 w-full max-w-sm flex flex-col items-center gap-5"
        style={{ background: 'rgba(115,13,38,0.12)', border: '1px solid rgba(115,13,38,0.20)' }}>
        <S className="w-14 h-14 rounded-2xl" style={{ background: 'rgba(115,13,38,0.25)' }} />
        <S className="h-5 w-44" style={{ background: 'rgba(255,255,255,0.10)' }} />
        <S className="h-3.5 w-56" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="w-full space-y-3 pt-2">
          <S className="h-11 w-full rounded-xl" style={{ background: 'rgba(115,13,38,0.20)' }} />
        </div>
      </div>
    </div>
  )
}
