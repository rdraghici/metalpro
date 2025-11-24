import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      devTarget: 'esnext',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup/frontend-setup.ts'],
    css: true,
    include: ['./test/unit/frontend/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'backend/**', '.{idea,git,cache,output,temp}/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
    },
    server: {
      deps: {
        inline: ['react', 'react-dom'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    jsxDev: false,
  },
});
