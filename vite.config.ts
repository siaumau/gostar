import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 監聽所有網路介面
    port: 3000
  },
  preview: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
  }
})
