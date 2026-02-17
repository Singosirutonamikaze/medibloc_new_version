import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Pharmacy, CreatePharmacyDto, UpdatePharmacyDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const pharmaciesService = {
  /**
   * Récupérer toutes les pharmacies (avec pagination)
   */
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Pharmacy>>(ENDPOINTS.PHARMACIES.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer une pharmacie par son ID
   */
  getById: async (id: number): Promise<Pharmacy> => {
    const response = await apiClient.get<ApiResponse<Pharmacy>>(ENDPOINTS.PHARMACIES.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer une nouvelle pharmacie
   */
  create: async (data: CreatePharmacyDto): Promise<Pharmacy> => {
    const response = await apiClient.post<ApiResponse<Pharmacy>>(ENDPOINTS.PHARMACIES.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour une pharmacie
   */
  update: async (id: number, data: UpdatePharmacyDto): Promise<Pharmacy> => {
    const response = await apiClient.put<ApiResponse<Pharmacy>>(ENDPOINTS.PHARMACIES.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer une pharmacie
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PHARMACIES.DELETE(id));
  },

  /**
   * Récupérer les pharmacies par pays
   */
  getByCountry: async (countryId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PHARMACIES.GET_BY_COUNTRY(countryId));
    return response.data.data;
  },

  /**
   * Récupérer les médicaments d'une pharmacie
   */
  getMedicines: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PHARMACIES.GET_MEDICINES(id));
    return response.data.data;
  },
};
