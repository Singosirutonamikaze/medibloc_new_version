/**
 * @file invoice.interface.ts
 * @description Interfaces pour les factures medicales.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Invoice as PrismaInvoice, Appointment, Patient, Payment } from "@prisma/client";

export interface InvoiceWithRelations extends PrismaInvoice {
  readonly appointment?: Appointment;
  readonly patient?: Patient;
  readonly payments?: Payment[];
}
