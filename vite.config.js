import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: 'localhost',
    open: false
  },
  build: {
    outDir: 'dist'
  },
  define: {
    global: 'globalThis'
  }
})
