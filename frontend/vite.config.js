import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  plugins: [react()],
  // Vite automatically copies everything from public/ to dist/
  // So public/_redirects will be copied to dist/_redirects
})
