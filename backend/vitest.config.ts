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
  },
});
