/**
 * @file invoice.dto.ts
 * @description Objets de transfert de donnees pour les factures et reglements.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { InvoiceStatus, PaymentMethod } from "@prisma/client";

export interface CreateInvoiceDto {
  readonly appointmentId: number;
  readonly patientId: number;
  readonly amount: number;
  readonly currency?: string;
}

export interface UpdateInvoiceDto {
  readonly status?: InvoiceStatus;
  readonly amount?: number;
}

export interface CreatePaymentDto {
  readonly amount: number;
  readonly method: PaymentMethod;
  readonly transactionRef?: string;
}
