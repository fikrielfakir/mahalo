import { useEffect, useState, useCallback } from 'react'
import { ServerCrash, RefreshCw, Wifi } from 'lucide-react'

const RETRY_INTERVAL = 20

export default function ServerOfflinePage({ onRecover }) {
  const [countdown, setCountdown]   = useState(RETRY_INTERVAL)
  const [checking, setChecking]     = useState(false)
  const [attempts, setAttempts]     = useState(0)

  const tryReconnect = useCallback(async () => {
    if (checking) return
    setChecking(true)
    try {
      const res = await fetch('/api/v1/public-settings', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        onRecover?.()
        return
      }
    } catch {}
    setAttempts(a => a + 1)
    setCountdown(RETRY_INTERVAL)
    setChecking(false)
  }, [checking, onRecover])

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          tryReconnect()
          return RETRY_INTERVAL
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [tryReconnect])

  const handleManualRetry = () => {
    setCountdown(RETRY_INTERVAL)
    tryReconnect()
  }

  const pct = ((RETRY_INTERVAL - countdown) / RETRY_INTERVAL) * 100
  const r   = 22
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: '#6366f1', filter: 'blur(130px)', transform: 'translate(30%,-30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: '#6366f1', filter: 'blur(130px)', transform: 'translate(-30%,30%)' }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">

        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <img
            src="/logo-light.png"
            alt="Logo"
            className="h-9 object-contain"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        {/* Animated icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Spinning countdown ring */}
          <svg className="absolute" width="100" height="100" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="3" />
            <circle
              cx="30" cy="30" r={r}
              fill="none"
              stroke="rgba(99,102,241,0.6)"
              strokeWidth="3"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.9s linear' }}
            />
          </svg>
          <div className="w-[76px] h-[76px] rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur">
            {checking
              ? <RefreshCw size={30} className="text-indigo-400 animate-spin" />
              : <ServerCrash size={30} className="text-indigo-400" />
            }
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
          Server Unreachable
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-1">
          The backend server is not responding.
        </p>
        <p className="text-white/30 text-xs mb-8">
          {attempts > 0
            ? `Tried ${attempts} time${attempts > 1 ? 's' : ''} — still no response.`
            : 'This may be a temporary outage. We\'re retrying automatically.'}
        </p>

        {/* Status card */}
        <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 mb-6 text-left backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Connection Status</span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Your internet',   ok: true  },
              { label: 'API server',      ok: false },
              { label: 'Database',        ok: null  },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-white/50">{label}</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  ok === true  ? 'text-emerald-400' :
                  ok === false ? 'text-red-400'     : 'text-white/25'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    ok === true  ? 'bg-emerald-400' :
                    ok === false ? 'bg-red-400 animate-pulse' : 'bg-white/20'
                  }`} />
                  {ok === true ? 'Connected' : ok === false ? 'Offline' : 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retry button */}
        <button
          onClick={handleManualRetry}
          disabled={checking}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc' }}
        >
          <RefreshCw size={15} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Checking server…' : 'Try Again Now'}
        </button>

        {/* Countdown hint */}
        <p className="text-white/25 text-xs">
          {checking ? 'Connecting…' : `Auto-retrying in ${countdown}s`}
        </p>

        {/* Status bar pulse */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full bg-indigo-500/30"
              style={{
                width: 4,
                height: 4 + (i % 3) * 4,
                animation: `pulse 1.2s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
