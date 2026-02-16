import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiResponse, ApiError } from '../types';
import { config } from '../config/config';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

interface ErrorHandlingResult {
  statusCode: number;
  message: string;
  details?: unknown;
}

/**
 * Gestion des erreurs Prisma
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): ErrorHandlingResult => {
  let statusCode = 500;
  let message = 'Erreur de base de données';

  switch (error.code) {
    case 'P2002': {
      statusCode = 409;
      const fields = error.meta?.target as string[];
      message = `Une ressource avec ${fields?.join(', ')} existe déjà`;
      break;
    }
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
const identifyErrorType = (error: CustomError): ErrorHandlingResult => {
  let statusCode = 500;
  let message = 'Erreur interne du serveur';
  let details: unknown = undefined;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaResult = handlePrismaError(error);
    statusCode = prismaResult.statusCode;
    message = prismaResult.message;
    details = prismaResult.details;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Données de requête invalides';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT invalide';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expiré';
  } else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'JSON mal formé';
  } else if (error.statusCode && typeof error.statusCode === 'number') {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Une ressource avec ces données existe déjà';
  } else if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Ressource non trouvée';
  }

  return { statusCode, message, details };
};

/**
 * Middleware global de gestion d'erreurs
 */
export const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

    const errorResponseBase: Partial<ApiError> = {
      success: false,
      error: errorResult.message,
    };

    if (config.nodeEnv === 'development') {
      if (errorResult.details) {

        if (Array.isArray(errorResult.details)) {
          (errorResponseBase.details as unknown) = errorResult.details;
        } else if (typeof errorResult.details === 'object') {
          (errorResponseBase.details as unknown) = errorResult.details;
        } else {
          (errorResponseBase.details as unknown) = String(errorResult.details);
        }
      }
    }

    const errorResponse: ApiError = errorResponseBase as ApiError;

    res.status(errorResult.statusCode).json(errorResponse);
    responseSent = true;

  } catch (handlerError) {
    if (!responseSent) {
      console.error('Erreur dans le middleware de gestion d\'erreurs:', handlerError);

      const fallbackResponse: ApiResponse = {
        success: false,
        error: 'Erreur interne critique du serveur',
      };
      res.status(500).json(fallbackResponse);
      responseSent = true;
    }
  }
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  const errorResponse: ApiResponse = {
    success: false,
    error: `Route ${req.method} ${req.url} non trouvée`,
  };
  res.status(404).json(errorResponse);
};

/**
 * Middleware de rate limiting
 */
export const rateLimitMiddleware = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  const middleware = (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyage des anciennes entrées
    const ipsToDelete: string[] = [];
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
    } else if (clientData.count < maxRequests) {
      clientData.count += 1;
      shouldAllowRequest = true;
    }

    if (shouldAllowRequest) {
      next();
    } else {
      const retryAfter = Math.max(0, Math.ceil(((clientData?.resetTime ?? now) + windowMs - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      };
      res.status(429).json(errorResponse);
    }
  };

  return middleware;
};