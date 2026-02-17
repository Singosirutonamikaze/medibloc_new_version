import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { ApiResponse } from '../../../types';

export const statsService = {
  /**
   * Récupérer les statistiques du dashboard
   */
  getDashboardStats: async () => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.STATS.DASHBOARD);
    return response.data.data;
  },

  /**
   * Récupérer les statistiques des rendez-vous
   */
  getAppointmentsStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.STATS.APPOINTMENTS, { params });
    return response.data.data;
  },

  /**
   * Récupérer les statistiques des patients
   */
  getPatientsStats: async () => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.STATS.PATIENTS);
    return response.data.data;
  },

  /**
   * Récupérer les statistiques des maladies
   */
  getDiseasesStats: async () => {
    const response = await apiClient.get<ApiResponse>(ENDPOINTS.STATS.DISEASES);
    return response.data.data;
  },
};
