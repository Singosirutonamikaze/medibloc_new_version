/**
 * @file global.types.ts
 * @description Contrats d'interfaces, types globaux et DTOs transversaux du backend MediBloc.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  AppointmentStatus,
  DiseaseSeverity,
  DiseaseStatus,
  Gender,
  InvoiceStatus,
  MedicineType,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  Role,
} from "@prisma/client";
import { Request } from "express";

/**
 * @interface AuthenticatedUser
 * @description Utilisateur authentifie transportant les revendications principales du jeton de securite.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: Role;
}

/**
 * @interface User
 * @description Entite utilisateur complete persistee dans la base de donnees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * @interface ApiResponse
 * @description Format standardise des reponses API renvoyees aux clients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * @interface PaginatedResponse
 * @description Structure des reponses paginees standardisees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * @interface AuthRequest
 * @description Requete Express enrichie des donnees de session de l'utilisateur authentifie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * @interface RegisterUserDto
 * @description Donnees requises pour l'enregistrement d'un utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

/**
 * @interface LoginDto
 * @description Donnees de connexion utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * @interface JwtPayload
 * @description Charge utile encodee dans le jeton JWT.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface JwtPayload extends AuthenticatedUser {}

/**
 * @interface CreatePatientDto
 * @description Donnees de creation d'un profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreatePatientDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

/**
 * @interface UpdatePatientDto
 * @description Donnees de mise a jour d'un profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

/**
 * @interface PatientResponse
 * @description Donnees de reponse d'un profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PatientResponse {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
  birthDate?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
}

/**
 * @interface CreateDoctorDto
 * @description Donnees de creation d'un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateDoctorDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
}

/**
 * @interface UpdateDoctorDto
 * @description Donnees de mise a jour d'un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateDoctorDto {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  phone?: string;
}

/**
 * @interface DoctorResponse
 * @description Donnees de reponse d'un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DoctorResponse {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
  specialty?: string;
  phone?: string;
}

/**
 * @interface CreateAppointmentDto
 * @description Donnees de creation d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
}

/**
 * @interface UpdateAppointmentDto
 * @description Donnees de mise a jour d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateAppointmentDto {
  scheduledAt?: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

/**
 * @interface AppointmentResponse
 * @description Donnees de reponse d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface AppointmentResponse {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty?: string;
  };
}

/**
 * @interface CreateDiseaseDto
 * @description Donnees de creation d'une maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateDiseaseDto {
  name: string;
  description?: string;
  isViral?: boolean;
  isBacterial?: boolean;
  isGenetic?: boolean;
  isChronic?: boolean;
}

/**
 * @interface UpdateDiseaseDto
 * @description Donnees de mise a jour d'une maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateDiseaseDto {
  name?: string;
  description?: string;
  isViral?: boolean;
  isBacterial?: boolean;
  isGenetic?: boolean;
  isChronic?: boolean;
}

/**
 * @interface DiseaseResponse
 * @description Donnees de reponse d'une maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DiseaseResponse {
  id: number;
  name: string;
  description?: string;
  isViral: boolean;
  isBacterial: boolean;
  isGenetic: boolean;
  isChronic: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface CreateSymptomDto
 * @description Donnees de creation d'un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateSymptomDto {
  name: string;
  description?: string;
}

/**
 * @interface UpdateSymptomDto
 * @description Donnees de mise a jour d'un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateSymptomDto {
  name?: string;
  description?: string;
}

/**
 * @interface SymptomResponse
 * @description Donnees de reponse d'un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface SymptomResponse {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

/**
 * @interface CreateMedicineDto
 * @description Donnees de creation d'un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateMedicineDto {
  name: string;
  type: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames?: string[];
  pharmacyId?: number;
  sideEffects?: string[];
  contraindications?: string[];
}

/**
 * @interface UpdateMedicineDto
 * @description Donnees de mise a jour d'un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateMedicineDto {
  name?: string;
  type?: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames?: string[];
  pharmacyId?: number;
  sideEffects?: string[];
  contraindications?: string[];
}

/**
 * @interface MedicineResponse
 * @description Donnees de reponse d'un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface MedicineResponse {
  id: number;
  name: string;
  type: MedicineType;
  description?: string;
  composition?: string;
  scientificName?: string;
  commonNames: string[];
  pharmacyId?: number;
  sideEffects: string[];
  contraindications: string[];
  createdAt: string;
  updatedAt: string;
  pharmacy?: {
    name: string;
    city: string;
  };
}

/**
 * @interface CreatePharmacyDto
 * @description Donnees de creation d'une pharmacie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreatePharmacyDto {
  name: string;
  address: string;
  city: string;
  countryId: number;
  phone?: string;
  email?: string;
}

/**
 * @interface UpdatePharmacyDto
 * @description Donnees de mise a jour d'une pharmacie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePharmacyDto {
  name?: string;
  address?: string;
  city?: string;
  countryId?: number;
  phone?: string;
  email?: string;
}

/**
 * @interface PharmacyResponse
 * @description Donnees de reponse d'une pharmacie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PharmacyResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  countryId: number;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  country: {
    name: string;
    code: string;
  };
}

/**
 * @interface CreatePrescriptionDto
 * @description Donnees de creation d'une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreatePrescriptionDto {
  doctorId: number;
  patientId: number;
  medications: string;
  diagnosis?: string;
  notes?: string;
}

/**
 * @interface PrescriptionResponse
 * @description Donnees de reponse d'une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PrescriptionResponse {
  id: number;
  doctorId: number;
  patientId: number;
  medications: string;
  diagnosis?: string;
  notes?: string;
  issuedAt: string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty?: string;
  };
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

/**
 * @interface CreateMedicalRecordDto
 * @description Donnees de creation d'un dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateMedicalRecordDto {
  patientId: number;
  title: string;
  content: string;
  files?: string[];
}

/**
 * @interface UpdateMedicalRecordDto
 * @description Donnees de mise a jour d'un dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateMedicalRecordDto {
  title?: string;
  content?: string;
  files?: string[];
}

/**
 * @interface MedicalRecordResponse
 * @description Donnees de reponse d'un dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface MedicalRecordResponse {
  id: number;
  patientId: number;
  title: string;
  content: string;
  files: string[];
  createdAt: string;
}

/**
 * @interface CreatePatientDiseaseDto
 * @description Donnees d'association d'une pathologie a un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreatePatientDiseaseDto {
  patientId: number;
  diseaseId: number;
  status?: DiseaseStatus;
  severity?: DiseaseSeverity;
  notes?: string;
}

/**
 * @interface UpdatePatientDiseaseDto
 * @description Donnees de mise a jour d'une pathologie patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePatientDiseaseDto {
  status?: DiseaseStatus;
  severity?: DiseaseSeverity;
  notes?: string;
}

/**
 * @interface PatientDiseaseResponse
 * @description Donnees de reponse d'une pathologie patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PatientDiseaseResponse {
  id: number;
  patientId: number;
  diseaseId: number;
  diagnosedAt: string;
  status: DiseaseStatus;
  severity: DiseaseSeverity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  disease: DiseaseResponse;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

/**
 * @interface PaginationParams
 * @description Parametres generaux de pagination et de tri.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * @interface AppointmentFilter
 * @description Filtres de recherche pour les rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface AppointmentFilter extends PaginationParams {
  patientId?: number;
  doctorId?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
}

/**
 * @interface PatientFilter
 * @description Filtres de recherche pour les patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PatientFilter extends PaginationParams {
  search?: string;
  gender?: Gender;
}

/**
 * @interface MedicineFilter
 * @description Filtres de recherche pour les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface MedicineFilter extends PaginationParams {
  type?: MedicineType;
  search?: string;
  pharmacyId?: number;
}

/**
 * @interface DashboardStats
 * @description Statistiques globales du tableau de bord.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  upcomingAppointments: number;
  recentPrescriptions: number;
}

/**
 * @interface DiseaseStats
 * @description Statistiques epidemiologiques par maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DiseaseStats {
  diseaseId: number;
  diseaseName: string;
  totalCases: number;
  activeCases: number;
  curedCases: number;
}

/**
 * @interface LoginFormData
 * @description Formulaire de saisie pour la connexion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * @interface RegisterFormData
 * @description Formulaire de saisie pour l'inscription.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: Role;
}

/**
 * @interface AppointmentFormData
 * @description Formulaire de prise de rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface AppointmentFormData {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  reason: string;
  notes?: string;
}

/**
 * @interface ValidationError
 * @description Detail d'erreur de validation d'un champ.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * @interface ApiError
 * @description Structure d'erreur normalisee renvoyee par l'API.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface ApiError {
  success: false;
  error: string;
  details?: ValidationError[];
  code?: number;
}

/**
 * @type SanitizedUser
 * @description Profil utilisateur securise sans mot de passe.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type SanitizedUser = Omit<User, "password">;

/**
 * @description Re-export des types d'epidemio-surveillance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type {
  DiseaseHotspot,
  EpiSource,
  HotspotApiResponse,
  HotspotsQueryParams,
  RawHotspot,
} from "../epidemio/epidemio.types";

/**
 * @interface CreateDiscussionDto
 * @description Donnees de creation d'une discussion medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateDiscussionDto {
  patientId: number;
  doctorId: number;
}

/**
 * @interface DiscussionResponse
 * @description Donnees de reponse d'une discussion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DiscussionResponse {
  id: number;
  patientId: number;
  doctorId: number;
  createdAt: string;
  doctor?: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty?: string;
  };
  patient?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  messages?: MessageResponse[];
}

/**
 * @interface CreateMessageDto
 * @description Donnees de creation d'un message dans une discussion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateMessageDto {
  discussionId: number;
  senderRole: Role;
  content?: string;
  fileUrl?: string;
}

/**
 * @interface MessageResponse
 * @description Donnees de reponse d'un message.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface MessageResponse {
  id: number;
  discussionId: number;
  senderRole: Role;
  content?: string;
  fileUrl?: string;
  isRead: boolean;
  readAt?: string;
  sentAt: string;
  deletedAt?: string;
}

/**
 * @interface CreateInvoiceDto
 * @description Donnees de creation d'une facture.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateInvoiceDto {
  appointmentId: number;
  patientId: number;
  amount: number;
  currency?: string;
}

/**
 * @interface UpdateInvoiceDto
 * @description Donnees de mise a jour d'une facture.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateInvoiceDto {
  amount?: number;
  currency?: string;
  status?: InvoiceStatus;
}

/**
 * @interface InvoiceResponse
 * @description Donnees de reponse d'une facture.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface InvoiceResponse {
  id: number;
  appointmentId: number;
  patientId: number;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  payments?: PaymentResponse[];
  patient?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

/**
 * @interface CreatePaymentDto
 * @description Donnees de creation d'un paiement.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreatePaymentDto {
  invoiceId: number;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
}

/**
 * @interface UpdatePaymentDto
 * @description Donnees de mise a jour d'un paiement.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePaymentDto {
  status?: PaymentStatus;
  paidAt?: string;
}

/**
 * @interface PaymentResponse
 * @description Donnees de reponse d'un paiement.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface PaymentResponse {
  id: number;
  invoiceId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
}

/**
 * @interface CreateNotificationDto
 * @description Donnees de creation d'une notification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  content?: string;
  linkUrl?: string;
}

/**
 * @interface NotificationResponse
 * @description Donnees de reponse d'une notification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface NotificationResponse {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  content?: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

/**
 * @interface CreateReviewDto
 * @description Donnees de creation d'un avis medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface CreateReviewDto {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment?: string;
}

/**
 * @interface ReviewResponse
 * @description Donnees de reponse d'un avis medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface ReviewResponse {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  doctor?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  patient?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
