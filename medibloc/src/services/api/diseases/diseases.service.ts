import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Disease, CreateDiseaseDto, UpdateDiseaseDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const diseasesService = {
  /**
   * Récupérer toutes les maladies (avec pagination)
   */
  getAll: async (params?: PaginationParams & { category?: string }) => {
    const response = await apiClient.get<PaginatedResponse<Disease>>(ENDPOINTS.DISEASES.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer une maladie par son ID
   */
  getById: async (id: number): Promise<Disease> => {
    const response = await apiClient.get<ApiResponse<Disease>>(ENDPOINTS.DISEASES.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer une nouvelle maladie
   */
  create: async (data: CreateDiseaseDto): Promise<Disease> => {
    const response = await apiClient.post<ApiResponse<Disease>>(ENDPOINTS.DISEASES.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour une maladie
   */
  update: async (id: number, data: UpdateDiseaseDto): Promise<Disease> => {
    const response = await apiClient.put<ApiResponse<Disease>>(ENDPOINTS.DISEASES.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer une maladie
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DISEASES.DELETE(id));
  },

  /**
   * Récupérer les symptômes d'une maladie
   */
  getSymptoms: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.DISEASES.GET_SYMPTOMS(id));
    return response.data.data;
  },

  /**
   * Récupérer les pays affectés par une maladie
   */
  getCountries: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.DISEASES.GET_COUNTRIES(id));
    return response.data.data;
  },

  /**
   * Ajouter un symptôme à une maladie
   */
  addSymptom: async (diseaseId: number, symptomId: number) => {
    const response = await apiClient.post<ApiResponse>(
      ENDPOINTS.DISEASES.ADD_SYMPTOM(diseaseId, symptomId)
    );
    return response.data;
  },

  /**
   * Retirer un symptôme d'une maladie
   */
  removeSymptom: async (diseaseId: number, symptomId: number) => {
    await apiClient.delete(ENDPOINTS.DISEASES.REMOVE_SYMPTOM(diseaseId, symptomId));
  },
};
