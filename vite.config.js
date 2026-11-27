import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Inline the logo (into the JS) as a data URI. An audit capture
    // resolved the logo <img> against the origin root instead of the
    // artifact directory, so it was blocked as a broken image even
    // though the file exists. A data URI has no URL to resolve, so
    // the image cannot 404 or be mis-resolved. All other assets
    // keep the default limit. (The background tile used to be inlined
    // here too; D1 retired it — the app background is now Lienzo's
    // light paper surface, no image at all.)
    assetsInlineLimit: (filePath) =>
      filePath.includes('bookhunt-logo')
        ? true
        : undefined,
  },
  resolve: {
    // Lienzo consumes React as a peer dependency: keep a single React 19 tree.
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@custom': path.resolve(__dirname, './src/components/custom'),
      '@pages': path.resolve(__dirname, './src/components/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@state': path.resolve(__dirname, './src/state'),
    },
  },
});
