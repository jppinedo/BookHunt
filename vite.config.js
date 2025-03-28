import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
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