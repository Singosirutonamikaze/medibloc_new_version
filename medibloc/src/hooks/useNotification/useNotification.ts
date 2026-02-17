import { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext';

/**
 * Hook personnalisé pour utiliser le contexte de notifications
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }

  return context;
}
