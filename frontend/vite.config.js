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
        secure: true,
      },
      '/storage': {
        target: 'https://api.mahalo.ma',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
