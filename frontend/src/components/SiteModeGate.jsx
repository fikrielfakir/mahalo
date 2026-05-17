import { useEffect, useState, useCallback } from 'react'
import ComingSoonPage from '../pages/ComingSoonPage'
import MaintenancePage from '../pages/MaintenancePage'
import ServerOfflinePage from '../pages/ServerOfflinePage'

const BYPASS_KEY   = 'mahalo_admin_bypass'
const SETTINGS_URL = '/api/v1/public-settings'
const CACHE_TTL    = 60_000 // 1 minute

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
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // Network error or timeout — server is not reachable
    return { settings: {}, serverDown: true }
  }

  // Any non-2xx response (500 included) — the body may be HTML, not JSON
  if (!res.ok) {
    return { settings: {}, serverDown: true }
  }

  let json
  try {
    json = await res.json()
  } catch {
    // Body isn't valid JSON (e.g. PHP error page) — treat as server down
    return { settings: {}, serverDown: true }
  }

  cache     = json.data || {}
  cacheTime = now
  return { settings: cache, serverDown: false }
}

export default function SiteModeGate({ children }) {
  const [status, setStatus]     = useState('loading') // 'loading' | 'ok' | 'maintenance' | 'coming_soon' | 'server_down'
  const [settings, setSettings] = useState({})

  // Admin bypass: ?bypass=1 sets a session flag so admins can preview the live site
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('bypass') === '1') {
      sessionStorage.setItem(BYPASS_KEY, '1')
    }
  }, [])

  const check = useCallback(() => {
    const bypass = sessionStorage.getItem(BYPASS_KEY) === '1'

    fetchSettings()
      .then(({ settings: s, serverDown }) => {
        if (serverDown) {
          cache = null // always re-fetch on next check
          setStatus('server_down')
          return
        }
        setSettings(s)
        if (bypass)                      { setStatus('ok');          return }
        if (s.maintenance_mode === '1')  { setStatus('maintenance'); return }
        if (s.coming_soon_mode  === '1') { setStatus('coming_soon'); return }
        setStatus('ok')
      })
      .catch(() => {
        // Last-resort safety net — never leave the gate stuck on null
        cache = null
        setStatus('server_down')
      })
  }, [])

  useEffect(() => { check() }, [check])

  // Called by ServerOfflinePage when a ping succeeds
  const handleRecover = useCallback(() => {
    cache = null
    setStatus('loading')
    check()
  }, [check])

  if (status === 'loading') return null

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
