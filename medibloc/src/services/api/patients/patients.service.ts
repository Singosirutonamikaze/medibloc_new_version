import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Patient, CreatePatientDto, UpdatePatientDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const patientsService = {
  /**
   * Récupérer tous les patients (avec pagination)
   */
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Patient>>(ENDPOINTS.PATIENTS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un patient par son ID
   */
  getById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<ApiResponse<Patient>>(ENDPOINTS.PATIENTS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau patient
   */
  create: async (data: CreatePatientDto): Promise<Patient> => {
    const response = await apiClient.post<ApiResponse<Patient>>(ENDPOINTS.PATIENTS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un patient
   */
  update: async (id: number, data: UpdatePatientDto): Promise<Patient> => {
    const response = await apiClient.put<ApiResponse<Patient>>(ENDPOINTS.PATIENTS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un patient
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PATIENTS.DELETE(id));
  },

  /**
   * Récupérer les maladies d'un patient
   */
  getDiseases: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PATIENTS.GET_DISEASES(id));
    return response.data.data;
  },

  /**
   * Récupérer les rendez-vous d'un patient
   */
  getAppointments: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PATIENTS.GET_APPOINTMENTS(id));
    return response.data.data;
  },

  /**
   * Récupérer les prescriptions d'un patient
   */
  getPrescriptions: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PATIENTS.GET_PRESCRIPTIONS(id));
    return response.data.data;
  },
};
