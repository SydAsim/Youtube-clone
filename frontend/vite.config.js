import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: 5173,
    proxy:{ 
      // Proxy configuration to avoid CORS issues
      // All requests starting with /api will be forwarded to the backend server
      '/api': {
        target: 'http://localhost:8000',  // Backend server URL
        changeOrigin: true,  // Changes the origin of the host header to the target URL
        secure: false,  // If backend uses HTTPS with self-signed certificate
      }
    }
  },
  plugins: [react()],
})
