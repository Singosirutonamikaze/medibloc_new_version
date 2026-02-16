"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecord_controller_1 = require("../controllers/medicalRecord.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const medicalRecordController = new medicalRecord_controller_1.MedicalRecordController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/medical-records
 * @description Récupérer tous les dossiers médicaux (Admin seulement)
 * @access Private/Admin
 */
router.get('/', medicalRecordController.getAllMedicalRecords);
/**
 * @route POST /api/v1/medical-records
 * @description Créer un nouveau dossier médical
 * @access Private/Doctor
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createMedicalRecord), medicalRecordController.createMedicalRecord);
/**
 * @route GET /api/v1/medical-records/:id
 * @description Récupérer un dossier médical par son ID
 * @access Private
 */
router.get('/:id', medicalRecordController.getMedicalRecordById);
/**
 * @route PUT /api/v1/medical-records/:id
 * @description Mettre à jour un dossier médical
 * @access Private/Doctor
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateMedicalRecord), medicalRecordController.updateMedicalRecord);
/**
 * @route DELETE /api/v1/medical-records/:id
 * @description Supprimer un dossier médical
 * @access Private/Doctor/Admin
 */
router.delete('/:id', medicalRecordController.deleteMedicalRecord);
/**
 * @route GET /api/v1/medical-records/patient/:patientId
 * @description Récupérer les dossiers médicaux d'un patient
 * @access Private
 */
router.get('/patient/:patientId', medicalRecordController.getPatientMedicalRecords);
exports.default = router;
