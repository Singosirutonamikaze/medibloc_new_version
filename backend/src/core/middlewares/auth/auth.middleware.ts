/**
 * @file auth.middleware.ts
 * @description Middlewares d'authentification par jeton JWT, controle d'acces fonde sur les roles (RBAC)
 * et verification d'appartenance des ressources cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../configs/env/env.config";
import { prisma } from "../../configs/database/database.config";
import { parseIdParam } from "../../utils/parsers/parseIdParam.util";
import { errorResponse } from "../../utils/responses/response.util";
import {
  AuthRequest,
  AuthenticatedUser,
} from "../../types/global/global.types";

/**
 * @typedef UserRole
 * @description Roles d'habilitation reconnus sur la plateforme.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

/**
 * @interface DecodedToken
 * @description Structure des donnees utiles extraites d'un jeton JWT valide.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant numerique unique de l'utilisateur.
 * @property email Adresse de messagerie electronique associee au compte.
 * @property role Role d'habilitation affecte a l'utilisateur.
 */
export interface DecodedToken {
  readonly id: number;
  readonly email: string;
  readonly role: UserRole;
}

/**
 * @description Extrait le jeton Bearer de l'en-tete Authorization.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param authHeader Chaine brute de l'en-tete d'autorisation.
 * @returns Jeton JWT extrait ou chaine vide.
 */
const extractBearerToken = (authHeader: string): string => {
  const isBearer = authHeader.startsWith("Bearer ");
  return isBearer ? authHeader.substring(7).trim() : "";
};

/**
 * @description Traitement de l'absence de jeton d'authentification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param res Reponse HTTP Express.
 */
const handleMissingToken = async (res: Response): Promise<void> => {
  errorResponse(res, "Token d'authentification manquant ou invalide", 401);
};

/**
 * @description Traitement de la validation et du decodage d'un jeton JWT existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param token Jeton JWT extrait.
 * @param req Requete HTTP etendue.
 * @param res Reponse HTTP Express.
 * @param next Fonction de continuite.
 */
const handleTokenVerification = async (
  token: string,
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const userStatus = user !== null ? "found" : "notFound";
    const userHandlers: Record<string, () => void> = {
      found: () => {
        const foundUser = user as { id: number; email: string; role: UserRole };
        req.user = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
        };
        next();
      },
      notFound: () => {
        errorResponse(res, "Utilisateur non trouve", 401);
      },
    };

    userHandlers[userStatus]();
  } catch (err) {
    const isExpired = err instanceof jwt.TokenExpiredError;
    const errorKey = isExpired ? "expired" : "invalid";
    const errorMessages: Record<string, string> = {
      expired: "Token expire",
      invalid: "Token invalide",
    };
    errorResponse(res, errorMessages[errorKey], 401);
  }
};

/**
 * @description Valide la presence et l'integrite du jeton JWT passe dans l'en-tete Authorization.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP etendue contenant le contexte utilisateur.
 * @param res Reponse HTTP Express.
 * @param next Fonction de continuite de la chaine de middlewares.
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.header("Authorization") || "";
  const token = extractBearerToken(authHeader);
  const tokenStatus = token.length > 0 ? "valid" : "missing";

  const tokenHandlers: Record<string, () => Promise<void>> = {
    missing: async () => handleMissingToken(res),
    valid: async () => handleTokenVerification(token, req, res, next),
  };

  await tokenHandlers[tokenStatus]();
};

/**
 * @description Factory generant un middleware de filtrage par roles habilites (RBAC).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param allowedRoles Tableau des roles autorises a franchir le point d'acces.
 * @returns Middleware Express de verification de role.
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    const authStatus = user !== undefined ? "authenticated" : "unauthenticated";

    const authHandlers: Record<string, () => void> = {
      authenticated: () => {
        const authenticatedUser = user as AuthenticatedUser;
        const isAllowed = allowedRoles.includes(authenticatedUser.role);
        const roleStatus = isAllowed ? "allowed" : "forbidden";
        const roleHandlers: Record<string, () => void> = {
          allowed: () => next(),
          forbidden: () =>
            errorResponse(res, "Acces non autorise. Role insuffisant.", 403),
        };
        roleHandlers[roleStatus]();
      },
      unauthenticated: () => {
        errorResponse(res, "Authentification requise", 401);
      },
    };

    authHandlers[authStatus]();
  };
};

/**
 * @description Verifie la propriete d'un patient par rapport a l'utilisateur connecte.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceId Identifiant du patient.
 * @param userId Identifiant de l'utilisateur.
 * @param userRole Role fonctionnel.
 * @returns Promesse d'autorisation.
 */
const verifyPatientOwnership = async (
  resourceId: number,
  userId: number,
  userRole: UserRole,
): Promise<boolean> => {
  const patient = await prisma.patient.findUnique({
    where: { id: resourceId },
    select: { userId: true },
  });
  const exists = patient !== null;
  const isOwner = exists && (patient as { userId: number }).userId === userId;
  const isAdminOrDoctor = userRole === "ADMIN" || userRole === "DOCTOR";
  return isOwner || isAdminOrDoctor;
};

