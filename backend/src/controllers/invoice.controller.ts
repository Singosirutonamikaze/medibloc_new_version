import { Request, Response } from "express";
import {
  Invoice,
  Payment,
  Prisma,
  InvoiceStatus,
  PaymentStatus,
} from "@prisma/client";
import prisma from "../config/database";
import GenericController from "../gen/generic.controller";
import { ApiResponse } from "../types";

type InvoiceCreateInput = Prisma.InvoiceCreateInput;
type InvoiceUpdateInput = Prisma.InvoiceUpdateInput;

export class InvoiceController {
  private readonly generic: GenericController<
    Invoice,
    InvoiceCreateInput,
    InvoiceUpdateInput
  >;

  public getAllInvoices: (req: Request, res: Response) => Promise<Response>;
  public getInvoiceById: (req: Request, res: Response) => Promise<Response>;
  public createInvoice: (req: Request, res: Response) => Promise<Response>;
  public updateInvoice: (req: Request, res: Response) => Promise<Response>;
  public deleteInvoice: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.InvoiceFindManyArgs) =>
        prisma.invoice.findMany({
          ...params,
          include: {
            patient: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            appointment: true,
            payments: true,
          },
        }),
      findUnique: (params: Prisma.InvoiceFindUniqueArgs) =>
        prisma.invoice.findUnique({
          ...params,
          include: {
            patient: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            },
            appointment: {
              include: {
                doctor: {
                  include: {
                    user: { select: { firstName: true, lastName: true } },
                  },
                },
              },
            },
            payments: true,
          },
        }),
      create: (params: { data: InvoiceCreateInput }) =>
        prisma.invoice.create({ data: params.data }),
      update: (params: { where: { id: number }; data: InvoiceUpdateInput }) =>
        prisma.invoice.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.invoice.delete({ where: params.where }),
      count: (params?: Prisma.InvoiceCountArgs) => prisma.invoice.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllInvoices = this.generic.getAll;
    this.getInvoiceById = this.generic.getOne;
    this.createInvoice = this.generic.create;
    this.updateInvoice = this.generic.update;
    this.deleteInvoice = this.generic.delete;
  }

  // Get Invoices of a specific patient
  public getPatientInvoices = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Invoice[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant patient invalide" };
      } else {
        const invoices = await prisma.invoice.findMany({
          where: { patientId },
          include: {
            appointment: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        });
        response = { success: true, data: invoices };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Create a payment for an invoice
  public createPayment = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 201;
    let response: ApiResponse<Payment> = { success: true };
    try {
      const invoiceId = Number(req.params.id);
      const { amount, method, transactionRef } = req.body;

      if (!invoiceId || !amount || !method) {
        status = 400;
        response = {
          success: false,
          error: "invoiceId, amount et method sont requis",
        };
      } else {
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
          include: { payments: true },
        });

        if (!invoice) {
          status = 404;
          response = { success: false, error: "Facture non trouvée" };
        } else {
          const paymentStatus = PaymentStatus.SUCCESS;
          const paidAt = new Date();

          const payment = await prisma.payment.create({
            data: {
              invoiceId,
              amount: Number(amount),
              method,
              status: paymentStatus,
              transactionRef:
                transactionRef ||
                `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              paidAt,
            },
          });

          const totalPaid =
            invoice.payments
              .filter((p) => p.status === PaymentStatus.SUCCESS)
              .reduce((sum, p) => sum + p.amount, 0) + Number(amount);

          let newInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;
          if (totalPaid >= invoice.amount) {
            newInvoiceStatus = InvoiceStatus.PAID;
          } else if (totalPaid > 0) {
            newInvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
          }

          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: newInvoiceStatus },
          });

          response = { success: true, data: payment };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };
}
