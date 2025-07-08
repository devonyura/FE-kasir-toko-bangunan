import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	base: "/",
  server: {
		port: 8100, // Ubah port menjadi 8100
		// proxy: {
		// 	'/api': {
		// 		target: 'https://api.rindapermai.com', // Ganti dengan URL backend
		// 		changeOrigin: true,
		// 		secure: false,
		// 	}
		// }
    
	},
  plugins: [react(),tailwindcss(),VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
				"id": "/",
        name: 'Buana Situju Dapurang',
        short_name: 'BS7',
        description: 'POS Buana Situju Dapurang',
        start_url: '/',
				scope: "/",
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
				screenshots: [
					{
						"src": "/screenshots/dashboard-wide.png",
						"sizes": "1280x720",
						"type": "image/png",
						"form_factor": "wide",
						"label": "Dashboard Penjualan Toko"
					},
					{
						"src": "/screenshots/dashboard-mobile.png",
						"sizes": "375x667",
						"type": "image/png",
						"label": "Tampilan Mobile Kasir"
					}
				]
      },
      devOptions: {
        enabled: true
      },
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'], // Semua file penting
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
							},
						},
					},
					{
						urlPattern: ({ request }) => request.destination === 'image',
						handler: 'CacheFirst',
						options: {
							cacheName: 'images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
							},
						},
					},
					{
						urlPattern: ({ url }) => url.origin,
						handler: 'CacheFirst',
						options: {
							cacheName: 'local-assets',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
							},
						},
					}
				],
				maximumFileSizeToCacheInBytes: 23 * 1024 * 1024 // 10MB
			}
    })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
