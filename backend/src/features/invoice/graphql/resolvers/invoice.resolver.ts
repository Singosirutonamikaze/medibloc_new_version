/**
 * @file invoice.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les factures.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { invoicesQuery, invoiceQuery } from "../queries/invoice.queries";
import {
  createInvoiceMutation,
  addPaymentMutation,
} from "../mutations/invoice.mutations";

export const invoiceResolvers = {
  Query: {
    invoices: invoicesQuery,
    invoice: invoiceQuery,
  },
  Mutation: {
    createInvoice: createInvoiceMutation,
    addPayment: addPaymentMutation,
  },
};

export default invoiceResolvers;
