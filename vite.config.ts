import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Stringify the API key to ensure it's treated as a string literal in the code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
  },
  base: './', // Essential for hosting on GitHub Pages or subdirectories
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});