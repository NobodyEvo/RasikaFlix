import { defineConfig } from 'vite';
import photoManifestPlugin from './vite-plugin-photo-manifest.js';

export default defineConfig({
  // ⚠️ IMPORTANT: Change this to match your GitHub repository name exactly.
  // Example: if your repo is at github.com/yourname/rassu-birthday, set base: '/rassu-birthday/'
  base: '/RasikaFlix/',

  plugins: [
    photoManifestPlugin()
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },

  server: {
    port: 5173,
    open: true
  }
});
