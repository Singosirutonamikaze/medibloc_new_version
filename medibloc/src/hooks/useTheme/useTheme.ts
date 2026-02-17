import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext/ThemeContext';

/**
 * Hook personnalisé pour utiliser le contexte de thème
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }

  return context;
}
