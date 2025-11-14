"use strict";
/**
 * Module de middleware de validation
 *
 * Fournit des utilitaires pour valider les données de requête (body, params, query) selon un schéma déclaratif,
 * et une usine de middleware Express pour appliquer ces validations aux requêtes entrantes.
 *
 * L'approche pilotée par schéma supporte : vérification de présence, validation de type primitif,
 * longueur de chaîne, plages numériques, correspondance regex, contraintes d'énumération, fonctions de validation personnalisées
 * et validations spécialisées pour email, date et tableau.
 *
 * Éléments exportés :
 * - validationMiddleware(schema) : fonction middleware Express qui valide les données de requête et
 *   répond avec 400 en cas d'erreurs de validation.
 * - validationSchemas : collection de schémas prédéfinis courants (ex. register, login).
 *
 * Les fonctions utilitaires internes effectuent les vérifications par champ et par type et retournent des
 * objets ValidationError structurés utilisés dans la réponse du middleware.
 *
 * @remarques
 * Tous les objets d'erreur de validation respectent la forme décrite par ValidationError et sont renvoyés
 * dans la propriété `details` de l'ApiResponse en cas d'échec de la validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemas = exports.validationMiddleware = void 0;
const helpers_1 = require("../utils/helpers");
/**
 * Valide un champ selon les règles définies
 */
