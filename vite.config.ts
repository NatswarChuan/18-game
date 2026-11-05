import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        '@pmndrs/uikit/webgpu',
      ],
    },
  },
});
