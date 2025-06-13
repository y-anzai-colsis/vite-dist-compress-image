import { defineConfig } from 'vite';
import { compressImage } from './dist/compressImage';

export default defineConfig({
  build: {
    outDir: 'test'
  },
  plugins: [
    compressImage()
  ]
});