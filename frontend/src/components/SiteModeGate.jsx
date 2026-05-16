import { useEffect, useState } from 'react'
import ComingSoonPage from '../pages/ComingSoonPage'
import MaintenancePage from '../pages/MaintenancePage'
import { SiteGateSkeleton } from './Skeletons'

const BYPASS_KEY  = 'mahalo_admin_bypass'
const SETTINGS_URL = '/api/v1/public-settings'
const CACHE_TTL    = 60_000 // 1 minute

let cache = null
let cacheTime = 0

async function fetchSettings() {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) return cache
  const res = await fetch(SETTINGS_URL, { headers: { Accept: 'application/json' } })
  const json = await res.json()
  cache = json.data || {}
  cacheTime = now
  return cache
}

export default function SiteModeGate({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'maintenance' | 'coming_soon'
  const [settings, setSettings] = useState({})

  // Admin bypass: ?bypass=1 sets a session flag, so admins can preview the live site
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('bypass') === '1') {
      sessionStorage.setItem(BYPASS_KEY, '1')
    }
  }, [])

  useEffect(() => {
    const bypass = sessionStorage.getItem(BYPASS_KEY) === '1'

    fetchSettings()
      .then(s => {
        setSettings(s)
        if (bypass) { setStatus('ok'); return }
        if (s.maintenance_mode === '1') { setStatus('maintenance'); return }
        if (s.coming_soon_mode === '1') { setStatus('coming_soon'); return }
        setStatus('ok')
      })
      .catch(() => setStatus('ok')) // fail open — never block the site on a fetch error
  }, [])

  if (status === 'loading') return <SiteGateSkeleton />

  if (status === 'maintenance') return <MaintenancePage settings={settings} />
  if (status === 'coming_soon') return <ComingSoonPage  settings={settings} />

  return children
}
