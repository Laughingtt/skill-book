import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import skillApiPlugin from './scripts/vite-plugin-skill-api.js'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    skillApiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Skill Book',
        short_name: 'Skill Book',
        description: '探索和管理你的技能知识库',
        theme_color: '#c4553a',
        background_color: '#faf9f6',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,md}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-cache' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/skills\/index\.json$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'skills-index-cache' },
          },
          {
            urlPattern: /\/skills\/.*\.md$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'skills-md-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
