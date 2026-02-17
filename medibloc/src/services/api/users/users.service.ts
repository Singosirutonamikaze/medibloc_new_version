import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { User, CreateUserDto, UpdateUserDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const usersService = {
  /**
   * Récupérer tous les utilisateurs (avec pagination)
   */
  getAll: async (params?: PaginationParams & { role?: string }) => {
    const response = await apiClient.get<PaginatedResponse<User>>(ENDPOINTS.USERS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un utilisateur par son ID
   */
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.USERS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouvel utilisateur
   */
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(ENDPOINTS.USERS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un utilisateur
   */
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(ENDPOINTS.USERS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un utilisateur
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.USERS.DELETE(id));
  },

  /**
   * Récupérer le profil complet de l'utilisateur connecté
   */
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.USERS.PROFILE_ME);
    return response.data.data;
  },
};
