"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefinedProperties = exports.isEmptyObject = exports.validatePaginationParams = exports.generateRandomCode = exports.isValidEmail = exports.createError = exports.sanitizeUser = exports.parseNumber = exports.formatDate = exports.isValidDate = exports.exclude = exports.formatPaginationResponse = exports.calculatePagination = exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config/config");
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
// FONCTIONS D'AUTHENTIFICATION
// ============================================
/**
 * Hash un mot de passe en utilisant bcrypt
 */
const hashPassword = async (password) => {
    if (!password?.trim()) {
        throw new Error('Le mot de passe ne peut pas être vide');
    }
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};
exports.hashPassword = hashPassword;
/**
 * Compare un mot de passe avec son hash
 */
const comparePassword = async (password, hash) => {
    if (!password?.trim() || !hash?.trim()) {
        return false;
    }
    return bcrypt.compare(password, hash);
};
exports.comparePassword = comparePassword;
/**
 * Génère un token JWT
 */
const generateToken = (payload) => {
    if (!config_1.config.jwt.secret) {
        throw new Error('JWT secret non configuré');
    }
    const options = {
        expiresIn: config_1.config.jwt.expiresIn,
    };
    return jwt.sign(payload, config_1.config.jwt.secret, options);
};
exports.generateToken = generateToken;
/**
 * Vérifie et décode un token JWT
 */
const verifyToken = (token) => {
    if (!config_1.config.jwt.secret) {
        throw new Error('JWT secret non configuré');
    }
    try {
        return jwt.verify(token, config_1.config.jwt.secret);
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token invalide');
        }
        else if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expiré');
        }
        throw new Error('Erreur de vérification du token');
    }
};
exports.verifyToken = verifyToken;
// ============================================
// FONCTIONS DE PAGINATION
// ============================================
/**
 * Calcule les paramètres de pagination pour les requêtes de base de données
 */
const calculatePagination = (page = DEFAULT_PAGINATION_PAGE, limit = DEFAULT_PAGINATION_LIMIT) => {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, MAX_PAGINATION_LIMIT));
    const skip = (validPage - 1) * validLimit;
    return { skip, take: validLimit };
};
exports.calculatePagination = calculatePagination;
/**
 * Formate une réponse paginée standardisée
 */
const formatPaginationResponse = (data, total, page, limit) => {
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
exports.formatPaginationResponse = formatPaginationResponse;
// ============================================
// FONCTIONS UTILITAIRES
// ============================================
/**
 * Exclut des champs spécifiques d'un objet
 */
const exclude = (obj, keys) => {
    const newObj = { ...obj };
    keys.forEach((key) => {
        delete newObj[key];
    });
    return newObj;
};
exports.exclude = exclude;
/**
 * Vérifie si une valeur est une date valide
 */
const isValidDate = (date) => {
    return date instanceof Date && !Number.isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
/**
 * Formate une date en string ISO
 */
const formatDate = (date) => {
    if (!(0, exports.isValidDate)(date)) {
        throw new Error('Date invalide');
    }
    return date.toISOString();
};
exports.formatDate = formatDate;
/**
 * Parse une valeur en nombre avec valeur par défaut
 */
const parseNumber = (value, defaultValue) => {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
};
exports.parseNumber = parseNumber;
/**
 * Nettoie les données utilisateur en supprimant les informations sensibles
 */
const sanitizeUser = (user) => {
    if (!user)
        return null;
    return (0, exports.exclude)(user, ['password']);
};
exports.sanitizeUser = sanitizeUser;
/**
 * Crée un objet d'erreur avec code de statut
 */
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
exports.createError = createError;
/**
 * Vérifie si une chaîne est un email valide
 */
const isValidEmail = (email) => {
    return EMAIL_REGEX.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Génère un code aléatoire de longueur spécifiée
 */
const generateRandomCode = (length = RANDOM_CODE_LENGTH) => {
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
exports.generateRandomCode = generateRandomCode;
/**
 * Valide les paramètres de pagination
 */
const validatePaginationParams = (page, limit) => {
    const validatedPage = (0, exports.parseNumber)(page, DEFAULT_PAGINATION_PAGE);
    const validatedLimit = (0, exports.parseNumber)(limit, DEFAULT_PAGINATION_LIMIT);
    return {
        page: Math.max(1, validatedPage),
        limit: Math.max(1, Math.min(validatedLimit, MAX_PAGINATION_LIMIT)),
    };
};
exports.validatePaginationParams = validatePaginationParams;
/**
 * Vérifie si un objet est vide
 */
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};
exports.isEmptyObject = isEmptyObject;
/**
 * Filtre les propriétés undefined d'un objet
 */
const removeUndefinedProperties = (obj) => {
    const filtered = {};
    Object.keys(obj).forEach((key) => {
        const typedKey = key;
        if (obj[typedKey] !== undefined) {
            filtered[typedKey] = obj[typedKey];
        }
    });
    return filtered;
};
exports.removeUndefinedProperties = removeUndefinedProperties;
