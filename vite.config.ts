import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: mode === 'github-pages' ? '/portfolio/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
