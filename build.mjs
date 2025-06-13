import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/compressImage.ts'],
  bundle: true,
  outfile: 'dist/compressImage.js',
  format: 'esm',
  platform: 'node',
  target: 'node20',
  minify: true,
  treeShaking: true,
  external: [
    'vite',
    'sharp',
    'svgo',
    'glob'
  ]
}).catch(() => process.exit(1));