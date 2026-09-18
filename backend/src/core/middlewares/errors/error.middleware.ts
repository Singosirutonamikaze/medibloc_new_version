/**
 * @file error.middleware.ts
 * @description Interception globale des erreurs non capturees, conversion des exceptions Prisma,
 * gestionnaire de routes inexistantes (404) et limiteur de frequence de requetes (rate limiter).
 * Concue sans structures conditionnelles directes selon le paradigme declaratif.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { errorResponse } from "../../utils/responses/response.util";

/**
 * @interface CustomHttpError
 * @description Contrat etendu pour les erreurs applicatives avec code de statut HTTP.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property message Description explicite de l'anomalie.
 * @property statusCode Code d'etat HTTP (ex: {@code 400}, {@code 404}, {@code 409}, {@code 500}).
 * @property code Identifiant d'erreur Prisma ou applicatif.
 * @property name Nom de la classe d'erreur.
 * @property stack Trace d'execution de l'exception.
 */
export interface CustomHttpError {
  readonly message: string;
  readonly statusCode?: number;
  readonly code?: string;
  readonly name?: string;
  readonly stack?: string;
}

/**
 * @interface ErrorResult
 * @description Structure resultante apres normalisation de l'exception interceptee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property statusCode Code HTTP final a emettre.
 * @property message Message clair restitue au consommateur de l'API.
 */
export interface ErrorResult {
  readonly statusCode: number;
  readonly message: string;
}

/**
 * @description Convertit les codes d'erreur connus de l'ORM Prisma en codes HTTP adaptes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param error Instance de {@link Prisma.PrismaClientKnownRequestError}.
 * @returns Objet {@link ErrorResult} normalise.
 */
const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): ErrorResult => {
  const prismaCodeHandlers: Record<string, () => ErrorResult> = {
    P2002: () => ({
      statusCode: 409,
      message: "Une ressource avec ces donnees uniques existe deja en base de donnees",
    }),
    P2003: () => ({
      statusCode: 400,
      message: "Reference a une ressource parent inexistante ou supprimee",
    }),
    P2025: () => ({
      statusCode: 404,
      message: "La ressource demandee est introuvable",
    }),
    P2014: () => ({
      statusCode: 400,
      message: "Violation de relation obligatoire ou de contrainte d'integrite",
    }),
    P2016: () => ({
      statusCode: 400,
      message: "Erreur d'interpretation de la requete de base de donnees",
    }),
  };

  const defaultHandler = (): ErrorResult => ({
    statusCode: 500,
    message: "Erreur interne de la base de donnees relationnelle",
  });

  const selectedHandler = prismaCodeHandlers[error.code] || defaultHandler;
  return selectedHandler();
};

/**
 * @description Identifie la categorie d'erreur de maniere deterministe sans blocs conditionnels.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param error Erreur interceptee.
 * @returns Resultat de normalisation d'erreur.
 */
const identifyError = (error: CustomHttpError): ErrorResult => {
  const isPrismaKnown = error instanceof Prisma.PrismaClientKnownRequestError;
  const isPrismaValidation = error instanceof Prisma.PrismaClientValidationError;
  const isJwtError = (error.name || "") === "JsonWebTokenError";
  const isJwtExpired = (error.name || "") === "TokenExpiredError";
  const hasStatusCode = typeof error.statusCode === "number";

  const errorResolvers: Record<string, () => ErrorResult> = {
    prismaKnown: () =>
      handlePrismaError(error as Prisma.PrismaClientKnownRequestError),
    prismaValidation: () => ({
      statusCode: 400,
      message: "Donnees de requete non conformes au schema Prisma",
    }),
    jwtError: () => ({
      statusCode: 401,
      message: "Jeton d'authentification invalide",
    }),
    jwtExpired: () => ({
      statusCode: 401,
      message: "Jeton d'authentification expire",
    }),
    customStatus: () => ({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur applicative",
    }),
    fallback: () => ({
      statusCode: 500,
      message: error.message || "Erreur interne du serveur",
    }),
  };

  const resolutionRules = [
    { match: isPrismaKnown, key: "prismaKnown" },
    { match: isPrismaValidation, key: "prismaValidation" },
    { match: isJwtError, key: "jwtError" },
    { match: isJwtExpired, key: "jwtExpired" },
    { match: hasStatusCode, key: "customStatus" },
  ];

  const matchedRule = resolutionRules.find(
    (rule: { match: boolean; key: string }): boolean => rule.match
  );
  const selectedResolverKey = matchedRule ? matchedRule.key : "fallback";

  return errorResolvers[selectedResolverKey]();
};

/**
 * @description Middleware centralise d'interception et de restitution des erreurs HTTP.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param error Exception transmise a la chaine Express.
 * @param req Requete HTTP d'origine.
 * @param res Reponse HTTP Express.
 * @param next Fonction de continuite Express.
 */
export const errorMiddleware = (
  error: CustomHttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorResult = identifyError(error);
  errorResponse(res, errorResult.message, errorResult.statusCode);
};

/**
 * @description Middleware de capture des routes non declarees (404 Not Found).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express entrante.
 * @param res Reponse HTTP Express.
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  errorResponse(res, `Point d'acces introuvable : ${req.method} ${req.url}`, 404);
};

/**
 * @description Limiteur de frequence de requetes base sur l'adresse IP cliente.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param windowMs Duree de la fenetre temporelle d'observation en millisecondes.
 * @param maxRequests Nombre maximal de requetes autorisees par fenetre.
 * @returns Middleware Express de rate limiting.
 */
export const rateLimitMiddleware = (
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 100
) => {
  const requestHistory = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || "unknown_ip";
    const now = Date.now();
    const existing = requestHistory.get(clientIp);
    const hasExisting = Boolean(existing);

    const handleNewClient = (): void => {
      requestHistory.set(clientIp, { count: 1, resetTime: now + windowMs });
      next();
    };

    const handleExistingClient = (): void => {
      const record = existing as { count: number; resetTime: number };
      const isExpired = now > record.resetTime;

      const resetAction = (): void => {
        requestHistory.set(clientIp, { count: 1, resetTime: now + windowMs });
        next();
      };

      const incrementAction = (): void => {
        const isLimitReached = record.count >= maxRequests;

        const limitActionMap: Record<string, () => void> = {
          true: () =>
            errorResponse(
              res,
              "Trop de requetes soumises. Veuillez patienter avant de reessayer.",
              429
            ),
          false: () => {
            requestHistory.set(clientIp, {
              count: record.count + 1,
              resetTime: record.resetTime,
            });
            next();
          },
        };

        limitActionMap[String(isLimitReached)]();
      };

      const expirationMap: Record<string, () => void> = {
        true: resetAction,
        false: incrementAction,
      };

      expirationMap[String(isExpired)]();
    };

    const clientDispatchMap: Record<string, () => void> = {
      true: handleExistingClient,
      false: handleNewClient,
    };

    clientDispatchMap[String(hasExisting)]();
  };
};
