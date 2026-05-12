import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.API_BACKEND_URL || 'http://localhost:8000'
  const isExternal = apiUrl.startsWith('https://')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      proxy: {
        // Media uploads go to local Laravel — must be before /api
        '/api/v1/admin/media': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        // All other API calls go to the configured backend (Hostinger)
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: isExternal,
        },
        // Storage files served from local Laravel (seeded images + new uploads)
        '/storage': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
