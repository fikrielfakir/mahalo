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
        // All API calls (including media uploads) go to the configured backend (Hostinger)
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: isExternal,
        },
        // Static storage files served from Hostinger
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
      },
    },
  }
})
