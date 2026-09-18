/**
 * @file invoice.controller.ts
 * @description Controleur HTTP Express pour la gestion des factures et paiements.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllInvoices,
  findInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPaymentToInvoice,
} from "../services/invoice.service";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
} from "../dtos/invoice.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const invoices = await findAllInvoices();
    return successResponse(
      res,
      invoices,
      "Factures recuperees avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const invoice = await findInvoiceById(id);
    return successResponse(
      res,
      invoice,
      "Facture recuperee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateInvoiceDto = req.body;
    const created = await createInvoice(dto);
    return successResponse(
      res,
      created,
      "Facture emise avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateInvoiceDto = req.body;
    const updated = await updateInvoice(id, dto);
    return successResponse(
      res,
      updated,
      "Facture mise a jour avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteInvoice(id);
    return successResponse(
      res,
      deleted,
      "Facture supprimee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const recordPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: CreatePaymentDto = req.body;
    const payment = await addPaymentToInvoice(id, dto);
    return successResponse(
      res,
      payment,
      "Reglement enregistre avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
