import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // INI SOLUSI AJAIBNYA:
    // Kita suruh Vite untuk "membuang" duplikat React
    // dan memaksa pakai versi yang ada di folder ini saja.
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
})