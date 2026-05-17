import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Wifi } from 'lucide-react'

export default function OfflinePage() {
  const [dots, setDots]         = useState(0)
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onOnline = () => setRestored(true)
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #730D26 0%, #3a0614 60%, #1a0009 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(120px)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(120px)', transform: 'translate(-30%,30%)' }} />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">

        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <img src="/logo-light.png" alt="Mahalo" className="h-10 object-contain"
            onError={e => { e.currentTarget.style.display = 'none' }} />
        </div>

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping"
            style={{ animationDuration: '2s' }} />
          <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
            {restored
              ? <Wifi    size={30} className="text-emerald-300" />
              : <WifiOff size={30} className="text-white" />
            }
          </div>
        </div>

        {/* Title */}
        {restored ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
              Back Online!
            </h1>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Your connection has been restored. Reloading the page…
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
              No Connection
            </h1>
            <p className="text-white/65 text-base leading-relaxed mb-1">
              Your device is not connected to the internet.
            </p>
            <p className="text-white/40 text-sm mb-8">
              Check your Wi-Fi or mobile data and try again.
            </p>
          </>
        )}

        {/* Status card */}
        {!restored && (
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Network Status</span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Wi-Fi / Mobile data', ok: false },
                { label: 'API server',           ok: null  },
                { label: 'Your browser',         ok: true  },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{label}</span>
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${
                    ok === true  ? 'text-emerald-300' :
                    ok === false ? 'text-amber-300'   : 'text-white/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ok === true  ? 'bg-emerald-400'             :
                      ok === false ? 'bg-amber-400 animate-pulse' : 'bg-white/20'
                    }`} />
                    {ok === true ? 'OK' : ok === false ? 'Disconnected' : 'Unknown'}
                  </span>
                </div>
              ))}
            </div>

            {/* Waiting dots */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i < dots ? 'bg-white/70' : 'bg-white/20'
                    }`} />
                ))}
              </div>
              <span className="text-xs text-white/35">
                Waiting for connection{'.'.repeat(dots)}
              </span>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all"
        >
          <RefreshCw size={15} className={restored ? 'animate-spin' : ''} />
          {restored ? 'Reloading…' : 'Retry Connection'}
        </button>

        <p className="text-white/30 text-xs mt-4">
          {restored
            ? 'This will happen automatically in a moment'
            : 'The page will reload automatically when your connection returns'}
        </p>
      </div>
    </div>
  )
}
