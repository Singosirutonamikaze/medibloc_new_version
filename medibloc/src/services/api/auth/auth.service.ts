import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { LoginCredentials, RegisterData, AuthResponse, AuthUser } from '../../../types';
import type { ApiResponse } from '../../../types/common/common.types';

export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param data - Données d'inscription
   * @returns Réponse d'authentification avec token et utilisateur
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data!;
  },

  /**
   * Connexion d'un utilisateur
   * @param credentials - Identifiants de connexion
   * @returns Réponse d'authentification avec token et utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   * @returns Utilisateur connecté
   */
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiResponse<AuthUser>>(ENDPOINTS.AUTH.ME);
    return response.data.data!;
  },

  /**
   * Rafraîchir le token d'authentification
   * @returns Nouvelle réponse d'authentification
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REFRESH);
    return response.data.data!;
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },
};
