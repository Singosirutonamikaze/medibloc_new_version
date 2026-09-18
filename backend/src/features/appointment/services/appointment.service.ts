/**
 * @file appointment.service.ts
 * @description Logique metier pure et acces persistant Prisma pour les rendez-vous medicaux.
 * Aucune instruction conditionnelle imperative n'est employee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Appointment, AppointmentStatus } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../dtos/appointment.dto";
import { DetailedAppointment } from "../interfaces/appointment.interface";

/**
 * @description Recupere la liste de tous les rendez-vous enregistres avec les profils associes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Promesse contenant la collection de {@link DetailedAppointment}.
 */
export const findAllAppointments = async (): Promise<DetailedAppointment[]> => {
  return prisma.appointment.findMany({
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

/**
 * @description Recherche un rendez-vous specifique a partir de son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique du rendez-vous.
 * @returns Instance enrichie {@link DetailedAppointment}.
 * @throws Error Lorsque le rendez-vous n'existe pas.
 */
export const findAppointmentById = async (id: number): Promise<DetailedAppointment> => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
  });

  const actionMap: Record<string, () => DetailedAppointment> = {
    true: () => appointment as DetailedAppointment,
    false: () => {
      throw new Error("Rendez-vous introuvable");
    },
  };

  const isFound = Boolean(appointment);
  return actionMap[String(isFound)]();
};

/**
 * @description Enregistre un nouveau rendez-vous medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees de reservation conformes a {@link CreateAppointmentDto}.
 * @returns Instance persistee {@link Appointment}.
 */
export const createAppointment = async (dto: CreateAppointmentDto): Promise<Appointment> => {
  const scheduledDate = new Date(dto.scheduledAt);

  return prisma.appointment.create({
    data: {
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      scheduledAt: scheduledDate,
      reason: dto.reason || "Consultation generale",
      notes: dto.notes || null,
      status: AppointmentStatus.PENDING,
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
  });
};

/**
 * @description Met a jour les parametres d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du rendez-vous.
 * @param dto Donnees de mise a jour {@link UpdateAppointmentDto}.
 * @returns Instance mise a jour.
 */
export const updateAppointment = async (
  id: number,
  dto: UpdateAppointmentDto
): Promise<Appointment> => {
  return prisma.appointment.update({
    where: { id },
    data: {
      ...(dto.scheduledAt ? { scheduledAt: new Date(dto.scheduledAt) } : {}),
      ...(dto.reason ? { reason: dto.reason } : {}),
      ...(dto.notes ? { notes: dto.notes } : {}),
      ...(dto.status ? { status: dto.status } : {}),
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
  });
};

/**
 * @description Modifie le statut d'avancement d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du rendez-vous.
 * @param status Nouveau statut valide.
 * @returns Instance mise a jour.
 */
export const updateAppointmentStatus = async (
  id: number,
  status: AppointmentStatus
): Promise<Appointment> => {
  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
};

/**
 * @description Supprime definitivement un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant du rendez-vous.
 * @returns Instance supprimee.
 */
export const deleteAppointment = async (id: number): Promise<Appointment> => {
  return prisma.appointment.delete({
    where: { id },
  });
};

/**
 * @description Recupere tous les rendez-vous associes a un patient donne.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param patientId Identifiant numerique du patient.
 * @returns Liste des rendez-vous.
 */
export const findPatientAppointments = async (
  patientId: number
): Promise<DetailedAppointment[]> => {
  return prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: { include: { user: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

/**
 * @description Recupere tous les rendez-vous attribues a un medecin donne.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param doctorId Identifiant numerique du praticien.
 * @returns Liste des rendez-vous.
 */
export const findDoctorAppointments = async (
  doctorId: number
): Promise<DetailedAppointment[]> => {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: { include: { user: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
};
