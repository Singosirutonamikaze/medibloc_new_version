/**
 * @file vitest.config.ts
 * @description Configuration globale de la suite de tests unitaires et d'integration Vitest.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { defineConfig } from 'vitest/config';
import fs from 'node:fs';
import path from 'node:path';

const logsDir = path.join(process.cwd(), 'logs');
fs.mkdirSync(logsDir, { recursive: true });

const timestamp = new Date().toISOString().split('T')[0];

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup/vitest.setup.ts'],
    reporters: ['default', 'json', 'html'],
    outputFile: {
      json: `logs/test-results-${timestamp}.json`,
      html: `logs/test-report-${timestamp}.html`,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'logs/**',
        'test/**',
        '**/*.d.ts',
        '**/*.config.ts',
      ],
    },
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'medibloc-test-secret-key-for-ci-only',
      JWT_EXPIRES_IN: '1d',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/medibloc_test',
      PORT: '3001',
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
});
