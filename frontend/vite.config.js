import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'worksync-ihph.onrender.com'
    ],
    host: true, 
    port: 5173,
  },
  define: {
    global: 'window',
  },
});
