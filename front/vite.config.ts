import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      assets: '/src/assets',
    },
  },
});
