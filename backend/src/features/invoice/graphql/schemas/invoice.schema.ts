/**
 * @file invoice.schema.ts
 * @description Schema GraphQL SDL pour les factures et reglements.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const invoiceTypeDefs = `#graphql
  enum InvoiceStatus {
    PENDING
    PAID
    CANCELLED
    REFUNDED
  }

  enum PaymentMethod {
    CASH
    CREDIT_CARD
    MOBILE_MONEY
    BANK_TRANSFER
    INSURANCE
  }

  type Payment {
    id: Int!
    invoiceId: Int!
    amount: Float!
    method: PaymentMethod!
    status: String!
    transactionRef: String
    paidAt: String
  }

  type Invoice {
    id: Int!
    appointmentId: Int!
    patientId: Int!
    amount: Float!
    currency: String!
    status: InvoiceStatus!
    createdAt: String!
    updatedAt: String!
    patient: Patient
    payments: [Payment!]!
  }

  input CreateInvoiceInput {
    appointmentId: Int!
    patientId: Int!
    amount: Float!
    currency: String
  }

  input AddPaymentInput {
    invoiceId: Int!
    amount: Float!
    method: PaymentMethod!
    transactionRef: String
  }

  extend type Query {
    invoices: [Invoice!]!
    invoice(id: Int!): Invoice
  }

  extend type Mutation {
    createInvoice(input: CreateInvoiceInput!): Invoice!
    addPayment(input: AddPaymentInput!): Payment!
  }
`;
