import { Smartphone } from 'lucide-react'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function MobileAppSection() {
  const settings = useSiteSettings()

  if (settings.mobile_app_enabled === '0') return null

  const title       = settings.mobile_app_title       || 'Your next home'
  const subtitle    = settings.mobile_app_subtitle    || 'is in your hands'
  const description = settings.mobile_app_description || 'Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.'
  const appstoreUrl  = settings.mobile_app_appstore_url  || '#'
  const playstoreUrl = settings.mobile_app_playstore_url || '#'

  return (
    <section className="px-4 xs:px-5 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">

        {/* Outer wrapper — allows phone to overflow the card */}
        <div className="relative">

          {/* ── Dark luxury card ── */}
          <div
            className="relative rounded-3xl flex flex-col sm:flex-row items-center overflow-hidden"
            style={{
              minHeight: '240px',
              background: 'linear-gradient(118deg, #070003 0%, #130108 22%, #1e020c 50%, #2b0411 72%, #1a0208 100%)',
            }}
          >
            {/* Glow orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div style={{ position:'absolute', top:'-50%', left:'-8%', width:'55%', height:'200%', background:'radial-gradient(ellipse, rgba(186,25,50,0.42) 0%, transparent 58%)', filter:'blur(64px)' }} />
              <div style={{ position:'absolute', top:'5%', left:'28%', width:'55%', height:'110%', background:'radial-gradient(ellipse, rgba(115,13,38,0.30) 0%, transparent 58%)', filter:'blur(52px)' }} />
              <div style={{ position:'absolute', top:'-30%', right:'-4%', width:'45%', height:'140%', background:'radial-gradient(ellipse, rgba(186,25,50,0.22) 0%, transparent 60%)', filter:'blur(48px)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top, rgba(7,0,3,0.70), transparent)' }} />
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)' }} />
            </div>

            {/* ── Text content ── */}
            <div className="relative z-10 flex-1 px-6 py-10 sm:px-12 sm:py-14">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-5 sm:mb-6"
                style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'999px', padding:'6px 16px', backdropFilter:'blur(14px)' }}>
                <Smartphone size={11} color="#BA1932" />
                <span style={{ color:'rgba(255,255,255,0.58)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.13em' }}>Agentz Mobile App</span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 sm:mb-4"
                style={{ fontFamily:"'Plus Jakarta Sans', Inter, sans-serif", letterSpacing:'-0.02em' }}>
                {title}<br />
                <span style={{ WebkitTextFillColor:'transparent', WebkitBackgroundClip:'text', backgroundClip:'text', backgroundImage:'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #c0243e 100%)' }}>
                  {subtitle}
                </span>
              </h2>

              <p className="text-white/40 text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs">
                {description}
              </p>

              {/* Store badges */}
              <div className="flex flex-wrap gap-3 items-center">
                <a href={appstoreUrl} className="block rounded-xl overflow-hidden transition-all hover:-translate-y-0.5" target="_blank" rel="noreferrer">
                  <img src="/badge-appstore.png" alt="Download on the App Store" className="h-10 sm:h-11 w-auto" />
                </a>
                <a href={playstoreUrl} className="block rounded-xl overflow-hidden transition-all hover:-translate-y-0.5" target="_blank" rel="noreferrer">
                  <img src="/badge-playstore.png" alt="Get it on Google Play" className="h-10 sm:h-11 w-auto" />
                </a>
              </div>
            </div>

            {/* ── Right spacer so card has width for phone ── */}
            <div className="hidden sm:block flex-shrink-0" style={{ width: '44%' }} />
          </div>

          {/* ── Phone — absolutely positioned to overflow card ── */}
          <div className="hidden sm:flex absolute items-end"
            style={{ right: '6%', bottom: 0, top: '-18px', zIndex: 20 }}>
            <div className="relative flex items-end h-full">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background:'radial-gradient(ellipse at 50% 60%, rgba(186,25,50,0.35) 0%, transparent 65%)', filter:'blur(36px)' }} />
              <img
                src="/app-mockup.png"
                alt="Agentz Mobile App"
                style={{
                  height: '115%',
                  width: 'auto',
                  maxHeight: '420px',
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                  filter: 'drop-shadow(0 28px 56px rgba(115,13,38,0.75)) drop-shadow(0 8px 20px rgba(0,0,0,0.65))',
                  transform: 'rotate(-4deg)',
                  transformOrigin: 'bottom center',
                  position: 'relative',
                  zIndex: 10,
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
