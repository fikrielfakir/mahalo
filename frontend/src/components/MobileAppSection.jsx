import { Smartphone } from 'lucide-react'

function QRCodeSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Top-left finder */}
      <rect x="5" y="5" width="28" height="28" rx="3" fill="white"/>
      <rect x="9" y="9" width="20" height="20" rx="2" fill="#8B0000"/>
      <rect x="13" y="13" width="12" height="12" rx="1" fill="white"/>
      {/* Top-right finder */}
      <rect x="67" y="5" width="28" height="28" rx="3" fill="white"/>
      <rect x="71" y="9" width="20" height="20" rx="2" fill="#8B0000"/>
      <rect x="75" y="13" width="12" height="12" rx="1" fill="white"/>
      {/* Bottom-left finder */}
      <rect x="5" y="67" width="28" height="28" rx="3" fill="white"/>
      <rect x="9" y="71" width="20" height="20" rx="2" fill="#8B0000"/>
      <rect x="13" y="75" width="12" height="12" rx="1" fill="white"/>
      {/* Data cells */}
      <rect x="38" y="5" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="5" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="5" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="13" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="13" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="21" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="29" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="29" width="6" height="6" rx="1" fill="white"/>
      <rect x="5" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="13" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="29" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="62" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="78" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="86" y="38" width="6" height="6" rx="1" fill="white"/>
      <rect x="5" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="21" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="70" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="86" y="46" width="6" height="6" rx="1" fill="white"/>
      <rect x="13" y="54" width="6" height="6" rx="1" fill="white"/>
      <rect x="29" y="54" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="54" width="6" height="6" rx="1" fill="white"/>
      <rect x="62" y="54" width="6" height="6" rx="1" fill="white"/>
      <rect x="78" y="54" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="62" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="62" width="6" height="6" rx="1" fill="white"/>
      <rect x="70" y="62" width="6" height="6" rx="1" fill="white"/>
      <rect x="86" y="62" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="70" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="70" width="6" height="6" rx="1" fill="white"/>
      <rect x="62" y="70" width="6" height="6" rx="1" fill="white"/>
      <rect x="78" y="78" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="78" width="6" height="6" rx="1" fill="white"/>
      <rect x="54" y="78" width="6" height="6" rx="1" fill="white"/>
      <rect x="70" y="86" width="6" height="6" rx="1" fill="white"/>
      <rect x="46" y="86" width="6" height="6" rx="1" fill="white"/>
      <rect x="86" y="86" width="6" height="6" rx="1" fill="white"/>
      <rect x="38" y="86" width="6" height="6" rx="1" fill="white"/>
      <rect x="62" y="86" width="6" height="6" rx="1" fill="white"/>
    </svg>
  )
}

export default function MobileAppSection() {
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

            {/* ── Right spacer so card has width for phone + QR ── */}
            <div className="hidden sm:block flex-shrink-0" style={{ width: '50%' }} />
          </div>

          {/* ── Phone + QR — absolutely positioned to overflow card ── */}
          <div className="hidden sm:flex absolute items-end gap-4 lg:gap-6"
            style={{ right: '3%', bottom: 0, top: '-18px', zIndex: 20 }}>

            {/* Phone */}
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

            {/* QR Code card */}
            <div className="relative self-center mb-4 flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, #9B0E25 0%, #BA1932 50%, #8B0A1F 100%)',
                borderRadius: '18px',
                padding: '16px',
                width: '130px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 4px 16px rgba(186,25,50,0.40)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
              {/* QR */}
              <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden p-1.5"
                style={{ background: '#8B0A1F' }}>
                <QRCodeSVG />
              </div>
              <p style={{ color:'rgba(255,255,255,0.92)', fontSize:'10px', fontWeight:600, textAlign:'center', lineHeight:1.3 }}>
                Scan to download<br />the Agentz app
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
