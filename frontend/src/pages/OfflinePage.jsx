import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Wifi } from 'lucide-react'

export default function OfflinePage() {
  const [dots, setDots]         = useState(0)
  const [restored, setRestored] = useState(false)

  // Animate "waiting" dots
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(id)
  }, [])

  // Listen for connection restore — show a brief "reconnected" state before the
  // OfflineGate in App.jsx automatically unmounts this page
  useEffect(() => {
    const onOnline = () => setRestored(true)
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])

  const handleRetry = () => window.location.reload()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2744 55%, #0c1a2e 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: '#38bdf8', filter: 'blur(130px)', transform: 'translate(30%,-30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: '#38bdf8', filter: 'blur(130px)', transform: 'translate(-30%,30%)' }}
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

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Outer ring pulse */}
          <div
            className="absolute w-[100px] h-[100px] rounded-full border border-sky-500/20 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="w-[76px] h-[76px] rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur"
            style={{ background: 'rgba(56,189,248,0.08)' }}
          >
            {restored
              ? <Wifi    size={30} className="text-emerald-400" />
              : <WifiOff size={30} className="text-sky-400" />
            }
          </div>
        </div>

        {/* Title */}
        {restored ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
              Back Online!
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Your connection has been restored. Reloading the page…
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
              No Connection
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-1">
              Your device is not connected to the internet.
            </p>
            <p className="text-white/30 text-xs mb-8">
              Check your Wi-Fi or mobile data and try again.
            </p>
          </>
        )}

        {/* Status card */}
        {!restored && (
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 mb-6 text-left backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Network Status</span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Wi-Fi / Mobile data', ok: false  },
                { label: 'API server',           ok: null   },
                { label: 'Your browser',         ok: true   },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{label}</span>
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${
                    ok === true  ? 'text-emerald-400' :
                    ok === false ? 'text-amber-400'   : 'text-white/25'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ok === true  ? 'bg-emerald-400'              :
                      ok === false ? 'bg-amber-400 animate-pulse'  : 'bg-white/20'
                    }`} />
                    {ok === true ? 'OK' : ok === false ? 'Disconnected' : 'Unknown'}
                  </span>
                </div>
              ))}
            </div>

            {/* Waiting dots */}
            <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i < dots ? 'bg-sky-400' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/30">Waiting for connection{'.'.repeat(dots)}</span>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: restored ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.12)',
            border: `1px solid ${restored ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.25)'}`,
            color: restored ? '#6ee7b7' : '#7dd3fc',
          }}
        >
          <RefreshCw size={15} className={restored ? 'animate-spin' : ''} />
          {restored ? 'Reloading…' : 'Retry Connection'}
        </button>

        <p className="text-white/20 text-xs mt-4">
          {restored
            ? 'This will happen automatically in a moment'
            : 'The page will reload automatically when your connection returns'}
        </p>
      </div>
    </div>
  )
}
