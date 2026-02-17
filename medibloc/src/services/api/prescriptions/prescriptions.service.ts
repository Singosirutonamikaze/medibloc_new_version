import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Prescription, CreatePrescriptionDto, UpdatePrescriptionDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const prescriptionsService = {
  /**
   * Récupérer toutes les prescriptions (avec pagination)
   */
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Prescription>>(ENDPOINTS.PRESCRIPTIONS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer une prescription par son ID
   */
  getById: async (id: number): Promise<Prescription> => {
    const response = await apiClient.get<ApiResponse<Prescription>>(ENDPOINTS.PRESCRIPTIONS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer une nouvelle prescription
   */
  create: async (data: CreatePrescriptionDto): Promise<Prescription> => {
    const response = await apiClient.post<ApiResponse<Prescription>>(ENDPOINTS.PRESCRIPTIONS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour une prescription
   */
  update: async (id: number, data: UpdatePrescriptionDto): Promise<Prescription> => {
    const response = await apiClient.put<ApiResponse<Prescription>>(ENDPOINTS.PRESCRIPTIONS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer une prescription
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PRESCRIPTIONS.DELETE(id));
  },

  /**
   * Récupérer les prescriptions d'un patient
   */
  getByPatient: async (patientId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PRESCRIPTIONS.GET_BY_PATIENT(patientId));
    return response.data.data;
  },

  /**
   * Récupérer les prescriptions d'un médecin
   */
  getByDoctor: async (doctorId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PRESCRIPTIONS.GET_BY_DOCTOR(doctorId));
    return response.data.data;
  },

  /**
   * Récupérer les médicaments d'une prescription
   */
  getMedicines: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.PRESCRIPTIONS.GET_MEDICINES(id));
    return response.data.data;
  },
};
