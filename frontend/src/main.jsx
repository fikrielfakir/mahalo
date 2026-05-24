import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './i18n.js'
import './index.css'

// One-time migration: remove sensitive keys that were previously stored in
// localStorage. They are now in sessionStorage (tokens) or in-memory (favorites).
;(function cleanLegacyStorage() {
  const stale = [
    'user_token', 'admin_token',
    'mahalo_favorites',
    'mahalo_settings', 'mahalo_settings_ar', 'mahalo_settings_fr',
    'mahalo_settings_en', 'mahalo_settings_es', 'mahalo_settings_default',
  ]
  stale.forEach(k => { try { localStorage.removeItem(k) } catch {} })
})()

const rootEl = document.getElementById('root')

if (rootEl.innerHTML && rootEl.innerHTML.length > 100) {
  ReactDOM.hydrateRoot(
    rootEl,
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  )
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  )
}
