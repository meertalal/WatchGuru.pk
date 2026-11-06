import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
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
