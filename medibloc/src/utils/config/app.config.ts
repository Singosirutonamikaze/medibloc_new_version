/**
 * Configuration de l'API
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://medibloc-new-version.onrender.com',
  TIMEOUT: 30000,
  VERSION: 'v1',
} as const;

/**
 * Configuration de la pagination par défaut
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Configuration des notifications
 */
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
} as const;
