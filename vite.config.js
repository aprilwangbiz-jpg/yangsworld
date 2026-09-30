import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/yangs-world/"), since a
// project site is served from a sub-path. Local dev and preview use "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
