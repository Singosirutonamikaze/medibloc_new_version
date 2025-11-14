"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = exports.notFoundMiddleware = exports.errorMiddleware = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../config/config");
/**
 * Gestion des erreurs Prisma
 */
const handlePrismaError = (error) => {
    let statusCode = 500;
    let message = 'Erreur de base de données';
    switch (error.code) {
        case 'P2002':
            statusCode = 409;
            const fields = error.meta?.target;
            message = `Une ressource avec ${fields?.join(', ')} existe déjà`;
            break;
        case 'P2003':
            statusCode = 400;
            message = 'Référence à une ressource inexistante';
            break;
        case 'P2025':
            statusCode = 404;
            message = 'Ressource non trouvée';
            break;
        case 'P2014':
            statusCode = 400;
            message = 'Violation de contrainte d\'identité';
            break;
        case 'P2016':
            statusCode = 400;
            message = 'Erreur dans la requête de base de données';
            break;
        default:
            statusCode = 500;
            message = 'Erreur de base de données';
    }
    return { statusCode, message, details: error.meta };
};
/**
 * Identification du type d'erreur
 */
const identifyErrorType = (error) => {
    let statusCode = 500;
    let message = 'Erreur interne du serveur';
    let details = undefined;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const prismaResult = handlePrismaError(error);
        statusCode = prismaResult.statusCode;
        message = prismaResult.message;
        details = prismaResult.details;
    }
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Données de requête invalides';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token JWT invalide';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token JWT expiré';
    }
    else if (error instanceof SyntaxError && 'body' in error) {
        statusCode = 400;
        message = 'JSON mal formé';
    }
    else if (error.statusCode && typeof error.statusCode === 'number') {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
    }
    else if (error.code === 'P2002') {
        statusCode = 409;
        message = 'Une ressource avec ces données existe déjà';
    }
    else if (error.code === 'P2025') {
        statusCode = 404;
        message = 'Ressource non trouvée';
    }
    return { statusCode, message, details };
};
/**
 * Middleware global de gestion d'erreurs
 */
const errorMiddleware = (error, req, res, next) => {
    let responseSent = false;
    try {
        console.error('Erreur interceptée:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
        const errorResult = identifyErrorType(error);
        const errorResponseBase = {
            success: false,
            error: errorResult.message,
        };
        if (config_1.config.nodeEnv === 'development') {
            if (errorResult.details) {
                if (Array.isArray(errorResult.details)) {
                    errorResponseBase.details = errorResult.details;
                }
                else if (typeof errorResult.details === 'object') {
                    errorResponseBase.details = errorResult.details;
                }
                else {
                    errorResponseBase.details = String(errorResult.details);
                }
            }
        }
        const errorResponse = errorResponseBase;
        res.status(errorResult.statusCode).json(errorResponse);
        responseSent = true;
    }
    catch (handlerError) {
        if (!responseSent) {
            console.error('Erreur dans le middleware de gestion d\'erreurs:', handlerError);
            const fallbackResponse = {
                success: false,
                error: 'Erreur interne critique du serveur',
            };
            res.status(500).json(fallbackResponse);
            responseSent = true;
        }
    }
};
exports.errorMiddleware = errorMiddleware;
/**
 * Middleware pour les routes non trouvées
 */
const notFoundMiddleware = (req, res) => {
    const errorResponse = {
        success: false,
        error: `Route ${req.method} ${req.url} non trouvée`,
    };
    res.status(404).json(errorResponse);
};
exports.notFoundMiddleware = notFoundMiddleware;
/**
 * Middleware de rate limiting
 */
const rateLimitMiddleware = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    const requests = new Map();
    const middleware = (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const windowStart = now - windowMs;
        // Nettoyage des anciennes entrées
        const ipsToDelete = [];
        requests.forEach((data, ip) => {
            if (data.resetTime < windowStart) {
                ipsToDelete.push(ip);
            }
        });
        ipsToDelete.forEach(ip => {
            requests.delete(ip);
        });
        const clientData = requests.get(clientIp);
        let shouldAllowRequest = false;
        if (!clientData) {
            requests.set(clientIp, { count: 1, resetTime: now });
            shouldAllowRequest = true;
        }
        else if (clientData.count < maxRequests) {
            clientData.count += 1;
            shouldAllowRequest = true;
        }
        if (shouldAllowRequest) {
            next();
        }
        else {
            const retryAfter = Math.max(0, Math.ceil(((clientData?.resetTime ?? now) + windowMs - now) / 1000));
            res.setHeader('Retry-After', String(retryAfter));
            const errorResponse = {
                success: false,
                error: 'Trop de requêtes. Veuillez réessayer plus tard.',
            };
            res.status(429).json(errorResponse);
        }
    };
    return middleware;
};
exports.rateLimitMiddleware = rateLimitMiddleware;
