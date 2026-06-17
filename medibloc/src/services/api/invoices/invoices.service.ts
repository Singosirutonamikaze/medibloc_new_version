import apiClient from '../../../utils/api/apiClient';
import { ENDPOINTS } from '../../../utils/api/api';
import type { Invoice, Payment, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, ApiResponse } from '../../../types';

export const invoicesService = {
  /**
   * Récupérer toutes les factures
   */
  getAll: async (): Promise<Invoice[]> => {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(ENDPOINTS.INVOICES.GET_ALL);
    return response.data.data ?? [];
  },

  /**
   * Récupérer une facture par ID
   */
  getById: async (id: number): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(ENDPOINTS.INVOICES.GET_BY_ID(id));
    if (!response.data.data) {
      throw new Error('Facture non trouvée');
    }
    return response.data.data;
  },

  /**
   * Créer une facture
   */
  create: async (data: CreateInvoiceDto): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(ENDPOINTS.INVOICES.CREATE, data);
    if (!response.data.data) {
      throw new Error('Impossible de créer la facture');
    }
    return response.data.data;
  },

  /**
   * Mettre à jour une facture
   */
  update: async (id: number, data: UpdateInvoiceDto): Promise<Invoice> => {
    const response = await apiClient.put<ApiResponse<Invoice>>(ENDPOINTS.INVOICES.UPDATE(id), data);
    if (!response.data.data) {
      throw new Error('Impossible de mettre à jour la facture');
    }
    return response.data.data;
  },

  /**
   * Supprimer une facture
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.INVOICES.DELETE(id));
  },

  /**
   * Récupérer les factures d'un patient
   */
  getByPatient: async (patientId: number): Promise<Invoice[]> => {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(ENDPOINTS.INVOICES.GET_BY_PATIENT(patientId));
    return response.data.data ?? [];
  },

  /**
   * Payer une facture (créer un paiement)
   */
  pay: async (id: number, data: CreatePaymentDto): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(ENDPOINTS.INVOICES.PAY(id), data);
    if (!response.data.data) {
      throw new Error('Impossible de traiter le paiement');
    }
    return response.data.data;
  },
};
