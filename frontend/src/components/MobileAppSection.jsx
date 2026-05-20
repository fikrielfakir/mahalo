import { Smartphone } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section className="px-4 xs:px-5 py-10 sm:py-20">
      <div className="max-w-7xl mx-auto">

        {/* ── Dark luxury card ── */}
        <div
          className="relative rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center"
          style={{
            minHeight: '260px',
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
              Your next home<br />
              <span style={{ WebkitTextFillColor:'transparent', WebkitBackgroundClip:'text', backgroundClip:'text', backgroundImage:'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #c0243e 100%)' }}>
                is in your hands
              </span>
            </h2>

            <p className="text-white/40 text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs">
              Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
            </p>

            {/* Store badges */}
            <div className="flex flex-wrap gap-3 items-center">
              <a href="#" className="block rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                <img src="/badge-appstore.png" alt="Download on the App Store" className="h-10 sm:h-11 w-auto" />
              </a>
              <a href="#" className="block rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                <img src="/badge-playstore.png" alt="Get it on Google Play" className="h-10 sm:h-11 w-auto" />
              </a>
            </div>
          </div>

          {/* ── Phone mockup ── */}
          <div className="relative z-10 hidden sm:flex flex-shrink-0 items-end justify-end self-stretch w-[45%] overflow-hidden">
            <div className="absolute inset-0"
              style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(186,25,50,0.28) 0%, transparent 65%)', filter:'blur(40px)' }} />
            <img
              src="/app-mockup.png"
              alt="Agentz Mobile App"
              className="relative z-10 h-[120%] w-auto max-w-none object-contain object-right-bottom"
              style={{ filter:'drop-shadow(0 32px 64px rgba(115,13,38,0.70)) drop-shadow(0 12px 32px rgba(0,0,0,0.60))' }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
