import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.tymetro.com.tw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' from the request path
        headers: {
          Referer: 'https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/timetable-search.php',
        },
      },
    },
  },
})
