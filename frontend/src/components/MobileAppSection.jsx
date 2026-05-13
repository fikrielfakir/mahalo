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
            minHeight: '280px',
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

          {/* ── LEFT: Text (40%) ── */}
          <div style={{ position:'relative', zIndex:10, padding:'52px 48px 52px 52px', flex:'0 0 40%', maxWidth:'40%' }}>

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

            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'14px', lineHeight:1.78, marginBottom:'36px', maxWidth:'240px', letterSpacing:'0.01em' }}>
              Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
            </p>

            {/* Store buttons */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {[
                { Icon: Apple, iconSize: 20, sub: 'Download on the', label: 'App Store', fill: false },
                { Icon: Play,  iconSize: 17, sub: 'GET IT ON',       label: 'Google Play', fill: true },
              ].map(({ Icon, iconSize, sub, label, fill }) => (
                <button
                  key={label}
                  style={{ display:'flex', alignItems:'center', gap:'12px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'14px', padding:'12px 22px', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', boxShadow:'0 4px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09)', cursor:'pointer', transition:'all 0.22s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.30)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <Icon size={iconSize} color="#fff" fill={fill ? '#fff' : 'none'} />
                  <div style={{ textAlign:'left' }}>
                    <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'10px', lineHeight:1, marginBottom:'3px', fontWeight:500 }}>{sub}</div>
                    <div style={{ color:'#fff', fontSize:'14px', fontWeight:700, letterSpacing:'-0.01em' }}>{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT spacer — reserves space so card is wide enough ── */}
          <div style={{ flex:'1' }} />
        </div>

        {/* ── PHONE MOCKUP — outside the card, overflows top & bottom ── */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            right: '-10px',
            bottom: '-70px',
            width: '62%',
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Red glow behind the phone */}
          <div style={{ position:'absolute', inset:'5% 0', background:'radial-gradient(ellipse at 40% 50%, rgba(186,25,50,0.35) 0%, transparent 60%)', filter:'blur(36px)', zIndex:0 }} />

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
