import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Appointment, CreateAppointmentDto, UpdateAppointmentDto, ApiResponse, PaginatedResponse, PaginationParams, AppointmentStatus } from '../../../types';

export const appointmentsService = {
  /**
   * Récupérer tous les rendez-vous (avec pagination)
   */
  getAll: async (params?: PaginationParams & { status?: AppointmentStatus }) => {
    const response = await apiClient.get<PaginatedResponse<Appointment>>(ENDPOINTS.APPOINTMENTS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un rendez-vous par son ID
   */
  getById: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<ApiResponse<Appointment>>(ENDPOINTS.APPOINTMENTS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau rendez-vous
   */
  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await apiClient.post<ApiResponse<Appointment>>(ENDPOINTS.APPOINTMENTS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un rendez-vous
   */
  update: async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(ENDPOINTS.APPOINTMENTS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un rendez-vous
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.APPOINTMENTS.DELETE(id));
  },

  /**
   * Mettre à jour le statut d'un rendez-vous
   */
  updateStatus: async (id: number, status: AppointmentStatus): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(
      ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id),
      { status }
    );
    return response.data.data!;
  },

  /**
   * Récupérer les rendez-vous d'un patient
   */
  getByPatient: async (patientId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.APPOINTMENTS.GET_BY_PATIENT(patientId));
    return response.data.data;
  },

  /**
   * Récupérer les rendez-vous d'un médecin
   */
  getByDoctor: async (doctorId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.APPOINTMENTS.GET_BY_DOCTOR(doctorId));
    return response.data.data;
  },
};
