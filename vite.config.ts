import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build: {
      // Production optimizations
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        },
      },
      // Chunk splitting strategy
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for React and core libraries
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // UI components chunk
            'ui-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
            ],
            // Form handling chunk
            'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
            // Data fetching chunk
            'query-vendor': ['@tanstack/react-query'],
            // Charts chunk (if used)
            'chart-vendor': ['recharts'],
          },
        },
      },
      // Increase chunk size warning limit (default is 500kb)
      chunkSizeWarningLimit: 1000,
      // Source maps for production debugging (optional)
      sourcemap: mode === 'production' ? false : true,
    },
    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'date-fns',
      ],
    },
    // Preview server configuration
    preview: {
      port: 8080,
      host: "::",
    },
}));
