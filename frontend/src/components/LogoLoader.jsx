import logo from '/logo.png'

export default function LogoLoader({ dark = false, label = null, fullScreen = true }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-16'

  return (
    <div className={wrapper}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
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
          50%       { opacity: 0.45; transform: scale(0.87); }
        }
        @keyframes mahalo-fade {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
