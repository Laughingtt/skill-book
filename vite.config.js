import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import skillApiPlugin from './scripts/vite-plugin-skill-api.js'

export default defineConfig({
  plugins: [vue(), tailwindcss(), skillApiPlugin()],
})
