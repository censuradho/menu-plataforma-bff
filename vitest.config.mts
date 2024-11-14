import { resolve } from 'node:path'
import { config } from "dotenv";

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',  // Para testes de backend
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['**/*/*.spec.ts'],
    setupFiles: ['./src/__test__/setup.ts'],
    env: {
      ...config({ path: './.env' }).parsed,
    }
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },
});