const validateField = (field, value, rules) => {
    const isValuePresent = value !== undefined && value !== null && value !== '';
    if (rules.required && !isValuePresent) {
        return {
            field,
            message: rules.message || `Le champ ${field} est requis`,
        };
    }
    if (!isValuePresent) {
        return null;
    }
    if (rules.type) {
        const typeValidationError = validateFieldType(field, value, rules);
        if (typeValidationError) {
            return typeValidationError;
        }
    }
    if (rules.type === 'string' && typeof value === 'string') {
        const lengthValidationError = validateFieldLength(field, value, rules);
        if (lengthValidationError) {
            return lengthValidationError;
        }
    }
    if (rules.type === 'number') {
        const numberValidationError = validateFieldNumber(field, value, rules);
        if (numberValidationError) {
            return numberValidationError;
        }
    }
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        return {
            field,
            message: rules.message || `Le champ ${field} a un format invalide`,
        };
    }
    if (rules.enum && !rules.enum.includes(value)) {
        return {
            field,
            message: rules.message || `Le champ ${field} doit être l'une des valeurs suivantes: ${rules.enum.join(', ')}`,
        };
    }
    if (rules.custom && !rules.custom(value)) {
        return {
            field,
            message: rules.message || `Le champ ${field} n'est pas valide`,
        };
    }
    return null;
};
const validateFieldType = (field, value, rules) => {
    switch (rules.type) {
        case 'string':
            if (typeof value !== 'string') {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être une chaîne de caractères`,
                };
            }
            break;
        case 'number':
            const numValue = Number(value);
            if (isNaN(numValue)) {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être un nombre valide`,
                };
            }
            break;
        case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être un booléen`,
                };
            }
            break;
        case 'email':
            if (typeof value !== 'string' || !(0, helpers_1.isValidEmail)(value)) {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être un email valide`,
                };
            }
            break;
        case 'date':
            if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
                const dateValue = new Date(value);
                if (isNaN(dateValue.getTime())) {
                    return {
                        field,
                        message: rules.message || `Le champ ${field} doit être une date valide`,
                    };
                }
            }
            else {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être une date valide`,
                };
            }
            break;
        case 'array':
            if (!Array.isArray(value)) {
                return {
                    field,
                    message: rules.message || `Le champ ${field} doit être un tableau`,
                };
            }
            break;
    }
    return null;
};
const validateFieldLength = (field, value, rules) => {
    if (rules.minLength && value.length < rules.minLength) {
        return {
            field,
            message: rules.message || `Le champ ${field} doit contenir au moins ${rules.minLength} caractères`,
        };
    }
    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            field,
            message: rules.message || `Le champ ${field} ne doit pas dépasser ${rules.maxLength} caractères`,
        };
    }
    return null;
};
const validateFieldNumber = (field, value, rules) => {
    const numValue = Number(value);
    if (rules.min !== undefined && numValue < rules.min) {
        return {
            field,
            message: rules.message || `Le champ ${field} doit être au moins ${rules.min}`,
        };
    }
    if (rules.max !== undefined && numValue > rules.max) {
        return {
            field,
            message: rules.message || `Le champ ${field} ne doit pas dépasser ${rules.max}`,
        };
    }
    return null;
};
/**
 * Valide toutes les données selon le schéma
 */
const validateData = (data, schema) => {
    const errors = [];
    Object.entries(schema).forEach(([field, rules]) => {
        const value = data[field];
        const error = validateField(field, value, rules);
        if (error) {
            errors.push(error);
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
    };
};
/**
 * Middleware de validation générique
 */
const validationMiddleware = (schema) => {
    const middleware = (req, res, next) => {
        try {
            const data = { ...req.body, ...req.params, ...req.query };
            const validationResult = validateData(data, schema);
            if (!validationResult.isValid) {
                const errorResponse = {
                    success: false,
                    error: 'Données de validation invalides',
                    details: validationResult.errors,
                };
                res.status(400).json(errorResponse);
                return;
            }
            next();
        }
        catch (error) {
            console.error('Erreur de validation:', error);
            const errorResponse = {
                success: false,
                error: 'Erreur lors de la validation des données',
            };
            res.status(500).json(errorResponse);
        }
    };
    return middleware;
};
exports.validationMiddleware = validationMiddleware;
/**
 * Schémas de validation prédéfinis
 */
exports.validationSchemas = {
    register: {
        email: {
            required: true,
            type: 'email',
            message: 'Un email valide est requis',
        },
        password: {
            required: true,
            type: 'string',
            minLength: 6,
            message: 'Le mot de passe doit contenir au moins 6 caractères',
        },
        firstName: {
            required: true,
            type: 'string',
            minLength: 2,
            message: 'Le prénom est requis et doit contenir au moins 2 caractères',
        },
        lastName: {
            required: true,
            type: 'string',
            minLength: 2,
            message: 'Le nom est requis et doit contenir au moins 2 caractères',
        },
        role: {
            required: false,
            type: 'string',
            enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
            message: 'Le rôle doit être PATIENT, DOCTOR ou ADMIN',
        },
    },
    login: {
        email: {
            required: true,
            type: 'email',
            message: 'Un email valide est requis',
        },
        password: {
            required: true,
            type: 'string',
            message: 'Le mot de passe est requis',
        },
    },
    // Patients
    createPatient: {
        email: { required: true, type: 'email', message: 'Un email valide est requis' },
        password: { required: true, type: 'string', minLength: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
        firstName: { required: true, type: 'string', minLength: 2 },
        lastName: { required: true, type: 'string', minLength: 2 },
        birthDate: { required: false, type: 'date' },
        gender: { required: false, type: 'string' },
        phone: { required: false, type: 'string' },
        address: { required: false, type: 'string' },
    },
    updatePatient: {
        firstName: { required: false, type: 'string' },
        lastName: { required: false, type: 'string' },
        birthDate: { required: false, type: 'date' },
        gender: { required: false, type: 'string' },
        phone: { required: false, type: 'string' },
        address: { required: false, type: 'string' },
    },
    // Doctors
    createDoctor: {
        email: { required: true, type: 'email' },
        password: { required: true, type: 'string', minLength: 6 },
        firstName: { required: true, type: 'string' },
        lastName: { required: true, type: 'string' },
        specialty: { required: false, type: 'string' },
        phone: { required: false, type: 'string' },
    },
    updateDoctor: {
        firstName: { required: false, type: 'string' },
        lastName: { required: false, type: 'string' },
        specialty: { required: false, type: 'string' },
        phone: { required: false, type: 'string' },
    },
    // Appointments
    createAppointment: {
        patientId: { required: true, type: 'number' },
        doctorId: { required: true, type: 'number' },
        scheduledAt: { required: true, type: 'date' },
        reason: { required: false, type: 'string' },
        notes: { required: false, type: 'string' },
    },
    updateAppointment: {
        scheduledAt: { required: false, type: 'date' },
        reason: { required: false, type: 'string' },
        notes: { required: false, type: 'string' },
        status: { required: false, type: 'string' },
    },
    // Diseases
    createDisease: {
        name: { required: true, type: 'string' },
        description: { required: false, type: 'string' },
        isViral: { required: false, type: 'boolean' },
        isBacterial: { required: false, type: 'boolean' },
        isGenetic: { required: false, type: 'boolean' },
        isChronic: { required: false, type: 'boolean' },
    },
    updateDisease: {
        name: { required: false, type: 'string' },
        description: { required: false, type: 'string' },
        isViral: { required: false, type: 'boolean' },
        isBacterial: { required: false, type: 'boolean' },
        isGenetic: { required: false, type: 'boolean' },
        isChronic: { required: false, type: 'boolean' },
    },
    // Symptoms
    createSymptom: {
        name: { required: true, type: 'string' },
        description: { required: false, type: 'string' },
    },
    updateSymptom: {
        name: { required: false, type: 'string' },
        description: { required: false, type: 'string' },
    },
    // Medicines
    createMedicine: {
        name: { required: true, type: 'string' },
        type: { required: true, type: 'string' },
        description: { required: false, type: 'string' },
        composition: { required: false, type: 'string' },
        scientificName: { required: false, type: 'string' },
        commonNames: { required: false, type: 'array' },
        pharmacyId: { required: false, type: 'number' },
    },
    updateMedicine: {
        name: { required: false, type: 'string' },
        type: { required: false, type: 'string' },
        description: { required: false, type: 'string' },
        composition: { required: false, type: 'string' },
        scientificName: { required: false, type: 'string' },
        commonNames: { required: false, type: 'array' },
        pharmacyId: { required: false, type: 'number' },
    },
    // Pharmacies
    createPharmacy: {
        name: { required: true, type: 'string' },
        address: { required: true, type: 'string' },
        city: { required: true, type: 'string' },
        countryId: { required: true, type: 'number' },
        phone: { required: false, type: 'string' },
        email: { required: false, type: 'email' },
    },
    updatePharmacy: {
        name: { required: false, type: 'string' },
        address: { required: false, type: 'string' },
        city: { required: false, type: 'string' },
        countryId: { required: false, type: 'number' },
        phone: { required: false, type: 'string' },
        email: { required: false, type: 'email' },
    },
    // Prescriptions
    createPrescription: {
        doctorId: { required: true, type: 'number' },
        patientId: { required: true, type: 'number' },
        medications: { required: true, type: 'string' },
        diagnosis: { required: false, type: 'string' },
        notes: { required: false, type: 'string' },
    },
    // Medical records
    createMedicalRecord: {
        patientId: { required: true, type: 'number' },
        title: { required: true, type: 'string' },
        content: { required: true, type: 'string' },
        files: { required: false, type: 'array' },
    },
    updateMedicalRecord: {
        title: { required: false, type: 'string' },
        content: { required: false, type: 'string' },
        files: { required: false, type: 'array' },
    },
    // Patient disease
    createPatientDisease: {
        patientId: { required: true, type: 'number' },
        diseaseId: { required: true, type: 'number' },
        status: { required: false, type: 'string' },
        severity: { required: false, type: 'string' },
        notes: { required: false, type: 'string' },
    },
    updatePatientDisease: {
        status: { required: false, type: 'string' },
        severity: { required: false, type: 'string' },
        notes: { required: false, type: 'string' },
    },
};
