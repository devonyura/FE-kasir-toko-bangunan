import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
