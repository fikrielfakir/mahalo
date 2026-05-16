import { useEffect, useState } from 'react'
import { Clock, Mail, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react'

function pad(n) { return String(n).padStart(2, '0') }

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!targetDate) return
    const target = new Date(targetDate).getTime()

    const tick = () => {
      const now  = Date.now()
      const diff = Math.max(0, target - now)
      const d    = Math.floor(diff / 86400000)
      const h    = Math.floor((diff % 86400000) / 3600000)
      const m    = Math.floor((diff % 3600000) / 60000)
      const s    = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ d, h, m, s, done: diff === 0 })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!targetDate || !timeLeft) return null
  if (timeLeft.done) return null

  const units = [
    { label: 'Jours',    value: timeLeft.d },
    { label: 'Heures',   value: timeLeft.h },
    { label: 'Minutes',  value: timeLeft.m },
    { label: 'Secondes', value: timeLeft.s },
  ]

  return (
    <div className="flex items-center gap-3 sm:gap-5 justify-center flex-wrap mt-8 mb-6">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">{pad(value)}</span>
          </div>
          <span className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function ComingSoonPage({ settings = {} }) {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)
  const siteName = settings.site_name || 'Mahalo'
  const message  = settings.coming_soon_message || "Nous préparons quelque chose d'exceptionnel. Restez à l'écoute."
  const launchDate = settings.coming_soon_date || ''
  const socials = [
    settings.instagram_url && { icon: Instagram, href: settings.instagram_url },
    settings.facebook_url  && { icon: Facebook,  href: settings.facebook_url },
    settings.twitter_url   && { icon: Twitter,   href: settings.twitter_url },
  ].filter(Boolean)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #730D26 0%, #3a0614 60%, #1a0009 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(100px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(100px)', transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">

        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo-light.png" alt={siteName} className="h-10 object-contain" onError={e => { e.target.style.display = 'none' }} />
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
          <Clock size={32} className="text-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Bientôt disponible
        </h1>
        <p className="text-white/65 text-base leading-relaxed mb-2 max-w-sm mx-auto">
          {message}
        </p>

        {/* Countdown */}
        <Countdown targetDate={launchDate} />

        {/* Notify form */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-6">
          <p className="text-white/80 text-sm font-semibold mb-3">
            Soyez notifié au lancement
          </p>
          {sent ? (
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm py-2">
              <span>✓</span> Inscrit ! On vous contacte dès l'ouverture.
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSent(true) }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-navy text-sm font-bold hover:bg-white/90 transition-colors shrink-0"
                style={{ color: '#730D26' }}
              >
                <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>

        {/* Social */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {socials.map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}

        {/* Contact */}
        {settings.contact_email && (
          <p className="mt-6 text-white/35 text-xs">
            Questions ?{' '}
            <a href={`mailto:${settings.contact_email}`} className="text-white/60 hover:text-white underline transition-colors">
              {settings.contact_email}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