/**
 * @description Verifie la propriete d'un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceId Identifiant du medecin.
 * @param userId Identifiant de l'utilisateur.
 * @param userRole Role fonctionnel.
 * @returns Promesse d'autorisation.
 */
const verifyDoctorOwnership = async (
  resourceId: number,
  userId: number,
  userRole: UserRole,
): Promise<boolean> => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: resourceId },
    select: { userId: true },
  });
  const exists = doctor !== null;
  const isOwner = exists && (doctor as { userId: number }).userId === userId;
  const isAdmin = userRole === "ADMIN";
  return isOwner || isAdmin;
};

/**
 * @description Verifie la propriete d'un rendez-vous par un patient, medecin ou administrateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceId Identifiant du rendez-vous.
 * @param userId Identifiant de l'utilisateur.
 * @param userRole Role fonctionnel.
 * @returns Promesse d'autorisation.
 */
const verifyAppointmentOwnership = async (
  resourceId: number,
  userId: number,
  userRole: UserRole,
): Promise<boolean> => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: resourceId },
    select: { patientId: true, doctorId: true },
  });
  const patientProfile = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });
  const doctorProfile = await prisma.doctor.findUnique({
    where: { userId },
    select: { id: true },
  });

  const exists = appointment !== null;
  const isPatientOwner =
    exists &&
    patientProfile !== null &&
    (patientProfile as { id: number }).id ===
      (appointment as { patientId: number; doctorId: number }).patientId;

  const isDoctorOwner =
    exists &&
    doctorProfile !== null &&
    (doctorProfile as { id: number }).id ===
      (appointment as { patientId: number; doctorId: number }).doctorId;

  const isAdmin = userRole === "ADMIN";

  return isPatientOwner || isDoctorOwner || isAdmin;
};

const ownershipVerifiers: Record<
  string,
  (resourceId: number, userId: number, role: UserRole) => Promise<boolean>
> = {
  patient: verifyPatientOwnership,
  doctor: verifyDoctorOwnership,
  appointment: verifyAppointmentOwnership,
};

/**
 * @description Resout l'etat de validation de la requete de verification d'appartenance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param user Utilisateur connecte ou indefini.
 * @param resourceId Identifiant numerique de la ressource.
 * @param verifier Fonction de verification associee ou indefinie.
 * @returns Code d'etat de validation.
 */
const resolveValidationStatus = (
  user: AuthenticatedUser | undefined,
  resourceId: number,
  verifier:
    | ((resourceId: number, userId: number, role: UserRole) => Promise<boolean>)
    | undefined,
): string => {
  const checks: readonly [boolean, string][] = [
    [user === undefined, "UNAUTHENTICATED"],
    [Number.isNaN(resourceId), "INVALID_ID"],
    [verifier === undefined, "UNSUPPORTED_RESOURCE"],
  ];

  const matched = checks.find(([isTriggered]) => isTriggered);
  const statusKey = matched !== undefined ? "found" : "valid";
  const statusResolvers: Record<string, () => string> = {
    found: () => (matched as [boolean, string])[1],
    valid: () => "VALID",
  };
  return statusResolvers[statusKey]();
};

/**
 * @description Verifie l'appartenance d'une ressource specifique ou autorise les administrateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceType Categorie de ressource a controler ({@code "patient"}, {@code "doctor"}, {@code "appointment"}).
 * @returns Middleware Express asynchrone de verification.
 */
export const checkResourceOwnership = (resourceType: string) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = req.user;
    const resourceId = parseIdParam(req.params.id);
    const verifier = ownershipVerifiers[resourceType];
    const status = resolveValidationStatus(user, resourceId, verifier);

    const validationHandlers: Record<string, () => Promise<void>> = {
      UNAUTHENTICATED: async () => {
        errorResponse(res, "Authentification requise", 401);
      },
      INVALID_ID: async () => {
        errorResponse(res, "Identifiant de ressource invalide", 400);
      },
      UNSUPPORTED_RESOURCE: async () => {
        errorResponse(res, "Type de ressource non supporte", 400);
      },
      VALID: async () => {
        const activeUser = user as AuthenticatedUser;
        const activeVerifier = verifier as (
          id: number,
          userId: number,
          role: UserRole,
        ) => Promise<boolean>;

        const isAllowed = await activeVerifier(
          resourceId,
          activeUser.id,
          activeUser.role as UserRole,
        );

        const accessStatus = isAllowed ? "ALLOWED" : "FORBIDDEN";
        const accessHandlers: Record<string, () => void> = {
          ALLOWED: () => next(),
          FORBIDDEN: () =>
            errorResponse(res, "Acces non autorise a cette ressource", 403),
        };

        accessHandlers[accessStatus]();
      },
    };

    await validationHandlers[status]();
  };
};
