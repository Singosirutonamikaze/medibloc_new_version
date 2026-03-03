import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { DiseaseHotspot, HotspotApiResponse, HotspotsQueryParams } from '../../../types/dashboard/types';

export const hotspotsService = {
  /**
   * Récupérer tous les hotspots épidémiologiques agrégés (WHO + ECDC + ProMED).
   * Accepte des filtres optionnels : disease, source, minCases.
   */
  getAll: async (params?: HotspotsQueryParams): Promise<HotspotApiResponse> => {
    const response = await apiClient.get<HotspotApiResponse>(ENDPOINTS.HOTSPOTS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Récupérer la liste dédupliquée de toutes les maladies disponibles.
   */
  getDiseases: async (): Promise<DiseaseHotspot['disease'][]> => {
    const response = await apiClient.get<{ success: boolean; data: string[] }>(
      ENDPOINTS.HOTSPOTS.GET_DISEASES,
    );
    return response.data.data;
  },
};
