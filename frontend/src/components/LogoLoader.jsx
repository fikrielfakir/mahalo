import logo from '/logo.png'

export default function LogoLoader({ dark = false, label = null, fullScreen = true }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-16'

  const bg = fullScreen
    ? (dark
        ? { background: 'linear-gradient(135deg, #730D26 0%, #3a0614 60%, #1a0009 100%)' }
        : { background: '#f9fafb' })
    : {}

  return (
    <div className={wrapper} style={bg}>
      <div className="flex flex-col items-center gap-4">
        <div style={{ animation: 'mahalo-pulse 1.6s ease-in-out infinite' }}>
          <img
            src={logo}
            alt="Loading…"
            style={{
              height: 56,
              width: 'auto',
              filter: dark ? 'brightness(0) invert(1)' : 'none',
              animation: 'mahalo-breathe 1.6s ease-in-out infinite',
            }}
          />
        </div>
        {label && (
          <p
            className="text-sm font-medium"
            style={{
              color: dark ? 'rgba(255,255,255,0.55)' : '#9ca3af',
              animation: 'mahalo-fade 1.6s ease-in-out infinite',
            }}
          >
            {label}
          </p>
        )}
      </div>

      <style>{`
        @keyframes mahalo-breathe {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.55; transform: scale(0.88); }
        }
        @keyframes mahalo-fade {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
