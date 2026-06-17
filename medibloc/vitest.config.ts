import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) => {
  const resolvedViteConfig = typeof viteConfig === 'function' ? viteConfig(configEnv) : viteConfig;
  return mergeConfig(
    resolvedViteConfig,
    {
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: [],
      },
    }
  );
});
