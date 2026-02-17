import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from './api';
import { storageService } from '../../services/storage/storage.service';

/**
 * Instance Axios configurée pour l'API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Intercepteur de requête pour ajouter le token d'authentification
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse pour gérer les erreurs
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      storageService.removeToken();
      storageService.removeUser();
      globalThis.location.href = '/login';
    }

    // Gérer les erreurs de permissions
    if (error.response?.status === 403) {
      console.error('Accès refusé : Permissions insuffisantes');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
