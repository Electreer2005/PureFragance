// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Agrega aquí tu dominio de Cloudflare
    allowedHosts: [
      'large-expiration-manga-connecting.trycloudflare.com'
    ]
  }
})