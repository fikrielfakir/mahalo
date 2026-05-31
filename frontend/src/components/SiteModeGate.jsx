import { useEffect, useState, useCallback, useRef } from 'react'
import ComingSoonPage from '../pages/ComingSoonPage'
import MaintenancePage from '../pages/MaintenancePage'
import ServerOfflinePage from '../pages/ServerOfflinePage'
import { SiteGateSkeleton } from './Skeletons'

const BYPASS_KEY   = 'mahalo_admin_bypass'
const SETTINGS_URL = '/api/v1/public-settings'
const CACHE_TTL    = 60_000  // 1 minute
const MAX_RETRIES  = 4       // silent retries before showing the error page
const RETRY_DELAY  = 2_500   // ms between retries

let cache     = null
let cacheTime = 0

// Returns { settings, serverDown }
async function fetchSettings() {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) return { settings: cache, serverDown: false }

  let res
  try {
    res = await fetch(SETTINGS_URL, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000), // shorter per-attempt timeout
    })
  } catch {
    return { settings: {}, serverDown: true }
  }

  if (!res.ok) return { settings: {}, serverDown: true }

  let json
  try {
    json = await res.json()
  } catch {
    return { settings: {}, serverDown: true }
  }

  cache     = json.data || {}
  cacheTime = now
  return { settings: cache, serverDown: false }
}

export default function SiteModeGate({ children }) {
  const [status, setStatus]     = useState('loading')
  const [settings, setSettings] = useState({})
  const retryCount              = useRef(0)
  const retryTimer              = useRef(null)

  const check = useCallback((isRecovery = false) => {
    const bypass = sessionStorage.getItem(BYPASS_KEY) === '1'

    fetchSettings()
      .then(({ settings: s, serverDown }) => {
        if (serverDown) {
          cache = null

          if (isRecovery || retryCount.current >= MAX_RETRIES) {
            // Exhausted retries — show the error page
            setStatus('server_down')
          } else {
            // Keep showing skeleton, schedule a silent retry
            retryCount.current += 1
            retryTimer.current = setTimeout(() => check(false), RETRY_DELAY)
          }
          return
        }

        // Connected — reset retry counter and proceed
        retryCount.current = 0
        setSettings(s)
        if (bypass)                      { setStatus('ok');          return }
        if (s.maintenance_mode === '1')  { setStatus('maintenance'); return }
        if (s.coming_soon_mode  === '1') { setStatus('coming_soon'); return }
        setStatus('ok')
      })
      .catch(() => {
        cache = null

        if (isRecovery || retryCount.current >= MAX_RETRIES) {
          setStatus('server_down')
        } else {
          retryCount.current += 1
          retryTimer.current = setTimeout(() => check(false), RETRY_DELAY)
        }
      })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('bypass') === '1') {
      sessionStorage.setItem(BYPASS_KEY, '1')
    }
    check()
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current) }
  }, [check])

  const handleRecover = useCallback(() => {
    if (retryTimer.current) clearTimeout(retryTimer.current)
    retryCount.current = 0
    cache = null
    setStatus('loading')
    check(true)
  }, [check])

  if (status === 'loading') {
    return <SiteGateSkeleton />
  }

  if (status === 'server_down') {
    return (
      <div key="server_down" className="site-reveal">
        <ServerOfflinePage onRecover={handleRecover} />
      </div>
    )
  }

  if (status === 'maintenance') {
    return (
      <div key="maintenance" className="site-reveal">
        <MaintenancePage settings={settings} />
      </div>
    )
  }

  if (status === 'coming_soon') {
    return (
      <div key="coming_soon" className="site-reveal">
        <ComingSoonPage settings={settings} />
      </div>
    )
  }

  return (
    <div key="ok" className="site-reveal">
      {children}
    </div>
  )
}
