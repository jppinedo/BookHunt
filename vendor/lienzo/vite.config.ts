import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-feather',
  'react-day-picker',
  'react-day-picker/style.css',
  'recharts',
  'prism-react-renderer',
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve Lienzo path aliases during the library build.
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'Lienzo',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: (id) =>
        external.includes(id) ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id.startsWith('recharts/') ||
        id.startsWith('react-day-picker/'),
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((n) => n.endsWith('.css')) || assetInfo.name?.endsWith('.css')
            ? 'lienzo.css'
            : 'assets/[name][extname]',
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
