import { Request, Response, NextFunction } from "express";
import { vi } from "vitest";

// Types génériques pour les body des requêtes
type RequestBody = Record<string, string | number | boolean | Date | string[] | number[]>;

// Types pour les payloads
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type LoginPayload = { email: string; password: string };
export type AppointmentPayload = {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  [key: string]: string | number;
};

// Mock auth middleware
vi.mock("../../src/middleware/auth.middleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
  requireRole: () => (req: Request, res: Response, next: NextFunction) => next(),
  checkResourceOwnership: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

// Mock AuthController
vi.mock("../../src/controllers/auth.controller", () => ({
  AuthController: class {
    register = (req: Request<{}, {}, RegisterPayload>, res: Response) =>
      res.status(201).json({
        success: true,
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
      });
    login = (req: Request<{}, {}, LoginPayload>, res: Response) =>
      res.status(200).json({
        success: true,
        token: "fake-token",
        data: { email: req.body.email }
      });
    getCurrentUser = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: {
          id: 1,
          firstName: "koffi",
          lastName: "komla",
          email: "koffi@example.com",
        },
      });
    refreshToken = (req: Request, res: Response) =>
      res.status(200).json({ success: true, token: "refreshed-token" });
    logout = (req: Request, res: Response) =>
      res.status(200).json({ success: true });
  },
}));

