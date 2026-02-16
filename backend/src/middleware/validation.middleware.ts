
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

/**
 * Schéma décrivant les règles de validation pour chaque champ.
 *
 * Chaque clé correspond au nom d'un champ et la valeur est un objet décrivant les règles à appliquer.
 *
 * Propriétés de règle supportées :
 * - required?: boolean — le champ doit être présent et non vide.
 * - type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array' — type attendu ou type spécial.
 * - minLength?: number — longueur minimale pour les chaînes.
 * - maxLength?: number — longueur maximale pour les chaînes.
 * - min?: number — valeur numérique minimale (s'applique aux valeurs convertibles en nombre).
 * - max?: number — valeur numérique maximale.
 * - pattern?: RegExp — expression régulière que la chaîne doit respecter.
 * - enum?: unknown[] — ensemble de valeurs autorisées.
 * - custom?: (value: unknown) => boolean — validateur personnalisé retournant true si la valeur est valide.
 * - message?: string — message d'erreur personnalisé renvoyé lorsque la règle échoue.
 *
 * @example
 * const schema: ValidationSchema = {
 *   email: { required: true, type: 'email' },
 *   age: { type: 'number', min: 18 },
 * };
 */

/**
 * Résultat retourné par validateData contenant si la validation a réussi et la liste des erreurs.
 *
 * - isValid: boolean — true lorsqu'aucune erreur de validation n'a été trouvée.
 * - errors: ValidationError[] — tableau d'erreurs de validation ; vide si isValid est true.
 */

/**
 * Valide un seul champ selon ses règles.
 *
 * Effectue les vérifications suivantes, dans cet ordre :
 * 1. Présence si rules.required est true.
 * 2. Validation basée sur le type (délègue à validateFieldType).
 * 3. Vérifications de longueur pour les chaînes (minLength, maxLength).
 * 4. Vérifications de plages numériques pour les valeurs numériques (min, max).
 * 5. Vérification du pattern (RegExp) pour les chaînes.
 * 6. Appartenance à l'enum.
 * 7. Invocation du validateur personnalisé.
 *
 * Retourne un ValidationError décrivant la première règle en échec, ou null si le champ est valide.
 *
 * @param field - Nom du champ validé.
 * @param value - Valeur à valider.
 * @param rules - Règles de validation pour le champ (voir ValidationSchema).
 * @returns ValidationError | null — objet d'erreur si invalide, sinon null.
 */

/**
 * Valide le type déclaré de la valeur.
 *
 * Gère les validations de type suivantes :
 * - 'string' : typeof value === 'string'
 * - 'number' : conversion en Number et vérification NaN
 * - 'boolean': accepte les booléens réels ou les chaînes 'true'/'false'
 * - 'email'  : s'assure que c'est une chaîne et que isValidEmail passe
 * - 'date'   : construit un Date et vérifie sa validité
 * - 'array'  : vérifie Array.isArray(value)
 *
 * Retourne un ValidationError si la vérification de type échoue, ou null si le type est valide.
 *
 * @param field - Nom du champ.
 * @param value - Valeur à valider.
 * @param rules - Règles contenant `type` et message optionnel.
 * @returns ValidationError | null
 */

/**
 * Valide les contraintes de longueur pour les valeurs de type string.
 *
 * Vérifie minLength et maxLength si présents dans rules et retourne la première ValidationError rencontrée
 * ou null si la valeur satisfait les contraintes.
 *
 * @param field - Nom du champ string.
 * @param value - Valeur string à valider.
 * @param rules - Règles pouvant inclure minLength et/ou maxLength.
 * @returns ValidationError | null
 */

/**
 * Valide les contraintes de plage numérique pour les valeurs numériques ou convertibles en nombre.
 *
 * Convertit l'entrée en Number et vérifie les bornes `min` et `max` si définies. Retourne une ValidationError
 * pour la première borne en échec, ou null si la valeur est dans la plage.
 *
 * @param field - Nom du champ numérique.
 * @param value - Valeur à convertir et valider.
 * @param rules - Règles pouvant inclure min et/ou max.
 * @returns ValidationError | null
 */

/**
 * Valide un objet de données contre le schéma fourni.
 *
 * Parcourt chaque entrée du schéma, valide le champ correspondant via validateField,
 * et accumule les ValidationError.
 *
 * @param data - Objet contenant les valeurs à valider (typiquement fusion de req.body, req.params, req.query).
 * @param schema - ValidationSchema décrivant les champs attendus et leurs règles.
 * @returns ValidationResult — objet avec isValid et la liste d'erreurs.
 */

/**
 * Fabrique un middleware Express qui valide les requêtes entrantes.
 *
 * Le middleware produit :
 * - Fusionne req.body, req.params et req.query en un seul objet pour la validation.
 * - Utilise validateData pour valider les données fusionnées selon le schéma.
 * - En cas d'échec de validation, répond avec HTTP 400 et une ApiResponse contenant :
 *   { success: false, error: 'Données de validation invalides', details: ValidationError[] }
 * - En cas d'erreur inattendue pendant la validation, répond avec HTTP 500.
 *
 * @param schema - ValidationSchema à utiliser.
 * @returns (req: Request, res: Response, next: NextFunction) => void — middleware Express.
 *
 * @example
 * // Utilisation sur une route
 * app.post('/register', validationMiddleware(validationSchemas.register), registerHandler);
 */

