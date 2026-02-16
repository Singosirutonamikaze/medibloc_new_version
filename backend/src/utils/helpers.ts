import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtPayload, User, SanitizedUser } from '../types';

// ============================================
// CONSTANTES
// ============================================

const BCRYPT_SALT_ROUNDS = 10;
const DEFAULT_PAGINATION_LIMIT = 10;
const DEFAULT_PAGINATION_PAGE = 1;
const RANDOM_CODE_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAGINATION_LIMIT = 100;

// ============================================
// INTERFACES
// ============================================

interface PaginationResult {
  skip: number;
  take: number;
}

interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ErrorWithStatusCode extends Error {
  statusCode: number;
}

// ============================================
// FONCTIONS D'AUTHENTIFICATION
// ============================================

/**
 * Hash un mot de passe en utilisant bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password?.trim()) {
    throw new Error('Le mot de passe ne peut pas être vide');
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare un mot de passe avec son hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  if (!password?.trim() || !hash?.trim()) {
    return false;
  }

  return bcrypt.compare(password, hash);
};

/**
 * Génère un token JWT
 */
export const generateToken = (payload: JwtPayload): string => {
  if (!config.jwt.secret) {
    throw new Error('JWT secret non configuré');
  }

  const options: jwt.SignOptions = {
    expiresIn: config.jwt.expiresIn as unknown as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload as string | object | Buffer, config.jwt.secret as jwt.Secret, options);
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  if (!config.jwt.secret) {
    throw new Error('JWT secret non configuré');
  }

  try {
    return jwt.verify(token, config.jwt.secret as jwt.Secret) as JwtPayload;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré');
    }
    throw new Error('Erreur de vérification du token');
  }
};

// ============================================
// FONCTIONS DE PAGINATION
// ============================================

/**
 * Calcule les paramètres de pagination pour les requêtes de base de données
 */
export const calculatePagination = (
  page: number = DEFAULT_PAGINATION_PAGE,
  limit: number = DEFAULT_PAGINATION_LIMIT
): PaginationResult => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(limit, MAX_PAGINATION_LIMIT));

  const skip = (validPage - 1) * validLimit;
  return { skip, take: validLimit };
};

/**
 * Formate une réponse paginée standardisée
 */
export const formatPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResponse<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Exclut des champs spécifiques d'un objet
 */
export const exclude = <T, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> => {
  const newObj = { ...obj };

  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
};

/**
 * Vérifie si une valeur est une date valide
 */
export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

/**
 * Formate une date en string ISO
 */
export const formatDate = (date: Date): string => {
  if (!isValidDate(date)) {
    throw new Error('Date invalide');
  }
  return date.toISOString();
};

/**
 * Parse une valeur en nombre avec valeur par défaut
 */
export const parseNumber = (value: unknown, defaultValue: number): number => {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
};

/**
 * Nettoie les données utilisateur en supprimant les informations sensibles
 */
export const sanitizeUser = (user: User): SanitizedUser | null => {
  if (!user) return null;
  return exclude(user, ['password']);
};

/**
 * Crée un objet d'erreur avec code de statut
 */
export const createError = (message: string, statusCode: number = 500): ErrorWithStatusCode => {
  const error = new Error(message) as ErrorWithStatusCode;
  error.statusCode = statusCode;
  return error;
};

/**
 * Vérifie si une chaîne est un email valide
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Génère un code aléatoire de longueur spécifiée
 */
export const generateRandomCode = (length: number = RANDOM_CODE_LENGTH): string => {
  if (length <= 0) {
    throw new Error('La longueur doit être positive');
  }

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
};

/**
 * Valide les paramètres de pagination
 */
export const validatePaginationParams = (
  page: unknown,
  limit: unknown
): { page: number; limit: number } => {
  const validatedPage = parseNumber(page, DEFAULT_PAGINATION_PAGE);
  const validatedLimit = parseNumber(limit, DEFAULT_PAGINATION_LIMIT);

  return {
    page: Math.max(1, validatedPage),
    limit: Math.max(1, Math.min(validatedLimit, MAX_PAGINATION_LIMIT)),
  };
};

/**
 * Vérifie si un objet est vide
 */
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Filtre les propriétés undefined d'un objet
 */
export const removeUndefinedProperties = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const filtered: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    const typedKey = key as keyof T;
    if (obj[typedKey] !== undefined) {
      filtered[typedKey] = obj[typedKey];
    }
  });

  return filtered;
};