import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import frCommon from './locales/fr/common.json'
import esCommon from './locales/es/common.json'
import arCommon from './locales/ar/common.json'

const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar']
const RTL_LOCALES = ['ar']

function applyDirection(lng) {
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
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mahalo_lang',
      caches: ['localStorage'],
    },
  })

applyDirection(i18n.language)

i18n.on('languageChanged', (lng) => {
  applyDirection(lng)
})

export { SUPPORTED_LOCALES, RTL_LOCALES }
export default i18n
