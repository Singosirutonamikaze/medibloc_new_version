/**
 * Service de gestion du stockage local
 */

const STORAGE_KEYS = {
  TOKEN: 'medibloc_token',
  USER: 'medibloc_user',
  THEME: 'medibloc_theme',
} as const;

export const storageService = {
  /**
   * Sauvegarder le token
   */
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * Récupérer le token
   */
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Supprimer le token
   */
  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Sauvegarder les informations utilisateur
   */
  setUser: (user: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Récupérer les informations utilisateur
   */
  getUser: (): unknown => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Supprimer les informations utilisateur
   */
  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Sauvegarder le thème
   */
  setTheme: (theme: string): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Récupérer le thème
   */
  getTheme: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  },

  /**
   * Effacer tout le stockage
   */
  clear: (): void => {
    localStorage.clear();
  },
};
