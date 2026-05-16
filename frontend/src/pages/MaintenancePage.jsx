import { Wrench, Mail, Phone, RefreshCw } from 'lucide-react'

export default function MaintenancePage({ settings = {} }) {
  const siteName = settings.site_name || 'Mahalo'
  const message  = settings.maintenance_message
    || 'Notre site est temporairement hors ligne pour maintenance. Nous serons de retour très bientôt.'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #730D26 0%, #3a0614 60%, #1a0009 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(120px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#BA1932', filter: 'blur(120px)', transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">

        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <img src="/logo-light.png" alt={siteName} className="h-10 object-contain" onError={e => { e.target.style.display = 'none' }} />
        </div>

        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Wrench size={38} className="text-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          En maintenance
        </h1>
        <p className="text-white/65 text-base leading-relaxed mb-10 max-w-sm mx-auto">
          {message}
        </p>

        {/* Info card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-6 text-left space-y-4">
          <p className="text-white/80 text-sm font-semibold text-center mb-5">
            Besoin d'aide pendant ce temps ?
          </p>
          {settings.contact_phone && (
            <a
              href={`tel:${settings.contact_phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Téléphone</p>
                <p className="text-white text-sm font-semibold">{settings.contact_phone}</p>
              </div>
            </a>
          )}
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Mail size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Email</p>
                <p className="text-white text-sm font-semibold">{settings.contact_email}</p>
              </div>
            </a>
          )}
        </div>

        {/* Refresh hint */}
        <button
          onClick={() => window.location.reload()}
          className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white/60 hover:text-white hover:bg-white/15 text-sm font-medium transition-all mx-auto"
        >
          <RefreshCw size={14} /> Rafraîchir la page
        </button>
      </div>
    </div>
  )
}
