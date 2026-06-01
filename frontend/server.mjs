import express from 'express'
import compression from 'compression'
import { readFileSync } from 'fs'
import { createServer as createViteServer } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000
const API_BACKEND = process.env.API_BACKEND_URL || 'http://localhost:8000'
// For SSR data fetching (OG tags), use INTERNAL_API env var.
// In dev: defaults to localhost:8000. In prod: set to https://api.mahalo.ma (or wherever the API lives).
const INTERNAL_API = process.env.INTERNAL_API || 'http://localhost:8000'

let cachedSiteSettings = null
let settingsCachedAt   = 0
const SETTINGS_TTL_MS  = 0 // always fetch fresh — bots must see up-to-date OG image

async function getSiteSettings() {
  const now = Date.now()
  if (cachedSiteSettings && now - settingsCachedAt < SETTINGS_TTL_MS) {
    return cachedSiteSettings
  }
  try {
    const res = await fetch(`${INTERNAL_API}/api/v1/public-settings`, { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const json = await res.json()
      cachedSiteSettings = json?.data ?? {}
      settingsCachedAt   = now
    }
  } catch {
    // fall back to cached (or empty) if unreachable
  }
  return cachedSiteSettings ?? {}
}

const BOT_PATTERN = /googlebot|bingbot|slurp|yandex|baidu|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|embedly|ia_archiver|semrushbot|ahrefsbot|msnbot|teoma|rogerbot/i

const IGNORE_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json|webp|avif|mp4|webm|pdf)$/i

