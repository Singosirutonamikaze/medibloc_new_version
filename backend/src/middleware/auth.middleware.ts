/**
 * Middleware d'authentification JWT.
 *
 * Vérifie la présence et la validité d'un token JWT dans l'en-tête "Authorization"
 * (format "Bearer <token>"). Décode le token pour récupérer l'identifiant utilisateur,
 * charge l'utilisateur depuis la base de données (via Prisma) et attache un objet
 * AuthenticatedUser à `req.user` si l'utilisateur est trouvé et le token est valide.
 *
 * Comportement :
 * - Si l'en-tête Authorization est manquant ou ne commence pas par "Bearer ", renvoie 401.
 * - Si le token est vide, renvoie 401.
 * - Si le token est invalide, renvoie 401 avec message "Token invalide".
 * - Si le token est expiré, renvoie 401 avec message "Token expiré".
 * - Si l'utilisateur associé au token n'est pas trouvé, renvoie 401.
 * - En cas d'erreur interne, renvoie 500.
 * - Si l'authentification réussit, attache `req.user: AuthenticatedUser` et appelle `next()`.
 *
 * @remarks
 * - Utilise `config.jwt.secret` pour vérifier le token.
 * - Charge depuis la base de données uniquement les champs nécessaires (id, email, role, firstName, lastName).
 * - Les réponses suivent le schéma ApiResponse { success: boolean, error?: string }.
 *
 * @param req - Objet de requête étendu (AuthRequest). Après réussite, `req.user` est défini.
 * @param res - Objet de réponse Express.
 * @param next - Fonction next() d'Express appelée si l'utilisateur est authentifié.
 *
 * @public
 */

/**
 * Factory qui renvoie un middleware de vérification de rôle.
 *
 * Le middleware résultant vérifie que `req.user` existe et que le rôle de l'utilisateur
 * figure parmi les `allowedRoles`. Si l'utilisateur n'est pas authentifié, renvoie 401.
 * Si le rôle n'est pas autorisé, renvoie 403.
 *
 * Comportement :
 * - Si `req.user` absent -> 401 "Authentification requise".
 * - Si le rôle de l'utilisateur n'est pas dans `allowedRoles` -> 403 "Accès non autorisé. Rôle insuffisant."
 * - Sinon, appelle `next()`.
 *
 * @remarks
 * - `allowedRoles` doit contenir les noms de rôles tels qu'ils sont stockés dans la DB (ex. "ADMIN", "DOCTOR").
 * - Ce middleware suppose que l'authentification a déjà été effectuée (par ex. via `authMiddleware`).
 *
 * @param allowedRoles - Tableau des rôles autorisés pour la route.
 * @returns Middleware Express qui vérifie le rôle de l'utilisateur.
 *
 * @public
 */

/**
 * Factory qui renvoie un middleware de vérification de propriété/permission sur une ressource.
 *
 * Supporte les types de ressources suivants :
 * - "patient" : autorise le propriétaire (patient.userId === req.user.id) ou les rôles ADMIN/DOCTOR.
 * - "doctor" : autorise le propriétaire (doctor.userId === req.user.id) ou le rôle ADMIN.
 * - "appointment" : autorise le patient lié, le médecin lié, ou le rôle ADMIN.
 *
 * Comportement général :
 * - Exige que `req.user` soit défini (sinon 401).
 * - Lit `req.params.id` et le parse en entier (si invalide -> 400).
 * - Vérifie l'existence de la ressource (si non trouvée -> 404).
 * - Vérifie si l'utilisateur courant possède la ressource ou a un rôle administratif adapté (sinon 403).
 * - En cas d'erreur serveur, renvoie 500 avec message générique.
 * - Si la vérification réussit, appelle `next()`.
 *
 * @remarks
 * - Pour "appointment", le middleware récupère d'abord le rendez-vous (patientId, doctorId),
 *   puis cherche les profils patient/doctor liés à l'utilisateur courant pour comparer les IDs.
 * - Utilise Prisma pour les accès en lecture aux tables patient, doctor et appointment.
 * - Les réponses utilisent le format ApiResponse { success: boolean, error?: string }.
 *
 * @param resourceType - Type de ressource à vérifier ("patient" | "doctor" | "appointment").
 * @returns Middleware Express asynchrone effectuant la vérification de propriété/permission.
 *
 * @public
 */

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import {
  AuthRequest,
  AuthenticatedUser,
  JwtPayload,
  ApiResponse,
} from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware d'authentification JWT
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let isAuthenticated = false;
  let responseSent = false;

  try {
    const authHeader = req.header("Authorization");
    const hasValidAuthHeader = authHeader?.startsWith("Bearer ");

    if (!hasValidAuthHeader) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Token d'authentification manquant ou invalide",
      };
      res.status(401).json(errorResponse);
      responseSent = true;
      return;
    }

    const token = authHeader!.substring(7);

    if (!token.trim()) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Token vide",
      };
      res.status(401).json(errorResponse);
      responseSent = true;
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret!) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Utilisateur non trouvé",
      };
      res.status(401).json(errorResponse);
      responseSent = true;
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    } as AuthenticatedUser;

    isAuthenticated = true;
  } catch (error) {
    if (!responseSent) {
      let errorMessage = "Erreur d'authentification";
      let statusCode = 500;

      if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = "Token invalide";
        statusCode = 401;
      } else if (error instanceof jwt.TokenExpiredError) {
        errorMessage = "Token expiré";
        statusCode = 401;
      }

      const errorResponse: ApiResponse = {
        success: false,
        error: errorMessage,
      };
      res.status(statusCode).json(errorResponse);
      responseSent = true;
    }
  }

  if (isAuthenticated && !responseSent) {
    next();
  }
};

