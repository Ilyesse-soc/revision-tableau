import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANT : remplace "revision-tableau" ci-dessous par le nom EXACT
// de ton dépôt GitHub si tu le renommes, sinon GitHub Pages ne trouvera pas
// les fichiers (CSS/JS) une fois déployé.
const REPO_NAME = 'revision-tableau'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Quran Revision Tracker',
        short_name: 'QRT',
        description: 'Suivi de révision du Coran par Hizb, cycle de 2 semaines',
        theme_color: '#0f766e',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: `/${REPO_NAME}/`,
        scope: `/${REPO_NAME}/`,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: `/${REPO_NAME}/index.html`
      }
    })
  ]
})
