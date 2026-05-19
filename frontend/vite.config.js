// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': '/src' },
    },
    // No proxy needed for production — handled by _redirects
  }
})