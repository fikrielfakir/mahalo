import { Smartphone } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>

        {/* ── Dark luxury card ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            minHeight: '300px',
            background: 'linear-gradient(118deg, #070003 0%, #130108 22%, #1e020c 50%, #2b0411 72%, #1a0208 100%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Glow orbs */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'-50%', left:'-8%', width:'55%', height:'200%', background:'radial-gradient(ellipse, rgba(186,25,50,0.42) 0%, transparent 58%)', filter:'blur(64px)' }} />
            <div style={{ position:'absolute', top:'5%', left:'28%', width:'55%', height:'110%', background:'radial-gradient(ellipse, rgba(115,13,38,0.30) 0%, transparent 58%)', filter:'blur(52px)' }} />
            <div style={{ position:'absolute', top:'-30%', right:'-4%', width:'45%', height:'140%', background:'radial-gradient(ellipse, rgba(186,25,50,0.22) 0%, transparent 60%)', filter:'blur(48px)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top, rgba(7,0,3,0.70), transparent)' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(to bottom, rgba(7,0,3,0.50), transparent)' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)' }} />
          </div>

          {/* ── LEFT: Text (42%) ── */}
          <div style={{ position:'relative', zIndex:10, padding:'52px 48px 52px 52px', flex:'0 0 42%', maxWidth:'42%' }}>

            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'24px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'999px', padding:'7px 18px', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)' }}>
              <Smartphone size={11} color="#BA1932" />
              <span style={{ color:'rgba(255,255,255,0.58)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.13em' }}>Agentz Mobile App</span>
            </div>

            {/* Heading */}
            <h2 style={{ fontFamily:"'Plus Jakarta Sans', Inter, sans-serif", fontSize:'clamp(2rem, 3vw, 2.9rem)', fontWeight:800, color:'#fff', lineHeight:1.12, letterSpacing:'-0.02em', marginBottom:'16px', textShadow:'0 2px 40px rgba(186,25,50,0.18)' }}>
              Your next home<br />
              <span style={{ WebkitTextFillColor:'transparent', WebkitBackgroundClip:'text', backgroundClip:'text', backgroundImage:'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #c0243e 100%)' }}>
                is in your hands
              </span>
            </h2>

            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'14px', lineHeight:1.78, marginBottom:'36px', maxWidth:'250px', letterSpacing:'0.01em' }}>
              Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
            </p>

            {/* Real store badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center' }}>
              <a
                href="#"
                style={{ display:'block', transition:'all 0.22s ease', borderRadius:'10px', overflow:'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.filter='brightness(1)' }}
              >
                <img src="/badge-appstore.png" alt="Download on the App Store" style={{ height:'44px', width:'auto', display:'block' }} />
              </a>
              <a
                href="#"
                style={{ display:'block', transition:'all 0.22s ease', borderRadius:'10px', overflow:'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.filter='brightness(1)' }}
              >
                <img src="/badge-playstore.png" alt="Get it on Google Play" style={{ height:'44px', width:'auto', display:'block' }} />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex:'1' }} />
        </div>

        {/* ── PHONE MOCKUP — exact positioning as specified ── */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            bottom: '-80px',
            width: '74%',
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            right: '-60px',
          }}
        >
          {/* Warm red glow behind phone */}
          <div style={{ position:'absolute', inset:'5% 5%', background:'radial-gradient(ellipse at 50% 50%, rgba(186,25,50,0.32) 0%, transparent 60%)', filter:'blur(40px)', zIndex:0 }} />

          <img
            src="/app-mockup.png"
            alt="Agentz Mobile App"
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'right center',
              filter: 'drop-shadow(0 48px 96px rgba(115,13,38,0.75)) drop-shadow(0 16px 40px rgba(0,0,0,0.65))',
            }}
          />
        </div>

      </div>
    </section>
  )
}
