import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  base: '/',   // <-- REQUIRED FOR DEPLOYMENT
  server: {
    port: 5173,
    proxy: {
      // '/api': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  },
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copy _redirects file to dist folder after build
        try {
          copyFileSync('_redirects', 'dist/_redirects')
          console.log('✅ _redirects file copied to dist/')
        } catch (err) {
          console.error('❌ Failed to copy _redirects:', err)
        }
      }
    }
  ],
})
