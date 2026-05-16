import logo from '/logo.png'

export default function LogoLoader({ dark = false, label = null, fullScreen = true }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center relative overflow-hidden'
    : 'flex items-center justify-center py-16'

  return (
    <div className={wrapper} style={fullScreen ? { background: 'rgba(255,255,255,0.92)' } : {}}>

      {/* Soft blurred blobs for depth */}
      {fullScreen && (
        <>
          <div style={{
            position: 'absolute', top: '-80px', left: '-80px',
            width: 340, height: 340, borderRadius: '50%',
            background: 'rgba(115,13,38,0.07)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: 280, height: 280, borderRadius: '50%',
            background: 'rgba(186,25,50,0.06)',
            filter: 'blur(50px)', pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Glass card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.75)',
        borderRadius: 24,
        padding: fullScreen ? '40px 52px' : '28px 40px',
        boxShadow: '0 8px 32px rgba(115,13,38,0.08), 0 1.5px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <img
          src={logo}
          alt="Loading…"
          style={{
            height: 52,
            width: 'auto',
            animation: 'mahalo-breathe 1.6s ease-in-out infinite',
          }}
        />
        {label && (
          <p style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(60,10,20,0.55)',
            animation: 'mahalo-fade 1.6s ease-in-out infinite',
            letterSpacing: '0.01em',
          }}>
            {label}
          </p>
        )}
      </div>

      <style>{`
        @keyframes mahalo-breathe {
          0%, 100% { opacity: 1;    transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.87); }
        }
        @keyframes mahalo-fade {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;  }
        }
      `}</style>
    </div>
  )
}
