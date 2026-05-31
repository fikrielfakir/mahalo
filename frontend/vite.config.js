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
        target: 'https://api.mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://api.mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
      '^/sitemap.*\\.xml$': {
        target: 'https://api.mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-ping': {
        target: 'https://api.mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
      '/og-image': {
        target: 'http://mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
      '/og-image.png': {
        target: 'http://mahalo.ma',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
