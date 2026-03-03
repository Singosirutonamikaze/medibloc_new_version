import { defineConfig } from 'vitest/config';
import fs from 'node:fs';
import path from 'node:path';

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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
    // Variables d'env injectées avant tout import de module
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
