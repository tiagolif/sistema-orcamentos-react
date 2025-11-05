import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'; // Import visualizer

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true })], // Add visualizer plugin
})
