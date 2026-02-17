import { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { storageService } from '../../services';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = Readonly<{ children: ReactNode }>;

/**
 * Provider pour la gestion du thème
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  // Charger le thème depuis le localStorage au démarrage
  useEffect(() => {
    const storedTheme = storageService.getTheme() as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.dataset.theme = storedTheme;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storageService.setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
  }, [theme]);

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme,
  }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
