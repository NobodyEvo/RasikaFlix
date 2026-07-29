/**
 * vite-plugin-photo-manifest.js
 * Scans assets/photos/ for images AND videos.
 * Exports: { photos: [...urls], videos: [...urls] }
 */

import { readdirSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

const VIRTUAL_MODULE_ID = 'virtual:photo-manifest';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v']);

export default function photoManifestPlugin() {
  let photosDir;
  let base;

  return {
    name: 'vite-plugin-photo-manifest',

    configResolved(config) {
      photosDir = resolve(config.root, 'assets/photos');
      base = config.base || '/';
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return;

      let photos = [];
      let videos = [];

      if (existsSync(photosDir)) {
        try {
          const files = readdirSync(photosDir)
            .filter(f => !f.startsWith('.'))
            .sort();

          files.forEach(f => {
            const ext = extname(f).toLowerCase();
            if (PHOTO_EXTENSIONS.has(ext)) {
              photos.push(`${base}assets/photos/${f}`);
            } else if (VIDEO_EXTENSIONS.has(ext)) {
              videos.push(`${base}assets/photos/${f}`);
            }
          });
        } catch (err) {
          console.warn('[photo-manifest] Could not read photos directory:', err.message);
        }
      } else {
        console.warn('[photo-manifest] assets/photos/ directory not found.');
      }

      return `export default ${JSON.stringify({ photos, videos })};`;
    },

    handleHotUpdate({ file, server }) {
      if (file.includes('assets/photos')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.hot.send({ type: 'full-reload' });
      }
    }
  };
}
