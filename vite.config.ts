import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Keep the long-lived libraries separate from application code. This
    // improves caching and prevents the main entry chunk from growing just
    // because a large dependency changes.
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replaceAll('\\', '/');
          if (!moduleId.includes('/node_modules/')) return;

          // Three.js is only reached through the lazy cinematic scene, so it
          // remains off the initial route while keeping that boundary obvious.
          if (moduleId.includes('/node_modules/three/')) {
            return 'vendor-three';
          }

          if (
            /\/node_modules\/(?:motion|framer-motion|motion-dom|motion-utils)\//.test(
              moduleId,
            )
          ) {
            return 'vendor-motion';
          }

          if (moduleId.includes('/node_modules/@supabase/')) {
            return 'vendor-supabase';
          }

          return 'vendor';
        },
      },
    },

    // The deliberately isolated Three.js chunk is a little above Vite's
    // generic 500 kB default, but is lazy-loaded and about 136 kB over gzip.
    // Keep a close warning budget instead of disabling the check.
    chunkSizeWarningLimit: 550,
  },
})