// Factory pour créer des mocks de contrôleurs
const makeControllerMock = (resourceName: string) => ({
  [`${resourceName}Controller`]: class {
    // Methods communs
    getAll = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: [{ id: 1, firstName: "koffi", lastName: "komla" }],
      });

    // Patient methods
    getAllPatients = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: [{ id: 1, firstName: "koffi", lastName: "komla" }],
      });
    createPatient = (req: Request<{}, {}, RegisterPayload>, res: Response) =>
      res.status(201).json({
        success: true,
        data: { id: 2, firstName: req.body.firstName, lastName: req.body.lastName },
      });
    getPatientById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, firstName: "koffi", lastName: "komla" } });
    updatePatient = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deletePatient = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getPatientDiseases = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "TestDisease" }] });
    getPatientAppointments = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, patientName: "koffi komla" }] });

    // Appointment methods
    getAllAppointments = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: [{ id: 1, patientName: "koffi komla" }],
      });
    getAppointmentById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({
        success: true,
        data: {
          id: req.params.id ?? 1,
          patientId: 1,
          doctorId: 1,
          scheduledAt: new Date().toISOString()
        }
      });
    updateAppointment = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteAppointment = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    updateAppointmentStatus = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) => {
      const body = req.body;
      const status = typeof body.status === 'string' ? body.status : 'confirmed';
      return res.json({ success: true, data: { id: req.params.id ?? 1, status } });
    };
    createAppointment = (req: Request<{}, {}, AppointmentPayload>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });

    // Doctor methods
    getAllDoctors = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: [{ id: 1, firstName: "koffi", lastName: "komla" }],
      });
    createDoctor = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getDoctorById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, firstName: "koffi", lastName: "komla" } });
    updateDoctor = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteDoctor = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getDoctorAppointments = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, patientName: "koffi komla" }] });
    getSpecialties = (req: Request, res: Response) =>
      res.json({ success: true, data: ["Cardiology", "Dermatology"] });

    // Disease methods
    getAllDiseases = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "TestDisease" }] });
    createDisease = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getDiseaseById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, name: "TestDisease" } });
    updateDisease = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteDisease = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getDiseaseSymptoms = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "Cough" }] });
    getDiseaseCountries = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: ["Ghana", "Togo"] });
    addSymptomToDisease = (req: Request<{ id?: string; symptomId?: string }>, res: Response) =>
      res.status(201).json({ success: true });
    removeSymptomFromDisease = (req: Request<{ id?: string; symptomId?: string }>, res: Response) =>
      res.status(200).json({ success: true });

    // Symptom methods
    getAllSymptoms = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "Cough" }] });
    createSymptom = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getSymptomById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, name: "Cough" } });
    updateSymptom = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteSymptom = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getSymptomDiseases = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "TestDisease" }] });

    // Medicine methods
    getAllMedicines = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "Aspirin" }] });
    createMedicine = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getMedicineById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, name: "Aspirin" } });
    updateMedicine = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteMedicine = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getMedicinesByType = (req: Request<{ type?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, type: req.params.type ?? 'pill', name: 'Aspirin' }] });
    getMedicinesByPharmacy = (req: Request<{ pharmacyId?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, pharmacyId: req.params.pharmacyId ?? '1', name: 'Aspirin' }] });

    // Pharmacy methods
    getAllPharmacies = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: "Pharma" }] });
    createPharmacy = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getPharmacyById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, name: "Pharma" } });
    updatePharmacy = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deletePharmacy = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getPharmaciesByCountry = (req: Request<{ countryId?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, countryId: req.params.countryId ?? '1', name: 'Pharma' }] });
    getPharmacyMedicines = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, name: 'Aspirin' }] });

    // Prescription methods
    getAllPrescriptions = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, medications: "Aspirin" }] });
    createPrescription = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getPrescriptionById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, medications: "Aspirin" } });
    deletePrescription = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getPatientPrescriptions = (req: Request<{ patientId?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, patientId: req.params.patientId ?? '1', medications: 'Aspirin' }] });
    getDoctorPrescriptions = (req: Request<{ doctorId?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, doctorId: req.params.doctorId ?? '1', medications: 'Aspirin' }] });
    getPatientMedicalRecords = (req: Request<{ patientId?: string }>, res: Response) =>
      res.json({ success: true, data: [{ id: 1, patientId: req.params.patientId ?? '1', title: 'Record' }] });

    // MedicalRecord methods
    getAllMedicalRecords = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ id: 1, title: "Record" }] });
    createMedicalRecord = (req: Request<{}, {}, RequestBody>, res: Response) =>
      res.status(201).json({ success: true, data: { id: 2, ...req.body } });
    getMedicalRecordById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, title: "Record", content: "example" } });
    updateMedicalRecord = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteMedicalRecord = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });

    // Stats methods
    getDashboardStats = (req: Request, res: Response) =>
      res.json({ success: true, data: { totalPatients: 100, totalAppointments: 250 } });
    getDiseaseStats = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ disease: 'Flu', cases: 20 }] });
    getAppointmentStats = (req: Request, res: Response) =>
      res.json({ success: true, data: [{ status: 'confirmed', count: 150 }] });
    getPatientStats = (req: Request, res: Response) =>
      res.json({ success: true, data: { activePatients: 80 } });
    getStats = (req: Request, res: Response) =>
      res.json({ success: true, data: { patients: 10 } });

    // User methods
    getAllUsers = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: [{ id: 1, email: "koffi@example.com" }],
      });
    getUserById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, email: "koffi@example.com" } });
    updateUser = (req: Request<{ id?: string }, {}, RequestBody>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1, ...req.body } });
    deleteUser = (req: Request<{ id?: string }>, res: Response) =>
      res.status(200).json({ success: true });
    getUserProfile = (req: Request, res: Response) =>
      res.json({
        success: true,
        data: { id: 1, firstName: "koffi", lastName: "komla", email: "koffi@example.com" }
      });

    // Generic methods
    getById = (req: Request<{ id?: string }>, res: Response) =>
      res.json({ success: true, data: { id: req.params.id ?? 1 } });
  },
});

// Export des mocks de tous les contrôleurs
vi.mock("../../src/controllers/patient.controller", () => makeControllerMock("Patient"));
vi.mock("../../src/controllers/appointment.controller", () => makeControllerMock("Appointment"));
vi.mock("../../src/controllers/doctor.controller", () => makeControllerMock("Doctor"));
vi.mock("../../src/controllers/disease.controller", () => makeControllerMock("Disease"));
vi.mock("../../src/controllers/symptom.controller", () => makeControllerMock("Symptom"));
vi.mock("../../src/controllers/medicine.controller", () => makeControllerMock("Medicine"));
vi.mock("../../src/controllers/pharmacy.controller", () => makeControllerMock("Pharmacy"));
vi.mock("../../src/controllers/prescription.controller", () => makeControllerMock("Prescription"));
vi.mock("../../src/controllers/medicalRecord.controller", () => makeControllerMock("MedicalRecord"));
vi.mock("../../src/controllers/stats.controller", () => makeControllerMock("Stats"));
vi.mock("../../src/controllers/user.controller", () => makeControllerMock("User"));
