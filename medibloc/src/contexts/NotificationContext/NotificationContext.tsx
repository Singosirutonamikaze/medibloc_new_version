import { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationProviderProps = Readonly<{ children: ReactNode }>;

/**
 * Provider pour la gestion des notifications
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const value = useMemo<NotificationContextType>(() => ({
    notifications,
    addNotification,
    removeNotification,
  }), [notifications, addNotification, removeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
