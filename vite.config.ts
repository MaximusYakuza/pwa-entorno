import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pwa-entorno/', // 👈 nombre exacto del repo
});
