import { Smartphone, Apple, Play } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-4xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d0105 0%, #1a0208 30%, #2a0410 60%, #1a0208 100%)',
            minHeight: '360px',
          }}
        >
          {/* Ambient glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute rounded-full animate-pulse-glow"
              style={{
                top: '-20%', left: '-5%',
                width: '55%', height: '100%',
                background: 'radial-gradient(circle, rgba(186,25,50,0.30) 0%, transparent 65%)',
                filter: 'blur(50px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                bottom: '-30%', right: '25%',
                width: '40%', height: '80%',
                background: 'radial-gradient(circle, rgba(115,13,38,0.22) 0%, transparent 65%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute rounded-full animate-pulse-glow"
              style={{
                top: '20%', right: '5%',
                width: '30%', height: '60%',
                background: 'radial-gradient(circle, rgba(186,25,50,0.12) 0%, transparent 65%)',
                filter: 'blur(36px)',
                animationDelay: '2s',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center p-8 sm:p-10 lg:p-14">

            {/* Left — text */}
            <div className="max-w-md">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 mb-6"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '999px',
                  padding: '5px 14px',
                }}
              >
                <Smartphone size={12} style={{ color: '#BA1932' }} />
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-widest">Agentz Mobile App</span>
              </div>

              {/* Heading */}
              <h2
                className="font-bold text-white leading-tight mb-4"
                style={{
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                Your next home<br />
                <span style={{
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(135deg, #BA1932 0%, #f5748a 60%, #BA1932 100%)',
                }}>
                  is in your hands
                </span>
              </h2>

              <p className="text-white/45 text-sm leading-relaxed mb-8" style={{ maxWidth: '320px' }}>
                Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
              </p>

              {/* Store buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    borderRadius: '14px',
                    padding: '10px 18px',
                  }}
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
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    borderRadius: '14px',
                    padding: '10px 18px',
                  }}
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

            {/* Right — phone + QR mockup image */}
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src="/app-mockup.png"
                alt="Mahalo Mobile App"
                className="w-full max-w-sm lg:max-w-md xl:max-w-lg object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 32px 64px rgba(115,13,38,0.45))',
                  transform: 'translateY(-8px)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
