"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResourceOwnership = exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const database_1 = __importDefault(require("../config/database"));
/**
 * Middleware d'authentification JWT
 */
const authMiddleware = async (req, res, next) => {
    let isAuthenticated = false;
    let responseSent = false;
    try {
        const authHeader = req.header("Authorization");
        const hasValidAuthHeader = authHeader?.startsWith("Bearer ");
        if (!hasValidAuthHeader) {
            const errorResponse = {
                success: false,
                error: "Token d'authentification manquant ou invalide",
            };
            res.status(401).json(errorResponse);
            return;
        }
        const token = authHeader.substring(7);
        if (!token.trim()) {
            const errorResponse = {
                success: false,
                error: "Token vide",
            };
            res.status(401).json(errorResponse);
            responseSent = true;
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        if (!decoded || typeof decoded === 'string') {
            const errorResponse = {
                success: false,
                error: "Token invalide",
            };
            res.status(401).json(errorResponse);
            return;
        }
        const user = await database_1.default.user.findUnique({
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
            const errorResponse = {
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
        };
        isAuthenticated = true;
    }
    catch (error) {
        if (!responseSent) {
            let errorMessage = "Erreur d'authentification";
            let statusCode = 500;
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                errorMessage = "Token invalide";
                statusCode = 401;
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                errorMessage = "Token expiré";
                statusCode = 401;
            }
            const errorResponse = {
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
exports.authMiddleware = authMiddleware;
/**
 * Factory pour la vérification de rôle
 */
const requireRole = (allowedRoles) => {
    const roleMiddleware = (req, res, next) => {
        if (!req.user) {
            const errorResponse = {
                success: false,
                error: "Authentification requise",
            };
            res.status(401).json(errorResponse);
            return;
        }
        const userRole = req.user.role;
        const isRoleAllowed = allowedRoles.includes(userRole);
        if (!isRoleAllowed) {
            const errorResponse = {
                success: false,
                error: "Accès non autorisé. Rôle insuffisant.",
            };
            res.status(403).json(errorResponse);
            return;
        }
        next();
    };
    return roleMiddleware;
};
exports.requireRole = requireRole;
/**
 * Vérification de propriété des ressources
 */
const checkResourceOwnership = (resourceType) => {
    const verifyPatientOwnership = async (resourceId, userId, userRole) => {
        const patient = await database_1.default.patient.findUnique({
            where: { id: resourceId },
            select: { userId: true },
        });
        if (!patient) {
            return false;
        }
        const isOwner = patient.userId === userId;
        const isAdminOrDoctor = userRole === "ADMIN" || userRole === "DOCTOR";
        return isOwner || isAdminOrDoctor;
    };
    const verifyDoctorOwnership = async (resourceId, userId, userRole) => {
        const doctor = await database_1.default.doctor.findUnique({
            where: { id: resourceId },
            select: { userId: true },
        });
        if (!doctor) {
            return false;
        }
        const isOwner = doctor.userId === userId;
        const isAdmin = userRole === "ADMIN";
        return isOwner || isAdmin;
    };
    const verifyAppointmentOwnership = async (resourceId, userId, userRole) => {
        const appointment = await database_1.default.appointment.findUnique({
            where: { id: resourceId },
            select: { patientId: true, doctorId: true },
        });
        if (!appointment) {
            return false;
        }
        const patientProfile = await database_1.default.patient.findUnique({
            where: { userId },
            select: { id: true },
        });
        const doctorProfile = await database_1.default.doctor.findUnique({
            where: { userId },
            select: { id: true },
        });
        const isPatientOwner = patientProfile?.id === appointment.patientId;
        const isDoctorOwner = doctorProfile?.id === appointment.doctorId;
        const isAdmin = userRole === "ADMIN";
        return isPatientOwner || isDoctorOwner || isAdmin;
    };
    const sendError = (res, statusCode, error) => {
        const errorResponse = {
            success: false,
            error,
        };
        res.status(statusCode).json(errorResponse);
    };
    const ownershipMiddleware = async (req, res, next) => {
        try {
            if (!req.user) {
                sendError(res, 401, "Authentification requise");
                return;
            }
            const resourceId = Number.parseInt(req.params.id, 10);
            if (Number.isNaN(resourceId)) {
                sendError(res, 400, "ID de ressource invalide");
                return;
            }
            let ownershipVerified = false;
            switch (resourceType) {
                case "patient":
                    ownershipVerified = await verifyPatientOwnership(resourceId, req.user.id, req.user.role);
                    if (!ownershipVerified) {
                        sendError(res, 404, "Patient non trouvé");
                        return;
                    }
                    break;
                case "doctor":
                    ownershipVerified = await verifyDoctorOwnership(resourceId, req.user.id, req.user.role);
                    if (!ownershipVerified) {
                        sendError(res, 404, "Médecin non trouvé");
                        return;
                    }
                    break;
                case "appointment":
                    ownershipVerified = await verifyAppointmentOwnership(resourceId, req.user.id, req.user.role);
                    if (!ownershipVerified) {
                        sendError(res, 404, "Rendez-vous non trouvé");
                        return;
                    }
                    break;
                default:
                    sendError(res, 400, "Type de ressource non supporté");
                    return;
            }
            if (!ownershipVerified) {
                sendError(res, 403, "Accès non autorisé à cette ressource");
                return;
            }
            next();
        }
        catch (error) {
            console.error("Erreur de vérification de propriété:", error);
            sendError(res, 500, "Erreur de vérification des permissions");
        }
    };
    return ownershipMiddleware;
};
exports.checkResourceOwnership = checkResourceOwnership;
