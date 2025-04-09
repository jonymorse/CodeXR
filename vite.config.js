// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Base path for deployment
  base: './',
  
  // Server configuration
  server: {
    host: true,
    port: 3000,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: true,
    emptyOutDir: true,
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  
  // Optimizations
  optimizeDeps: {
    include: ['aframe', 'codemirror', 'axios']
  },
  
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
