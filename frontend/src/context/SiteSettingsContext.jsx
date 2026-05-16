import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import i18n from '../i18n'

const SiteSettingsContext = createContext({})

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function cacheKey(locale) {
  return `mahalo_settings_${locale || 'default'}`
}

function readCache(locale) {
  try {
    const raw = localStorage.getItem(cacheKey(locale))
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return data
    return null
  } catch {
    return null
  }
}

function writeCache(locale, data) {
  try {
    localStorage.setItem(cacheKey(locale), JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export function SiteSettingsProvider({ children }) {
  const locale = i18n.language?.split('-')[0] || 'fr'
  const [settings, setSettings] = useState(() => readCache(locale) || readCache('default') || {})

  useEffect(() => {
    const params = locale ? `?locale=${locale}` : ''
    axios.get(`/api/v1/public-settings${params}`)
      .then(r => {
        const data = r.data?.data || r.data || {}
        if (Object.keys(data).length) {
          writeCache(locale, data)
          setSettings(data)
        }
      })
      .catch(() => {})
  }, [locale])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
