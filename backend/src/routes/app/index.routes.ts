/**
 * @file index.routes.ts
 * @description Point d'agregation des routes d'API REST pour l'application MediBloc (/api/v1).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router, Request, Response } from "express";
import authRoutes from "../../features/auth/routes/auth.routes";
import userRoutes from "../../features/user/routes/user.routes";
import patientRoutes from "../../features/patient/routes/patient.routes";
import doctorRoutes from "../../features/doctor/routes/doctor.routes";
import appointmentRoutes from "../../features/appointment/routes/appointment.routes";
import diseaseRoutes from "../../features/disease/routes/disease.routes";
import symptomRoutes from "../../features/symptom/routes/symptom.routes";
import medicineRoutes from "../../features/medicine/routes/medicine.routes";
import pharmacyRoutes from "../../features/pharmacy/routes/pharmacy.routes";
import prescriptionRoutes from "../../features/prescription/routes/prescription.routes";
import medicalRecordRoutes from "../../features/medical-record/routes/medical-record.routes";
import statsRoutes from "../../features/stats/routes/stats.routes";
import discussionRoutes from "../../features/discussion/routes/discussion.routes";
import invoiceRoutes from "../../features/invoice/routes/invoice.routes";
import notificationRoutes from "../../features/notification/routes/notification.routes";
import reviewRoutes from "../../features/review/routes/review.routes";
import hotspotRoutes from "../../features/hotspot/routes/hotspot.routes";
import { successResponse } from "../../core/utils/responses/response.util";

const router = Router();

// Route racine d'accueil et documentation des points d'acces de l'API REST
router.get("/", (_req: Request, res: Response): void => {
  successResponse(
    res,
    {
      name: "MediBloc REST API",
      version: "1.0.0",
      docs: "/api-docs",
      health: "/api/v1/health",
      graphql: "/graphql",
    },
    "Bienvenue sur l'API REST MediBloc",
    200
  );
});

// Routes publiques
router.use("/auth", authRoutes);
router.use("/hotspots", hotspotRoutes);

// Routes metiers
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/diseases", diseaseRoutes);
router.use("/symptoms", symptomRoutes);
router.use("/medicines", medicineRoutes);
router.use("/pharmacies", pharmacyRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/stats", statsRoutes);
router.use("/discussions", discussionRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reviews", reviewRoutes);

// Verification de disponibilite (Health Check)
router.get("/health", (_req: Request, res: Response): void => {
  successResponse(
    res,
    { status: "UP", timestamp: new Date().toISOString() },
    "API MediBloc en fonctionnement",
    200
  );
});

export default router;