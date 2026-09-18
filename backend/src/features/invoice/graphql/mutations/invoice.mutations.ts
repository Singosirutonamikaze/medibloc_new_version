/**
 * @file invoice.mutations.ts
 * @description Mutations GraphQL pour la facturation et les paiements.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Invoice, Payment } from "@prisma/client";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPaymentToInvoice,
} from "../../services/invoice.service";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
} from "../../dtos/invoice.dto";

export const createInvoiceMutation = async (
  _parent: void,
  args: { input: CreateInvoiceDto }
): Promise<Invoice> => {
  return createInvoice(args.input);
};

export const updateInvoiceMutation = async (
  _parent: void,
  args: { id: number; input: UpdateInvoiceDto }
): Promise<Invoice> => {
  return updateInvoice(args.id, args.input);
};

export const deleteInvoiceMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Invoice> => {
  return deleteInvoice(args.id);
};

export const addPaymentMutation = async (
  _parent: void,
  args: { invoiceId: number; input: CreatePaymentDto }
): Promise<Payment> => {
  return addPaymentToInvoice(args.invoiceId, args.input);
};
