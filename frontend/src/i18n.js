import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import frCommon from './locales/fr/common.json'
import esCommon from './locales/es/common.json'
import arCommon from './locales/ar/common.json'

const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar']
const RTL_LOCALES = ['ar']

const USER_LANG_KEY  = 'mahalo_lang'
const ADMIN_LANG_KEY = 'mahalo_admin_lang'

function applyDirection(lng) {
  if (typeof document === 'undefined') return
  const dir = RTL_LOCALES.includes(lng) ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng

  if (RTL_LOCALES.includes(lng)) {
    document.documentElement.classList.add('rtl')
  } else {
    document.documentElement.classList.remove('rtl')
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      fr: { common: frCommon },
      es: { common: esCommon },
      ar: { common: arCommon },
    },
    defaultNS: 'common',
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: USER_LANG_KEY,
      caches: [],
    },
  })

applyDirection(i18n.language)

async function fetchAndApplyOverrides(lng) {
  if (!SUPPORTED_LOCALES.includes(lng)) return
  try {
    const res = await fetch(`/api/v1/translations/${lng}`)
    if (!res.ok) return
    const json = await res.json()
    if (json?.data) {
      i18n.addResourceBundle(lng, 'common', json.data, true, true)
    }
  } catch {
    // silently ignore — bundled JSON is the fallback
  }
}

fetchAndApplyOverrides(i18n.language)

i18n.on('languageChanged', (lng) => {
  applyDirection(lng)
  fetchAndApplyOverrides(lng)
})

export { SUPPORTED_LOCALES, RTL_LOCALES, USER_LANG_KEY, ADMIN_LANG_KEY, applyDirection }
export default i18n
