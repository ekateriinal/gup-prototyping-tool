import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://ekateriinal.github.io/gup-prototyping-tool/ — Vite uses
// `base` to prefix every emitted asset URL. Stays '/' for local dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/gup-prototyping-tool/' : '/',
  plugins: [react()],
  server: {
    port: 5180,
    open: true,
  },
}));
