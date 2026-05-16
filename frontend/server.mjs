import express from 'express'
import compression from 'compression'
import { readFileSync } from 'fs'
import { createServer as createViteServer } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 5000
const API_BACKEND = process.env.API_BACKEND_URL || 'http://localhost:8000'

const BOT_PATTERN = /googlebot|bingbot|slurp|yandex|baidu|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|embedly|ia_archiver|semrushbot|ahrefsbot|msnbot|teoma|rogerbot/i

const IGNORE_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json|webp|avif|mp4|webm|pdf)$/i

async function start() {
  const app = express()
  app.use(compression())

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

  app.use('*', async (req, res) => {
    const url = req.originalUrl
    const ua  = req.headers['user-agent'] || ''

    if (IGNORE_EXTENSIONS.test(url) || url.startsWith('/api/') || url.startsWith('/storage/')) {
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

      if (isBot) {
        let render
        if (!isProd) {
          render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
        } else {
          render = (await import('./dist/server/entry-server.js')).render
        }

        const { html: appHtml, helmet } = await render(url)

        const headTags = [
          helmet?.title?.toString()    || '',
          helmet?.meta?.toString()     || '',
          helmet?.link?.toString()     || '',
          helmet?.script?.toString()   || '',
        ].join('\n        ')

        const html = template
          .replace('<!--app-head-->', headTags)
          .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } else {
        const html = template.replace('<!--app-head-->', '')
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