/**
 * Schémas de validation prédéfinis utilisés par l'application.
 *
 * Exemples fournis :
 * - register : valide email, password, firstName, lastName, rôle optionnel (enum PATIENT|DOCTOR|ADMIN).
 * - login : valide la présence et le format de l'email et du mot de passe.
 *
 * Chaque entrée de schéma est compatible avec ValidationSchema et inclut des messages d'erreur utiles.
 */
import { Request, Response, NextFunction } from 'express';
import { ValidationError, ApiResponse } from '../types';
import { isValidEmail } from '../utils/helpers';

interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'array';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: unknown[];
    custom?: (value: unknown) => boolean;
    message?: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Valide un champ selon les règles définies
 */
const validateField = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
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

  const validators: Array<(f: string, v: unknown, r: ValidationSchema[string]) => ValidationError | null> = [
    validateFieldType,
    (f, v, r) => r.type === 'string' && typeof v === 'string' ? validateFieldLength(f, v, r) : null,
    (f, v, r) => r.type === 'number' ? validateFieldNumber(f, v, r) : null,
    validatePattern,
    validateEnum,
    validateCustom,
  ];

  for (const validator of validators) {
    const error = validator(field, value, rules);
    if (error) {
      return error;
    }
  }

  return null;
};

const validatePattern = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return {
      field,
      message: rules.message || `Le champ ${field} a un format invalide`,
    };
  }
  return null;
};

const validateEnum = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (rules.enum && !rules.enum.includes(value)) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être l'une des valeurs suivantes: ${rules.enum.join(', ')}`,
    };
  }
  return null;
};

const validateCustom = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (rules.custom && !rules.custom(value)) {
    return {
      field,
      message: rules.message || `Le champ ${field} n'est pas valide`,
    };
  }
  return null;
};

const validateFieldType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  switch (rules.type) {
    case 'string':
      return validateStringType(field, value, rules);
    case 'number':
      return validateNumberType(field, value, rules);
    case 'boolean':
      return validateBooleanType(field, value, rules);
    case 'email':
      return validateEmailType(field, value, rules);
    case 'date':
      return validateDateType(field, value, rules);
    case 'array':
      return validateArrayType(field, value, rules);
    default:
      return null;
  }
};

const validateStringType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (typeof value !== 'string') {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être une chaîne de caractères`,
    };
  }
  return null;
};

const validateNumberType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  const numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être un nombre valide`,
    };
  }
  return null;
};

const validateBooleanType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être un booléen`,
    };
  }
  return null;
};

const validateEmailType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (typeof value !== 'string' || !isValidEmail(value)) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être un email valide`,
    };
  }
  return null;
};

const validateDateType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être une date valide`,
    };
  }

  const dateValue = new Date(value as any);
  if (Number.isNaN(dateValue.getTime())) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être une date valide`,
    };
  }
  return null;
};

const validateArrayType = (field: string, value: unknown, rules: ValidationSchema[string]): ValidationError | null => {
  if (!Array.isArray(value)) {
    return {
      field,
      message: rules.message || `Le champ ${field} doit être un tableau`,
    };
  }
  return null;
};

