import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'stream': 'stream-browserify',
      'buffer': 'buffer',
      'util': 'util',
      'process': 'process/browser',
      'events': 'events',
      'crypto': 'crypto-browserify',
      'http': 'stream-http',
      'https': 'https-browserify',
      'ws': 'xterm-js',
      'zlib': 'browserify-zlib',
      'path': 'path-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        bigint: true 
      },
    },
    include: [
      '@solana/web3.js',
      '@metaplex-foundation/js',
      '@metaplex-foundation/mpl-token-metadata',
      'buffer',
      'process/browser',
      'events',
      'stream-browserify',
      'util',
    ],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});