import { Smartphone, Apple, Play } from 'lucide-react'

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
            minHeight: '320px',
            background: 'linear-gradient(120deg, #070003 0%, #130108 25%, #1e020c 50%, #2b0411 70%, #1a0208 100%)',
          }}
        >
          {/* Glow orbs */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'-40%', left:'-10%', width:'60%', height:'180%', background:'radial-gradient(ellipse, rgba(186,25,50,0.40) 0%, transparent 60%)', filter:'blur(60px)' }} />
            <div style={{ position:'absolute', top:'10%', left:'30%', width:'45%', height:'100%', background:'radial-gradient(ellipse, rgba(115,13,38,0.30) 0%, transparent 60%)', filter:'blur(50px)' }} />
            <div style={{ position:'absolute', top:'-20%', right:'-5%', width:'40%', height:'120%', background:'radial-gradient(ellipse, rgba(186,25,50,0.18) 0%, transparent 60%)', filter:'blur(44px)' }} />
            {/* Glossy top highlight */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 60%, transparent)' }} />
            {/* Bottom vignette */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', background:'linear-gradient(to top, rgba(7,0,3,0.65), transparent)' }} />
          </div>

          {/* Text content */}
          <div style={{ position:'relative', zIndex:10, padding:'56px 52px 56px 52px', maxWidth:'420px' }}>
            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'24px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'999px', padding:'6px 16px', backdropFilter:'blur(12px)' }}>
              <Smartphone size={11} color="#BA1932" />
              <span style={{ color:'rgba(255,255,255,0.60)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em' }}>Agentz Mobile App</span>
            </div>

            {/* Heading */}
            <h2 style={{ fontFamily:"'Plus Jakarta Sans', Inter, sans-serif", fontSize:'clamp(2rem, 3.5vw, 2.8rem)', fontWeight:800, color:'#fff', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:'18px', textShadow:'0 2px 40px rgba(186,25,50,0.20)' }}>
              Your next home<br />
              <span style={{ WebkitTextFillColor:'transparent', WebkitBackgroundClip:'text', backgroundClip:'text', backgroundImage:'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #BA1932 100%)' }}>
                is in your hands
              </span>
            </h2>

            <p style={{ color:'rgba(255,255,255,0.40)', fontSize:'14px', lineHeight:1.75, marginBottom:'36px', maxWidth:'255px', letterSpacing:'0.01em' }}>
              Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
            </p>

            {/* Store buttons */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {[
                { icon: <Apple size={20} color="#fff" />, sub: 'Download on the', label: 'App Store' },
                { icon: <Play size={17} color="#fff" fill="#fff" />, sub: 'GET IT ON', label: 'Google Play' },
              ].map(({ icon, sub, label }) => (
                <button
                  key={label}
                  style={{ display:'flex', alignItems:'center', gap:'12px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'14px', padding:'11px 20px', backdropFilter:'blur(16px)', boxShadow:'0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.28)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  {icon}
                  <div style={{ textAlign:'left' }}>
                    <div style={{ color:'rgba(255,255,255,0.40)', fontSize:'10px', lineHeight:1, marginBottom:'3px', fontWeight:500 }}>{sub}</div>
                    <div style={{ color:'#fff', fontSize:'14px', fontWeight:700, letterSpacing:'-0.01em' }}>{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Phone mockup — sibling of card, positioned to overflow top & bottom ── */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '2%',
            bottom: '-60px',
            width: '54%',
            maxWidth: '640px',
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Ambient glow behind phone */}
          <div style={{ position:'absolute', inset:'0 10%', background:'radial-gradient(ellipse at center, rgba(186,25,50,0.28) 0%, transparent 65%)', filter:'blur(35px)' }} />

          {/* Phone image */}
          <img
            src="/app-mockup.png"
            alt="Agentz Mobile App"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 40px 80px rgba(115,13,38,0.70)) drop-shadow(0 12px 32px rgba(0,0,0,0.55))',
              zIndex: 1,
            }}
          />

          {/* Floor reflection glow */}
          <div style={{ position:'absolute', bottom:'-10px', left:'20%', right:'20%', height:'28px', background:'radial-gradient(ellipse, rgba(186,25,50,0.30) 0%, transparent 70%)', filter:'blur(14px)' }} />
        </div>

      </div>
    </section>
  )
}
