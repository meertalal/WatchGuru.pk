import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const apiProxy = {
  '/api': {
    target: process.env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:8090',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    // The API runs on the Laragon PHP dev server during development.
    proxy: apiProxy,
  },
  preview: {
    // Keep `npm run preview` usable against the local API too.
    proxy: apiProxy,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Stable vendor chunks — cached aggressively between deploys.
          if (/node_modules[\\/](react|react-dom|scheduler|react-router-dom|react-router)[\\/]/.test(id))
            return 'react'
          if (/node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/.test(id)) return 'forms'
        },
      },
    },
  },
})
