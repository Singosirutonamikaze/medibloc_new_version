import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type  { Medicine, CreateMedicineDto, UpdateMedicineDto, ApiResponse, PaginatedResponse, PaginationParams, MedicineType } from '../../../types';

export const medicinesService = {
  /**
   * Récupérer tous les médicaments (avec pagination)
   */
  getAll: async (params?: PaginationParams & { type?: MedicineType }) => {
    const response = await apiClient.get<PaginatedResponse<Medicine>>(ENDPOINTS.MEDICINES.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un médicament par son ID
   */
  getById: async (id: number): Promise<Medicine> => {
    const response = await apiClient.get<ApiResponse<Medicine>>(ENDPOINTS.MEDICINES.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau médicament
   */
  create: async (data: CreateMedicineDto): Promise<Medicine> => {
    const response = await apiClient.post<ApiResponse<Medicine>>(ENDPOINTS.MEDICINES.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un médicament
   */
  update: async (id: number, data: UpdateMedicineDto): Promise<Medicine> => {
    const response = await apiClient.put<ApiResponse<Medicine>>(ENDPOINTS.MEDICINES.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un médicament
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.MEDICINES.DELETE(id));
  },

  /**
   * Récupérer les médicaments par type
   */
  getByType: async (type: MedicineType) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.MEDICINES.GET_BY_TYPE(type));
    return response.data.data;
  },

  /**
   * Récupérer les médicaments d'une pharmacie
   */
  getByPharmacy: async (pharmacyId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.MEDICINES.GET_BY_PHARMACY(pharmacyId));
    return response.data.data;
  },
};
