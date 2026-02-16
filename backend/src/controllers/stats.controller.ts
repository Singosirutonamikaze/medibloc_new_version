import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export class StatsController {
  public getOverview = async (_req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Record<string, unknown>> = { success: true, data: {} };
    try {
      const users = await prisma.user.count();
      const patients = await prisma.patient.count();
      const doctors = await prisma.doctor.count();
      const appointments = await prisma.appointment.count();

      response = {
        success: true,
        data: { users, patients, doctors, appointments },
      };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getDashboardStats = this.getOverview;

  public getDiseaseStats = async (_req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Record<string, unknown>> = { success: true, data: {} };
    try {
      const total = await prisma.disease.count();
      // simple example: return total diseases
      response = { success: true, data: { total } };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getAppointmentStats = async (_req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Record<string, unknown>> = { success: true, data: {} };
    try {
      const total = await prisma.appointment.count();
      response = { success: true, data: { total } };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientStats = async (_req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Record<string, unknown>> = { success: true, data: {} };
    try {
      const total = await prisma.patient.count();
      response = { success: true, data: { total } };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
