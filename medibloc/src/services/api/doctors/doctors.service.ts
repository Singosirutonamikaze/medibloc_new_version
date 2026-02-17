import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  ApiResponse, PaginatedResponse, PaginationParams
} from '../../../types';

export const doctorsService = {
  /**
   * Récupérer tous les médecins (avec pagination)
   */
  getAll: async (params?: PaginationParams & { specialty?: string }) => {
    const response = await apiClient.get<PaginatedResponse<Doctor>>(ENDPOINTS.DOCTORS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un médecin par son ID
   */
  getById: async (id: number): Promise<Doctor> => {
    const response = await apiClient.get<ApiResponse<Doctor>>(ENDPOINTS.DOCTORS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau médecin
   */
  create: async (data: CreateDoctorDto): Promise<Doctor> => {
    const response = await apiClient.post<ApiResponse<Doctor>>(ENDPOINTS.DOCTORS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un médecin
   */
  update: async (id: number, data: UpdateDoctorDto): Promise<Doctor> => {
    const response = await apiClient.put<ApiResponse<Doctor>>(ENDPOINTS.DOCTORS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un médecin
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DOCTORS.DELETE(id));
  },

  /**
   * Récupérer les rendez-vous d'un médecin
   */
  getAppointments: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.DOCTORS.GET_APPOINTMENTS(id));
    return response.data.data;
  },

  /**
   * Récupérer les prescriptions d'un médecin
   */
  getPrescriptions: async (id: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.DOCTORS.GET_PRESCRIPTIONS(id));
    return response.data.data;
  },

  /**
   * Récupérer la liste des spécialités
   */
  getSpecialties: async () => {
    const response = await apiClient.get<ApiResponse<string[]>>(ENDPOINTS.DOCTORS.GET_SPECIALTIES);
    return response.data.data!;
  },
};
