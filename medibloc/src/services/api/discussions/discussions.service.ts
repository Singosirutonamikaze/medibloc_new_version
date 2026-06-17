import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Discussion, Message, CreateDiscussionDto, CreateMessageDto, ApiResponse, Role } from '../../../types';

export const discussionsService = {
  /**
   * Récupérer toutes les discussions d'un utilisateur
   */
  getUserDiscussions: async (params: { patientId?: number; doctorId?: number }): Promise<Discussion[]> => {
    const response = await apiClient.get<ApiResponse<Discussion[]>>(ENDPOINTS.DISCUSSIONS.GET_ALL, { params });
    return response.data.data ?? [];
  },

  /**
   * Récupérer ou créer une discussion entre patient et médecin
   */
  getOrCreate: async (data: CreateDiscussionDto): Promise<Discussion> => {
    const response = await apiClient.post<ApiResponse<Discussion>>(ENDPOINTS.DISCUSSIONS.CREATE, data);
    if (!response.data.data) {
      throw new Error('Impossible de charger ou de créer la discussion');
    }
    return response.data.data;
  },

  /**
   * Récupérer les messages d'une discussion
   */
  getMessages: async (id: number): Promise<Message[]> => {
    const response = await apiClient.get<ApiResponse<Message[]>>(ENDPOINTS.DISCUSSIONS.GET_MESSAGES(id));
    return response.data.data ?? [];
  },

  /**
   * Envoyer un message dans une discussion
   */
  sendMessage: async (id: number, data: CreateMessageDto): Promise<Message> => {
    const response = await apiClient.post<ApiResponse<Message>>(ENDPOINTS.DISCUSSIONS.SEND_MESSAGE(id), data);
    if (!response.data.data) {
      throw new Error('Impossible d\'envoyer le message');
    }
    return response.data.data;
  },

  /**
   * Marquer les messages d'une discussion comme lus
   */
  markRead: async (id: number, role: Role): Promise<{ count: number }> => {
    const response = await apiClient.put<ApiResponse<{ count: number }>>(ENDPOINTS.DISCUSSIONS.MARK_READ(id), { role });
    if (!response.data.data) {
      throw new Error('Impossible de marquer les messages comme lus');
    }
    return response.data.data;
  },

  /**
   * Supprimer une discussion
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DISCUSSIONS.DELETE(id));
  },
};
