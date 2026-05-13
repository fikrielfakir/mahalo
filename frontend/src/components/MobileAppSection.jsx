import { Smartphone, Apple, Play } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Outer wrapper — overflow visible so phone can poke out */}
        <div className="relative" style={{ paddingBottom: '60px' }}>

          {/* Dark card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0d0105 0%, #1a0208 30%, #2a0410 60%, #1a0208 100%)',
              minHeight: '320px',
            }}
          >
            {/* Glow orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute rounded-full" style={{ top: '-20%', left: '-5%', width: '55%', height: '140%', background: 'radial-gradient(circle, rgba(186,25,50,0.32) 0%, transparent 65%)', filter: 'blur(55px)' }} />
              <div className="absolute rounded-full" style={{ bottom: '-30%', right: '20%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(115,13,38,0.22) 0%, transparent 65%)', filter: 'blur(40px)' }} />
              <div className="absolute rounded-full" style={{ top: '0%', right: '0%', width: '50%', height: '100%', background: 'radial-gradient(circle, rgba(186,25,50,0.14) 0%, transparent 65%)', filter: 'blur(40px)' }} />
            </div>

            {/* Text content */}
            <div className="relative z-10 pl-10 lg:pl-14 py-12 pr-6" style={{ maxWidth: '380px' }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '5px 14px' }}>
                <Smartphone size={12} style={{ color: '#BA1932' }} />
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-widest">Agentz Mobile App</span>
              </div>

              {/* Heading */}
              <h2 className="font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '-0.01em' }}>
                Your next home<br />
                <span style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 60%, #BA1932 100%)' }}>
                  is in your hands
                </span>
              </h2>

              <p className="text-white/45 text-sm leading-relaxed mb-8" style={{ maxWidth: '270px' }}>
                Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
              </p>

              {/* Store buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '14px', padding: '10px 18px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Apple size={20} className="text-white" />
                  <div className="text-left">
                    <div className="text-white/45 text-[10px] leading-none mb-0.5">Download on the</div>
                    <div className="text-white text-sm font-bold">App Store</div>
                  </div>
                </button>

                <button
                  className="flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '14px', padding: '10px 18px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Play size={18} className="text-white fill-white" />
                  <div className="text-left">
                    <div className="text-white/45 text-[10px] leading-none mb-0.5">GET IT ON</div>
                    <div className="text-white text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Phone mockup — positioned outside overflow-hidden card so it can overflow */}
          <div
            className="hidden md:block absolute"
            style={{
              right: '2%',
              bottom: '0px',
              width: '58%',
              maxWidth: '680px',
              pointerEvents: 'none',
            }}
          >
            <img
              src="/app-mockup.png"
              alt="Agentz Mobile App"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 60px rgba(115,13,38,0.55))',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
