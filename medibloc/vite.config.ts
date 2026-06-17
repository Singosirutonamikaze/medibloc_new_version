import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawTarget = env.VITE_API_BASE_URL || 'https://medibloc-new-version.onrender.com';
  const target = rawTarget.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})
