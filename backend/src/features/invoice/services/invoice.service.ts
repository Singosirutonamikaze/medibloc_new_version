/**
 * @file invoice.service.ts
 * @description Logique metier et persistance Prisma pour les factures et reglements.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Invoice, Payment } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
} from "../dtos/invoice.dto";

const invoiceInclude = {
  appointment: true,
  patient: { include: { user: true } },
  payments: true,
};

export const findAllInvoices = async (): Promise<Invoice[]> => {
  return prisma.invoice.findMany({
    include: invoiceInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const findInvoiceById = async (id: number): Promise<Invoice> => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });

  const exists = invoice !== null;
  const invoiceResolvers: Record<string, () => Invoice> = {
    true: () => invoice as Invoice,
    false: () => {
      throw new Error("Facture introuvable");
    },
  };

  return invoiceResolvers[String(exists)]();
};

export const createInvoice = async (
  dto: CreateInvoiceDto
): Promise<Invoice> => {
  return prisma.invoice.create({
    data: {
      appointmentId: dto.appointmentId,
      patientId: dto.patientId,
      amount: dto.amount,
      currency: dto.currency || "XOF",
    },
    include: invoiceInclude,
  });
};

export const updateInvoice = async (
  id: number,
  dto: UpdateInvoiceDto
): Promise<Invoice> => {
  return prisma.invoice.update({
    where: { id },
    data: dto,
    include: invoiceInclude,
  });
};

export const deleteInvoice = async (id: number): Promise<Invoice> => {
  return prisma.invoice.delete({
    where: { id },
  });
};

export const addPaymentToInvoice = async (
  invoiceId: number,
  dto: CreatePaymentDto
): Promise<Payment> => {
  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: dto.amount,
      method: dto.method,
      status: "SUCCESS",
      transactionRef: dto.transactionRef || undefined,
      paidAt: new Date(),
    },
  });

  // Mettre a jour le statut de la facture si soldee
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });

  const totalPaid = (invoice ? invoice.payments : []).reduce(
    (acc, p) => acc + p.amount,
    0
  );
  const isSettled = invoice ? totalPaid >= invoice.amount : false;

  const updateStatusMap: Record<string, () => Promise<void>> = {
    true: async () => {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID" },
      });
    },
    false: async () => undefined,
  };

  await updateStatusMap[String(isSettled)]();

  return payment;
};
