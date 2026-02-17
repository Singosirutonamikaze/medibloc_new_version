import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Symptom, CreateSymptomDto, UpdateSymptomDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const symptomsService = {
  /**
   * Récupérer tous les symptômes (avec pagination)
   */
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Symptom>>(ENDPOINTS.SYMPTOMS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un symptôme par son ID
   */
  getById: async (id: number): Promise<Symptom> => {
    const response = await apiClient.get<ApiResponse<Symptom>>(ENDPOINTS.SYMPTOMS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau symptôme
   */
  create: async (data: CreateSymptomDto): Promise<Symptom> => {
    const response = await apiClient.post<ApiResponse<Symptom>>(ENDPOINTS.SYMPTOMS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un symptôme
   */
  update: async (id: number, data: UpdateSymptomDto): Promise<Symptom> => {
    const response = await apiClient.put<ApiResponse<Symptom>>(ENDPOINTS.SYMPTOMS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un symptôme
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.SYMPTOMS.DELETE(id));
  },

  /**
   * Récupérer les maladies associées à un symptôme
   */
  getDiseases: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.SYMPTOMS.GET_DISEASES(id));
    return response.data.data;
  },
};
