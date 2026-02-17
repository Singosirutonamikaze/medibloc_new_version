import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { MedicalRecord, CreateMedicalRecordDto, UpdateMedicalRecordDto, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

export const medicalRecordsService = {
  /**
   * Récupérer tous les dossiers médicaux (avec pagination)
   */
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<MedicalRecord>>(ENDPOINTS.MEDICAL_RECORDS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer un dossier médical par son ID
   */
  getById: async (id: number): Promise<MedicalRecord> => {
    const response = await apiClient.get<ApiResponse<MedicalRecord>>(ENDPOINTS.MEDICAL_RECORDS.GET_BY_ID(id));
    return response.data.data!;
  },

  /**
   * Créer un nouveau dossier médical
   */
  create: async (data: CreateMedicalRecordDto): Promise<MedicalRecord> => {
    const response = await apiClient.post<ApiResponse<MedicalRecord>>(ENDPOINTS.MEDICAL_RECORDS.CREATE, data);
    return response.data.data!;
  },

  /**
   * Mettre à jour un dossier médical
   */
  update: async (id: number, data: UpdateMedicalRecordDto): Promise<MedicalRecord> => {
    const response = await apiClient.put<ApiResponse<MedicalRecord>>(ENDPOINTS.MEDICAL_RECORDS.UPDATE(id), data);
    return response.data.data!;
  },

  /**
   * Supprimer un dossier médical
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.MEDICAL_RECORDS.DELETE(id));
  },

  /**
   * Récupérer les dossiers médicaux d'un patient
   */
  getByPatient: async (patientId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.MEDICAL_RECORDS.GET_BY_PATIENT(patientId));
    return response.data.data;
  },

  /**
   * Récupérer les dossiers médicaux d'un médecin
   */
  getByDoctor: async (doctorId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.MEDICAL_RECORDS.GET_BY_DOCTOR(doctorId));
    return response.data.data;
  },

  /**
   * Récupérer les dossiers médicaux d'un rendez-vous
   */
  getByAppointment: async (appointmentId: number) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.MEDICAL_RECORDS.GET_BY_APPOINTMENT(appointmentId));
    return response.data.data;
  },
};
