import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import diseaseRoutes from './disease.routes';
import symptomRoutes from './symptom.routes';
import medicineRoutes from './medicine.routes';
import pharmacyRoutes from './pharmacy.routes';
import prescriptionRoutes from './prescription.routes';
import medicalRecordRoutes from './medicalRecord.routes';
import statsRoutes from './stats.routes';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes protégées
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/symptoms', symptomRoutes);
router.use('/medicines', medicineRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/stats', statsRoutes);

// Route de santé de l'API
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API MédiBloc en fonctionnement',
    timestamp: new Date().toISOString(),
  });
});

export default router;