import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Notification, CreateNotificationDto, ApiResponse } from '../../../types';

export const notificationsService = {
  /**
   * Récupérer toutes les notifications (admin)
   */
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>(ENDPOINTS.NOTIFICATIONS.GET_ALL);
    return response.data.data ?? [];
  },

  /**
   * Récupérer les notifications d'un utilisateur
   */
  getByUser: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>(ENDPOINTS.NOTIFICATIONS.GET_BY_USER(userId));
    return response.data.data ?? [];
  },

  /**
   * Créer une notification
   */
  create: async (data: CreateNotificationDto): Promise<Notification> => {
    const response = await apiClient.post<ApiResponse<Notification>>(ENDPOINTS.NOTIFICATIONS.CREATE, data);
    if (!response.data.data) {
      throw new Error('Impossible de créer la notification');
    }
    return response.data.data;
  },

  /**
   * Marquer une notification comme lue
   */
  markRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.put<ApiResponse<Notification>>(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    if (!response.data.data) {
      throw new Error('Impossible de marquer la notification comme lue');
    }
    return response.data.data;
  },

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  markAllRead: async (userId: number): Promise<{ count: number }> => {
    const response = await apiClient.put<ApiResponse<{ count: number }>>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId));
    if (!response.data.data) {
      throw new Error('Impossible de marquer les notifications comme lues');
    }
    return response.data.data;
  },

  /**
   * Supprimer une notification
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },
};
