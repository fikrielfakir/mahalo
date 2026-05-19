import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // LOCAL_API_URL in .env.local takes priority (never set in Replit userenv),
  // then fall back to the system API_BACKEND_URL, then localhost.
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.LOCAL_API_URL || env.API_BACKEND_URL || process.env.API_BACKEND_URL || 'http://localhost:8000'
  const isExternal = apiUrl.startsWith('https://')

  return {
    plugins: [react()],
    ssr: {
      noExternal: ['react-helmet-async'],
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,

      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: isExternal,
        },
        '/storage': {
          target: apiUrl,
          changeOrigin: true,
          secure: isExternal,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
        '@assets': '/src/assets',
      },
    },
  }
})
