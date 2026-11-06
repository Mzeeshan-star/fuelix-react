import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'], three: ['three'] } } } },
});
