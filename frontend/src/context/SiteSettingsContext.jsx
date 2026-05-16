import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const SiteSettingsContext = createContext({})

const CACHE_KEY = 'mahalo_settings'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return data
    return null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => readCache() || {})

  useEffect(() => {
    axios.get('/api/v1/public-settings')
      .then(r => {
        const data = r.data?.data || r.data || {}
        if (Object.keys(data).length) {
          writeCache(data)
          setSettings(data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