const validateFieldLength = (field: string, value: string, rules: ValidationSchema[string]): ValidationError | null => {
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

const validateFieldNumber = (field: string, value: any, rules: any): ValidationError | null => {
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
const validateData = (data: unknown, schema: ValidationSchema): ValidationResult => {
  const errors: ValidationError[] = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = (data as Record<string, unknown>)[field];
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
export const validationMiddleware = (schema: ValidationSchema) => {
  const middleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const validationResult = validateData(data, schema);

      if (!validationResult.isValid) {
        const errorResponse = {
          success: false,
          error: 'Données de validation invalides',
          details: validationResult.errors,
        };
        res.status(400).json(errorResponse as ApiResponse);
        return;
      }

      next();
    } catch (error) {
      console.error('Erreur de validation:', error);
      const errorResponse = {
        success: false,
        error: 'Erreur lors de la validation des données',
      };
      res.status(500).json(errorResponse as ApiResponse);
    }
  };

  return middleware;
};

/**
 * Schémas de validation prédéfinis
 */
export const validationSchemas = {
  register: {
    email: {
      required: true,
      type: 'email' as const,
      message: 'Un email valide est requis',
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 6,
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    },
    firstName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      message: 'Le prénom est requis et doit contenir au moins 2 caractères',
    },
    lastName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      message: 'Le nom est requis et doit contenir au moins 2 caractères',
    },
    role: {
      required: false,
      type: 'string' as const,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
      message: 'Le rôle doit être PATIENT, DOCTOR ou ADMIN',
    },
  } as ValidationSchema,

  login: {
    email: {
      required: true,
      type: 'email' as const,
      message: 'Un email valide est requis',
    },
    password: {
      required: true,
      type: 'string' as const,
      message: 'Le mot de passe est requis',
    },
  } as ValidationSchema,

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
  } as ValidationSchema,

  updatePatient: {
    firstName: { required: false, type: 'string' },
    lastName: { required: false, type: 'string' },
    birthDate: { required: false, type: 'date' },
    gender: { required: false, type: 'string' },
    phone: { required: false, type: 'string' },
    address: { required: false, type: 'string' },
  } as ValidationSchema,

  // Doctors
  createDoctor: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 6 },
    firstName: { required: true, type: 'string' },
    lastName: { required: true, type: 'string' },
    specialty: { required: false, type: 'string' },
    phone: { required: false, type: 'string' },
  } as ValidationSchema,

  updateDoctor: {
    firstName: { required: false, type: 'string' },
    lastName: { required: false, type: 'string' },
    specialty: { required: false, type: 'string' },
    phone: { required: false, type: 'string' },
  } as ValidationSchema,

  // Appointments
  createAppointment: {
    patientId: { required: true, type: 'number' },
    doctorId: { required: true, type: 'number' },
    scheduledAt: { required: true, type: 'date' },
    reason: { required: false, type: 'string' },
    notes: { required: false, type: 'string' },
  } as ValidationSchema,

  updateAppointment: {
    scheduledAt: { required: false, type: 'date' },
    reason: { required: false, type: 'string' },
    notes: { required: false, type: 'string' },
    status: { required: false, type: 'string' },
  } as ValidationSchema,

  // Diseases
  createDisease: {
    name: { required: true, type: 'string' },
    description: { required: false, type: 'string' },
    isViral: { required: false, type: 'boolean' },
    isBacterial: { required: false, type: 'boolean' },
    isGenetic: { required: false, type: 'boolean' },
    isChronic: { required: false, type: 'boolean' },
  } as ValidationSchema,

  updateDisease: {
    name: { required: false, type: 'string' },
    description: { required: false, type: 'string' },
    isViral: { required: false, type: 'boolean' },
    isBacterial: { required: false, type: 'boolean' },
    isGenetic: { required: false, type: 'boolean' },
    isChronic: { required: false, type: 'boolean' },
  } as ValidationSchema,

  // Symptoms
  createSymptom: {
    name: { required: true, type: 'string' },
    description: { required: false, type: 'string' },
  } as ValidationSchema,

  updateSymptom: {
    name: { required: false, type: 'string' },
    description: { required: false, type: 'string' },
  } as ValidationSchema,

  // Medicines
  createMedicine: {
    name: { required: true, type: 'string' },
    type: { required: true, type: 'string' },
    description: { required: false, type: 'string' },
    composition: { required: false, type: 'string' },
    scientificName: { required: false, type: 'string' },
    commonNames: { required: false, type: 'array' },
    pharmacyId: { required: false, type: 'number' },
  } as ValidationSchema,

  updateMedicine: {
    name: { required: false, type: 'string' },
    type: { required: false, type: 'string' },
    description: { required: false, type: 'string' },
    composition: { required: false, type: 'string' },
    scientificName: { required: false, type: 'string' },
    commonNames: { required: false, type: 'array' },
    pharmacyId: { required: false, type: 'number' },
  } as ValidationSchema,

  // Pharmacies
  createPharmacy: {
    name: { required: true, type: 'string' },
    address: { required: true, type: 'string' },
    city: { required: true, type: 'string' },
    countryId: { required: true, type: 'number' },
    phone: { required: false, type: 'string' },
    email: { required: false, type: 'email' },
  } as ValidationSchema,

  updatePharmacy: {
    name: { required: false, type: 'string' },
    address: { required: false, type: 'string' },
    city: { required: false, type: 'string' },
    countryId: { required: false, type: 'number' },
    phone: { required: false, type: 'string' },
    email: { required: false, type: 'email' },
  } as ValidationSchema,

  // Prescriptions
  createPrescription: {
    doctorId: { required: true, type: 'number' },
    patientId: { required: true, type: 'number' },
    medications: { required: true, type: 'string' },
    diagnosis: { required: false, type: 'string' },
    notes: { required: false, type: 'string' },
  } as ValidationSchema,

  // Medical records
  createMedicalRecord: {
    patientId: { required: true, type: 'number' },
    title: { required: true, type: 'string' },
    content: { required: true, type: 'string' },
    files: { required: false, type: 'array' },
  } as ValidationSchema,

  updateMedicalRecord: {
    title: { required: false, type: 'string' },
    content: { required: false, type: 'string' },
    files: { required: false, type: 'array' },
  } as ValidationSchema,

  // Patient disease
  createPatientDisease: {
    patientId: { required: true, type: 'number' },
    diseaseId: { required: true, type: 'number' },
    status: { required: false, type: 'string' },
    severity: { required: false, type: 'string' },
    notes: { required: false, type: 'string' },
  } as ValidationSchema,

  updatePatientDisease: {
    status: { required: false, type: 'string' },
    severity: { required: false, type: 'string' },
    notes: { required: false, type: 'string' },
  } as ValidationSchema,
};