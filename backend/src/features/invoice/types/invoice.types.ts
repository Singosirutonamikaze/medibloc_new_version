/**
 * @file invoice.types.ts
 * @description Types d'alias pour les factures.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Invoice, Appointment, Patient, Payment, User } from "@prisma/client";

export type InvoiceFull = Invoice & {
  readonly appointment: Appointment;
  readonly patient: Patient & { user: User };
  readonly payments: Payment[];
};
