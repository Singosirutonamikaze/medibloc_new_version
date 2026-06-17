import type { InvoiceStatus, PaymentMethod, PaymentStatus } from '../common/common.types';
import type { Patient } from '../patient/patient.types';
import type { Appointment } from '../appointment/appointment.types';

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: number;
  appointmentId: number;
  patientId: number;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  appointment?: Appointment;
  patient?: Patient;
  payments?: Payment[];
}

export interface CreateInvoiceDto {
  appointmentId: number;
  patientId: number;
  amount: number;
  currency?: string;
}

export interface UpdateInvoiceDto {
  amount?: number;
  currency?: string;
  status?: InvoiceStatus;
}

export interface CreatePaymentDto {
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
}
