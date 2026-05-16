import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import AppSSR from './AppSSR.jsx'

export async function render(url) {
  const helmetContext = {}
  let html = ''

  try {
    html = renderToString(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppSSR />
        </StaticRouter>
      </HelmetProvider>
    )
  } catch (err) {
    console.error('[SSR] Render error for', url, '—', err.message)
  }

  const { helmet } = helmetContext
  return { html, helmet }
}
