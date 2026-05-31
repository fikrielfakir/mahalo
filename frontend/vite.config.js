import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src', '@assets': '/src/assets' },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '^/sitemap.*\\.xml$': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-ping': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/og-image': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/og-image.png': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
