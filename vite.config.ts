import { defineConfig } from 'vite';
export default defineConfig({
  // Relative asset URLs work at the GitHub project URL and at the custom domain.
  base: './',
  server: { host: '0.0.0.0' },
});