/**
 * Factory pour la vérification de rôle
 */
export const requireRole = (allowedRoles: string[]) => {
  const roleMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    let hasAccess = false;
    let responseSent = false;

    if (!req.user) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Authentification requise",
      };
      res.status(401).json(errorResponse);
      responseSent = true;
      return;
    }

    const userRole = req.user.role;
    const isRoleAllowed = allowedRoles.includes(userRole);

    if (!isRoleAllowed) {
      const errorResponse: ApiResponse = {
        success: false,
        error: "Accès non autorisé. Rôle insuffisant.",
      };
      res.status(403).json(errorResponse);
      return;
    }

    hasAccess = true;

    if (hasAccess && !responseSent) {
      next();
    }
  };

  return roleMiddleware;
};

/**
 * Vérification de propriété des ressources
 */
export const checkResourceOwnership = (resourceType: string) => {
  const ownershipMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let hasOwnership = false;
    let responseSent = false;

    try {
      if (!req.user) {
        const errorResponse: ApiResponse = {
          success: false,
          error: "Authentification requise",
        };
        res.status(401).json(errorResponse);
        responseSent = true;
        return;
      }

      const resourceId = Number.parseInt(req.params.id, 10);

      if (Number.isNaN(resourceId)) {
        const errorResponse: ApiResponse = {
          success: false,
          error: "ID de ressource invalide",
        };
        res.status(400).json(errorResponse);
        responseSent = true;
        return;
      }

      let ownershipVerified = false;

      if (resourceType === "patient") {
        const patient = await prisma.patient.findUnique({
          where: { id: resourceId },
          select: { userId: true },
        });

        if (patient) {
          const isOwner = patient.userId === req.user.id;
          const isAdminOrDoctor =
            req.user.role === "ADMIN" || req.user.role === "DOCTOR";
          ownershipVerified = isOwner || isAdminOrDoctor;
        } else {
          const errorResponse: ApiResponse = {
            success: false,
            error: "Patient non trouvé",
          };
          res.status(404).json(errorResponse);
          responseSent = true;
          return;
        }
      } else if (resourceType === "doctor") {
        const doctor = await prisma.doctor.findUnique({
          where: { id: resourceId },
          select: { userId: true },
        });

        if (doctor) {
          const isOwner = doctor.userId === req.user.id;
          const isAdmin = req.user.role === "ADMIN";
          ownershipVerified = isOwner || isAdmin;
        } else {
          const errorResponse: ApiResponse = {
            success: false,
            error: "Médecin non trouvé",
          };
          res.status(404).json(errorResponse);
          responseSent = true;
          return;
        }
      } else if (resourceType === "appointment") {
        const appointment = await prisma.appointment.findUnique({
          where: { id: resourceId },
          select: { patientId: true, doctorId: true },
        });

        if (appointment) {
          const patientProfile = await prisma.patient.findUnique({
            where: { userId: req.user.id },
            select: { id: true },
          });

          const doctorProfile = await prisma.doctor.findUnique({
            where: { userId: req.user.id },
            select: { id: true },
          });

          const isPatientOwner = patientProfile?.id === appointment.patientId;
          const isDoctorOwner = doctorProfile?.id === appointment.doctorId;
          const isAdmin = req.user.role === "ADMIN";

          ownershipVerified = isPatientOwner || isDoctorOwner || isAdmin;
        } else {
          const errorResponse: ApiResponse = {
            success: false,
            error: "Rendez-vous non trouvé",
          };
          res.status(404).json(errorResponse);
          responseSent = true;
          return;
        }
      } else {
        const errorResponse: ApiResponse = {
          success: false,
          error: "Type de ressource non supporté",
        };
        res.status(400).json(errorResponse);
        responseSent = true;
        return;
      }

      if (!ownershipVerified && !responseSent) {
        const errorResponse: ApiResponse = {
          success: false,
          error: "Accès non autorisé à cette ressource",
        };
        res.status(403).json(errorResponse);
        responseSent = true;
        return;
      }

      hasOwnership = ownershipVerified;
    } catch (error) {
      if (!responseSent) {
        console.error("Erreur de vérification de propriété:", error);
        const errorResponse: ApiResponse = {
          success: false,
          error: "Erreur de vérification des permissions",
        };
        res.status(500).json(errorResponse);
        responseSent = true;
      }
    }

    if (hasOwnership && !responseSent) {
      next();
    }
  };

  return ownershipMiddleware;
};
