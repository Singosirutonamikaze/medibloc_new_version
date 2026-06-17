import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Review, CreateReviewDto, ApiResponse } from '../../../types';

export const reviewsService = {
  /**
   * Récupérer tous les avis
   */
  getAll: async (): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(ENDPOINTS.REVIEWS.GET_ALL);
    return response.data.data ?? [];
  },

  /**
   * Récupérer un avis par ID
   */
  getById: async (id: number): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(ENDPOINTS.REVIEWS.GET_BY_ID(id));
    if (!response.data.data) {
      throw new Error('Avis non trouvé');
    }
    return response.data.data;
  },

  /**
   * Créer un avis
   */
  create: async (data: CreateReviewDto): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(ENDPOINTS.REVIEWS.CREATE, data);
    if (!response.data.data) {
      throw new Error('Impossible de soumettre l\'avis');
    }
    return response.data.data;
  },

  /**
   * Supprimer un avis
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.REVIEWS.DELETE(id));
  },

  /**
   * Récupérer les avis d'un médecin
   */
  getByDoctor: async (doctorId: number): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(ENDPOINTS.REVIEWS.GET_BY_DOCTOR(doctorId));
    return response.data.data ?? [];
  },

  /**
   * Récupérer les avis d'un patient
   */
  getByPatient: async (patientId: number): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(ENDPOINTS.REVIEWS.GET_BY_PATIENT(patientId));
    return response.data.data ?? [];
  },
};
