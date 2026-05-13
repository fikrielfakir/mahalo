import { Smartphone, Apple, Play } from 'lucide-react'

const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=000000&bgcolor=ffffff&data=https://agentz.app&format=png'

export default function MobileAppSection() {
  return (
    <section style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>

        {/* ═══════════════════════════════════════
            DARK LUXURY CARD
        ═══════════════════════════════════════ */}
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
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* Left warm bloom */}
            <div style={{ position:'absolute', top:'-50%', left:'-8%', width:'55%', height:'200%', background:'radial-gradient(ellipse, rgba(186,25,50,0.42) 0%, transparent 58%)', filter:'blur(64px)' }} />
            {/* Center red haze */}
            <div style={{ position:'absolute', top:'5%', left:'28%', width:'50%', height:'110%', background:'radial-gradient(ellipse, rgba(115,13,38,0.32) 0%, transparent 58%)', filter:'blur(52px)' }} />
            {/* Right subtle glow */}
            <div style={{ position:'absolute', top:'-30%', right:'-4%', width:'38%', height:'140%', background:'radial-gradient(ellipse, rgba(186,25,50,0.16) 0%, transparent 60%)', filter:'blur(44px)' }} />
            {/* Bottom vignette */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top, rgba(7,0,3,0.70), transparent)' }} />
            {/* Top edge vignette */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(to bottom, rgba(7,0,3,0.50), transparent)' }} />
            {/* Glossy top highlight line */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)' }} />
          </div>

          {/* ── LEFT: Text content (~38%) ── */}
          <div style={{ position:'relative', zIndex:10, padding:'56px 48px 56px 52px', flex:'0 0 38%', maxWidth:'38%' }}>

            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'26px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'999px', padding:'7px 18px', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)' }}>
              <Smartphone size={11} color="#BA1932" />
              <span style={{ color:'rgba(255,255,255,0.58)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.13em' }}>Agentz Mobile App</span>
            </div>

            {/* Heading */}
            <h2 style={{ fontFamily:"'Plus Jakarta Sans', Inter, sans-serif", fontSize:'clamp(1.9rem, 2.8vw, 2.75rem)', fontWeight:800, color:'#fff', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:'16px', textShadow:'0 2px 40px rgba(186,25,50,0.18)' }}>
              Your next home<br />
              <span style={{ WebkitTextFillColor:'transparent', WebkitBackgroundClip:'text', backgroundClip:'text', backgroundImage:'linear-gradient(130deg, #BA1932 0%, #f07088 55%, #c0243e 100%)' }}>
                is in your hands
              </span>
            </h2>

            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'14px', lineHeight:1.78, marginBottom:'36px', maxWidth:'255px', letterSpacing:'0.01em' }}>
              Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
            </p>

            {/* Store buttons */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {[
                { Icon: Apple, iconSize: 20, sub: 'Download on the', label: 'App Store' },
                { Icon: Play,  iconSize: 17, sub: 'GET IT ON',       label: 'Google Play', fill: true },
              ].map(({ Icon, iconSize, sub, label, fill }) => (
                <button
                  key={label}
                  style={{ display:'flex', alignItems:'center', gap:'12px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'14px', padding:'12px 22px', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', boxShadow:'0 4px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09)', cursor:'pointer', transition:'all 0.22s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.30)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09)' }}
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

          {/* Spacer: phone column placeholder keeps card width correct */}
          <div style={{ flex:'0 0 42%', maxWidth:'42%' }} />

          {/* ── RIGHT: QR Code card (~20%) ── */}
          <div style={{ position:'relative', zIndex:10, flex:'0 0 20%', maxWidth:'20%', display:'flex', alignItems:'center', justifyContent:'center', paddingRight:'36px' }}>
            <div
              style={{
                background:'rgba(115,13,38,0.38)',
                border:'1px solid rgba(255,255,255,0.15)',
                borderRadius:'22px',
                padding:'22px 20px 20px',
                backdropFilter:'blur(20px)',
                WebkitBackdropFilter:'blur(20px)',
                boxShadow:'0 8px 40px rgba(115,13,38,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                textAlign:'center',
                minWidth:'150px',
              }}
            >
              {/* QR code image */}
              <div style={{ background:'#fff', borderRadius:'12px', padding:'10px', marginBottom:'14px', display:'inline-block' }}>
                <img
                  src={QR_URL}
                  alt="QR code"
                  width="120"
                  height="120"
                  style={{ display:'block', borderRadius:'6px' }}
                />
              </div>
              <p style={{ color:'rgba(255,255,255,0.70)', fontSize:'12px', lineHeight:1.5, margin:0, fontWeight:500 }}>
                Scan to download<br />
                the <span style={{ color:'#BA1932', fontWeight:700 }}>Agentz</span> app
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PHONE MOCKUP — sibling of card,
            overflows top & bottom by 60 px
        ═══════════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            bottom: '-60px',
            left: '36%',
            width: '38%',
            pointerEvents: 'none',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Warm glow behind phone */}
          <div style={{ position:'absolute', inset:'0 5%', background:'radial-gradient(ellipse at center, rgba(186,25,50,0.32) 0%, transparent 62%)', filter:'blur(32px)', zIndex:0 }} />

          {/* Phone image */}
          <img
            src="/app-mockup.png"
            alt="Agentz Mobile App"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 44px 88px rgba(115,13,38,0.72)) drop-shadow(0 14px 36px rgba(0,0,0,0.60))',
            }}
          />

          {/* Floor reflection */}
          <div style={{ position:'absolute', bottom:'-4px', left:'18%', right:'18%', height:'26px', background:'radial-gradient(ellipse, rgba(186,25,50,0.28) 0%, transparent 72%)', filter:'blur(14px)', zIndex:2 }} />
        </div>

      </div>
    </section>
  )
}
