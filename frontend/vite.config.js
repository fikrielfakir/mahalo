import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
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
