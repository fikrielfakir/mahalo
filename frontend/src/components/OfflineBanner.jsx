import { useEffect, useState } from 'react'
import { WifiOff, X, Wifi } from 'lucide-react'

export default function OfflineBanner({ offline }) {
  const [visible, setVisible]     = useState(false)
  const [restored, setRestored]   = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (offline) {
      setRestored(false)
      setDismissed(false)
      // Small delay so the animation plays cleanly on entry
      const t = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(t)
    } else if (visible) {
      // Was showing → now back online
      setRestored(true)
      const t = setTimeout(() => setVisible(false), 2500)
      return () => clearTimeout(t)
    }
  }, [offline])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        zIndex:     9999,
        transform:  dismissed ? 'translateY(-110%)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '10px',
          padding:        '10px 16px',
          background:     restored ? '#064e3b' : '#78350f',
          borderBottom:   `1px solid ${restored ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
          boxShadow:      '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Icon */}
        <span style={{ flexShrink: 0 }}>
          {restored
            ? <Wifi    size={15} color="#6ee7b7" />
            : <WifiOff size={15} color="#fcd34d" />
          }
        </span>

        {/* Message */}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: restored ? '#a7f3d0' : '#fde68a', lineHeight: 1.4 }}>
          {restored
            ? 'Connection restored — you\'re back online.'
            : 'You\'re offline — check your Wi-Fi or mobile data. Some features may not work.'}
        </span>

        {/* Dismiss (only while offline) */}
        {!restored && (
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            style={{
              flexShrink:      0,
              background:      'none',
              border:          'none',
              cursor:          'pointer',
              padding:         '2px',
              color:           '#fcd34d',
              opacity:         0.7,
              display:         'flex',
              alignItems:      'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
