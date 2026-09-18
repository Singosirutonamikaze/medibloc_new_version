/**
 * @file mock-data.ts
 * @description Centralisation des jeux de donnees de test et fixtures pour l'ensemble de la suite Vitest.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Role, AppointmentStatus, MedicineType, Gender } from "@prisma/client";

/**
 * @description Jeu de donnees mock pour les utilisateurs.
 */
export const mockUserData = {
  admin: {
    id: 1,
    email: "admin@medibloc.com",
    role: Role.ADMIN,
    firstName: "Admin",
    lastName: "User",
    password: "$2a$10$hashedPasswordValueForTestUserMocking1234567890",
    avatarUrl: null,
    isEmailVerified: true,
    createdAt: new Date("2026-09-17T00:00:00.000Z"),
    updatedAt: new Date("2026-09-17T00:00:00.000Z"),
  },
  doctor: {
    id: 2,
    email: "doctor@medibloc.com",
    role: Role.DOCTOR,
    firstName: "Dr. Koffi",
    lastName: "Komla",
    password: "$2a$10$hashedPasswordValueForTestUserMocking1234567890",
    avatarUrl: null,
    isEmailVerified: true,
    createdAt: new Date("2026-09-17T00:00:00.000Z"),
    updatedAt: new Date("2026-09-17T00:00:00.000Z"),
  },
  patient: {
    id: 3,
    email: "patient@medibloc.com",
    role: Role.PATIENT,
    firstName: "Jean",
    lastName: "Kouassi",
    password: "$2a$10$hashedPasswordValueForTestUserMocking1234567890",
    avatarUrl: null,
    isEmailVerified: true,
    createdAt: new Date("2026-09-17T00:00:00.000Z"),
    updatedAt: new Date("2026-09-17T00:00:00.000Z"),
  },
};

/**
 * @description Jeu de donnees mock pour les patients.
 */
export const mockPatientData = {
  id: 1,
  userId: 3,
  birthDate: new Date("1990-01-01"),
  gender: Gender.MALE,
  phone: "+2250102030405",
  address: "Abidjan, Cocody",
  user: mockUserData.patient,
  diseases: [],
  appointments: [],
  prescriptions: [],
};

/**
 * @description Jeu de donnees mock pour les medecins.
 */
export const mockDoctorData = {
  id: 1,
  userId: 2,
  specialty: "Cardiologie",
  phone: "+2250506070809",
  user: mockUserData.doctor,
  availabilities: [],
  timeOffs: [],
  appointments: [],
  prescriptions: [],
};

/**
 * @description Jeu de donnees mock pour les rendez-vous.
 */
export const mockAppointmentData = {
  id: 1,
  patientId: 1,
  doctorId: 1,
  scheduledAt: new Date("2026-09-20T10:00:00.000Z"),
  reason: "Consultation de routine",
  notes: "Patient a jeun",
  status: AppointmentStatus.PENDING,
};

/**
 * @description Jeu de donnees mock pour les pathologies.
 */
export const mockDiseaseData = {
  id: 1,
  name: "Paludisme",
  description: "Infection parasitaire transmise par les moustiques",
  isViral: false,
  isBacterial: false,
  isGenetic: false,
  isChronic: false,
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
  updatedAt: new Date("2026-09-17T00:00:00.000Z"),
};

/**
 * @description Jeu de donnees mock pour les symptomes.
 */
export const mockSymptomData = {
  id: 1,
  name: "Fievre",
  description: "Elevation anormale de la temperature corporelle",
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
};

/**
 * @description Jeu de donnees mock pour les medicaments.
 */
export const mockMedicineData = {
  id: 1,
  name: "Paracetamol",
  type: MedicineType.PHARMACEUTICAL,
  description: "Antalgique et antipyretique",
  composition: "Paracetamol 500mg",
  scientificName: "Acetaminophen",
  commonNames: ["Doliprane", "Efferalgan"],
  pharmacyId: 1,
  sideEffects: ["Troubles hepatiques en cas de surdosage"],
  contraindications: ["Insuffisance hepatique severe"],
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
  updatedAt: new Date("2026-09-17T00:00:00.000Z"),
};

/**
 * @description Jeu de donnees mock pour les pharmacies.
 */
export const mockPharmacyData = {
  id: 1,
  name: "Grande Pharmacie de Cocody",
  address: "Boulevard de France",
  city: "Abidjan",
  countryId: 1,
  phone: "+2252722440000",
  email: "contact@pharmacie-cocody.ci",
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
  updatedAt: new Date("2026-09-17T00:00:00.000Z"),
};

/**
 * @description Jeu de donnees mock pour les ordonnances.
 */
export const mockPrescriptionData = {
  id: 1,
  doctorId: 1,
  patientId: 1,
  medications: "Paracetamol 1g matin, midi et soir pendant 5 jours",
  diagnosis: "Syndrome febril",
  notes: "Boire beaucoup d'eau",
  issuedAt: new Date("2026-09-17T00:00:00.000Z"),
};

/**
 * @description Jeu de donnees mock pour les dossiers medicaux.
 */
export const mockMedicalRecordData = {
  id: 1,
  patientId: 1,
  title: "Bilan cardiologique annuel",
  content: "Rythme sinusal regulier, pas de signe d'insuffisance.",
  files: [],
  createdAt: new Date("2026-09-17T00:00:00.000Z"),
};
