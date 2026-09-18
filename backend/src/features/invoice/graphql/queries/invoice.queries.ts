/**
 * @file invoice.queries.ts
 * @description Requetes GraphQL pour les factures.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Invoice } from "@prisma/client";
import {
  findAllInvoices,
  findInvoiceById,
} from "../../services/invoice.service";

export const invoicesQuery = async (
  _parent: void
): Promise<Invoice[]> => {
  return findAllInvoices();
};

export const invoiceQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Invoice> => {
  return findInvoiceById(args.id);
};