const PROPERTY_ROUTE  = /^\/properties\/([^/?#]+)/
const PROJECT_ROUTE   = /^\/projects\/([^/?#]+)/

function formatPrice(price) {
  if (!price) return null
  const num = parseFloat(price)
  if (isNaN(num) || num <= 0) return null
  return num.toLocaleString('en-US') + ' MAD'
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const json = await res.json()
    return json?.error ? null : (json?.data ?? null)
  } catch {
    return null
  }
}

function rewriteStorageUrl(imageUrl, origin) {
  if (!imageUrl) return imageUrl
  try {
    const parsed = new URL(imageUrl)
    const isInternal =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '0.0.0.0'
    if (isInternal) {
      const publicOrigin = new URL(origin)
      parsed.hostname = publicOrigin.hostname
      parsed.port = publicOrigin.port || ''
      parsed.protocol = publicOrigin.protocol
      return parsed.toString()
    }
  } catch {
    // not a valid URL, return as-is
  }
  return imageUrl
}

function buildOgTags(origin, { title, description, image, url, type = 'website' }) {
  const safeTitle = escapeHtml(title)
  const safeDesc  = escapeHtml(description)
  const safeImg   = image ? escapeHtml(image) : ''
  const safeUrl   = escapeHtml(url)

  return [
    `<title>${safeTitle}</title>`,
    `<meta name="description" content="${safeDesc}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDesc}" />`,
    `<meta property="og:url" content="${safeUrl}" />`,
    `<meta property="og:site_name" content="Mahalo Immobilier" />`,
    safeImg ? `<meta property="og:image" content="${safeImg}" />` : '',
    safeImg ? `<meta property="og:image:width" content="1200" />` : '',
    safeImg ? `<meta property="og:image:height" content="630" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDesc}" />`,
    safeImg ? `<meta name="twitter:image" content="${safeImg}" />` : '',
    `<link rel="canonical" href="${safeUrl}" />`,
  ].filter(Boolean).join('\n        ')
}

async function resolveOgMeta(pathname, origin) {
  const propMatch = pathname.match(PROPERTY_ROUTE)
  if (propMatch) {
    const slug = propMatch[1]
    const data = await fetchJson(`${INTERNAL_API}/api/v1/properties/${slug}`)
    if (!data) return null

    const city       = data.city?.name || ''
    const price      = formatPrice(data.price)
    const beds       = data.number_bedroom ? `${data.number_bedroom} ch.` : ''
    const baths      = data.number_bathroom ? `${data.number_bathroom} sdb.` : ''
    const listingType = data.type === 'sale' ? 'À vendre' : 'À louer'
    // Pick the best available image: main image → first gallery image → thumbnail
    const imgPath    = data.image || (Array.isArray(data.images) && data.images[0]) || data.thumbnail_url || ''
    const image      = imgPath
      ? (imgPath.startsWith('http') ? imgPath : `${origin}/storage/${imgPath}`)
      : ''

    const titleParts = [data.name, city && `— ${city}`, price && `— ${price}`].filter(Boolean)
    const descParts  = [listingType, data.name, city && `à ${city}`, 'Maroc.', beds, baths, price && `À partir de ${price}.`].filter(Boolean)

    return {
      title:       titleParts.join(' ') + ' | Mahalo Immobilier',
      description: descParts.join(' '),
      image,
      url:   `${origin}/properties/${slug}`,
      type:  'article',
    }
  }

  const projMatch = pathname.match(PROJECT_ROUTE)
  if (projMatch) {
    const slug = projMatch[1]
    const data = await fetchJson(`${INTERNAL_API}/api/v1/projects/${slug}`)
    if (!data) return null

    const city      = data.city?.name || ''
    const price     = formatPrice(data.price_from)
    // Pick the best available image: main image → first gallery image → thumbnail
    const imgPath   = data.image || (Array.isArray(data.images) && data.images[0]) || data.thumbnail_url || ''
    const image     = imgPath
      ? (imgPath.startsWith('http') ? imgPath : `${origin}/storage/${imgPath}`)
      : ''

    const titleParts = [data.name, city && `— ${city}`, price && `— À partir de ${price}`].filter(Boolean)
    const desc = data.description?.slice(0, 200) || 'Découvrez ce projet immobilier premium.'

    return {
      title:       titleParts.join(' ') + ' | Mahalo Immobilier',
      description: `${data.name}${city ? ` à ${city}` : ''}, Maroc. ${desc}`.trim(),
      image,
      url:   `${origin}/projects/${slug}`,
      type:  'article',
    }
  }

  return null
}

async function start() {
  const app = express()
  app.use(compression())

  // Resolve Prerender token: prefer DB setting, fall back to env var
  let prerenderToken = process.env.PRERENDER_TOKEN || ''
  try {
    const settingsRes = await fetch(`${INTERNAL_API}/api/v1/public-settings`, { signal: AbortSignal.timeout(5000) })
    if (settingsRes.ok) {
      const json = await settingsRes.json()
      const dbToken = json?.data?.prerender_token
      if (dbToken) prerenderToken = dbToken
    }
  } catch {
    // fall back to env var
  }

  if (prerenderToken) {
    const prerender = require('prerender-node')
    prerender.set('prerenderToken', prerenderToken)
    app.use(prerender)
    console.log(`  ➜  Prerender.io: enabled (token source: ${process.env.PRERENDER_TOKEN === prerenderToken ? 'env' : 'database'})`)
  } else {
    console.log('  ➜  Prerender.io: disabled (no token configured)')
  }

  const laravelProxy = createProxyMiddleware({
    target: API_BACKEND,
    changeOrigin: true,
    secure: false,
    pathFilter: (path) =>
      path.startsWith('/api/') ||
      path.startsWith('/storage/') ||
      path === '/og-image' ||
      path === '/og-image.png' ||
      path === '/sitemap.xml' ||
      path === '/sitemap-static.xml' ||
      path === '/sitemap-properties.xml' ||
      path === '/sitemap-projects.xml' ||
      path === '/sitemap-agents.xml' ||
      path === '/sitemap-ping',
    on: {
      error: (err, req, res) => {
        console.error('[proxy] Error:', err.message)
        res.status(502).end('Bad Gateway')
      },
    },
  })
  app.use(laravelProxy)

  let vite
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    const sirv = (await import('sirv')).default
    app.use(sirv(resolve(__dirname, 'dist/client'), { extensions: [] }))
  }

  app.use(async (req, res) => {
    const url = req.originalUrl
    const ua  = req.headers['user-agent'] || ''

    if (IGNORE_EXTENSIONS.test(url)) {
      return res.status(404).end()
    }

    const isBot = BOT_PATTERN.test(ua)

    try {
      let template = readFileSync(
        isProd
          ? resolve(__dirname, 'dist/client/index.html')
          : resolve(__dirname, 'index.html'),
        'utf-8'
      )

      if (!isProd) {
        template = await vite.transformIndexHtml(url, template)
      }

      // Inject custom head/body code from admin settings
      const siteSettings = await getSiteSettings()
      const customHeadCode = siteSettings.custom_head_code || ''
      const customBodyCode = siteSettings.custom_body_code || ''
      if (customBodyCode) {
        template = template.replace('<!--custom-body-->', customBodyCode)
      } else {
        template = template.replace('<!--custom-body-->', '')
      }

      if (isBot) {
        const origin   = `${req.protocol}://${req.get('host')}`
        const pathname = url.split('?')[0]

        const ogMeta = await resolveOgMeta(pathname, origin)

        // Canonical OG image: use admin-configured URL (rewritten for public access),
        // falling back to the stable /og-image route which Laravel redirects to the
        // correct image. This ensures bots always get a fetchable image URL.
        const rawOgImage = siteSettings.og_image_url || ''
        const siteOgImage = rawOgImage
          ? rewriteStorageUrl(rawOgImage, origin)
          : `${origin}/og-image.png`

        let headTags = ''
        if (ogMeta) {
          if (!ogMeta.image) ogMeta.image = siteOgImage
          if (ogMeta.image) ogMeta.image = rewriteStorageUrl(ogMeta.image, origin)
          headTags = buildOgTags(origin, ogMeta)
          // Strip static OG/Twitter/title tags from template so dynamic ones win
          template = template
            .replace(/<title>[^<]*<\/title>/gi, '')
            .replace(/<meta\s+name="description"[^>]*>/gi, '')
            .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
            .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
            .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
        } else {
          // For non-property/project pages, inject the global OG image from settings
          let globalOgHeadTags = ''
          if (siteOgImage) {
            const globalOgMeta = {
              title: siteSettings.seo_title || 'Mahalo Immobilier',
              description: siteSettings.seo_description || '',
              image: siteOgImage,
              url: `${origin}${pathname}`,
              type: 'website',
            }
            globalOgHeadTags = buildOgTags(origin, globalOgMeta)
            template = template
              .replace(/<title>[^<]*<\/title>/gi, '')
              .replace(/<meta\s+name="description"[^>]*>/gi, '')
              .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
              .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
              .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
          }
          try {
            const render = isProd
              ? (await import('./dist/server/entry-server.js')).render
              : (await vite.ssrLoadModule('/src/entry-server.jsx')).render

            const { html: appHtml, helmet } = await render(url)

            const ssrHeadTags = [
              helmet?.title?.toString()  || '',
              helmet?.meta?.toString()   || '',
              helmet?.link?.toString()   || '',
              helmet?.script?.toString() || '',
            ].join('\n        ')

            // Prefer the admin-configured OG image over whatever SSR helmet produces,
            // so the uploaded image always wins for social sharing
            headTags = globalOgHeadTags || ssrHeadTags

            template = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
          } catch (ssrErr) {
            console.warn('[SSR] Fallback render failed:', ssrErr.message)
            headTags = globalOgHeadTags
          }
        }

        const html = template.replace('<!--app-head-->', headTags + (customHeadCode ? '\n' + customHeadCode : ''))
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } else {
        const html = template.replace('<!--app-head-->', customHeadCode)
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      }
    } catch (err) {
      if (!isProd && vite) vite.ssrFixStacktrace(err)
      console.error('[server] Error:', err.message)
      res.status(500).end(err.message)
    }
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`  ➜  SSR server: http://localhost:${PORT}`)
    console.log(`  ➜  Mode: ${isProd ? 'production' : 'development'}`)
    console.log(`  ➜  Bot prerendering: enabled`)
  })
}

start().catch(console.error)
