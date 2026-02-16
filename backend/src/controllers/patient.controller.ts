import { Request, Response } from 'express';
import { Patient, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PatientCreateInput = Prisma.PatientCreateInput;
type PatientUpdateInput = Prisma.PatientUpdateInput;

export class PatientController {
  private readonly generic: GenericController<Patient, PatientCreateInput, PatientUpdateInput>;

  public getAllPatients: (req: Request, res: Response) => Promise<Response>;
  public createPatient: (req: Request, res: Response) => Promise<Response>;
  public getPatientById: (req: Request, res: Response) => Promise<Response>;
  public updatePatient: (req: Request, res: Response) => Promise<Response>;
  public deletePatient: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.PatientFindManyArgs) =>
        prisma.patient.findMany(params),
      findUnique: (params: Prisma.PatientFindUniqueArgs) =>
        prisma.patient.findUnique(params),
      create: (params: { data: PatientCreateInput }) =>
        prisma.patient.create({ data: params.data }),
      update: (params: { where: { id: number }; data: PatientUpdateInput }) =>
        prisma.patient.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.patient.delete({ where: params.where }),
      count: (params?: Prisma.PatientCountArgs) =>
        prisma.patient.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllPatients = this.generic.getAll;
    this.createPatient = this.generic.create;
    this.getPatientById = this.generic.getOne;
    this.updatePatient = this.generic.update;
    this.deletePatient = this.generic.delete;
  }

  public getPatientDiseases = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prisma.PatientDiseaseGetPayload<{ include: { disease: true } }>[] | null> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const patient = await prisma.patient.findUnique({
          where: { id },
          include: { diseases: { include: { disease: true } } }
        });
        if (patient) {
          response = { success: true, data: patient.diseases };
        } else {
          status = 404;
          response = { success: false, error: 'Patient non trouvé' };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prisma.AppointmentGetPayload<{}>[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const appointments = await prisma.appointment.findMany({ where: { patientId: id } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prisma.PrescriptionGetPayload<{}>[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { patientId: id } });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
