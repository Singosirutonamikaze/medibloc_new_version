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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
            responseSent = true;
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
        let hasAccess = false;
        let responseSent = false;
        if (!req.user) {
            const errorResponse = {
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
            const errorResponse = {
                success: false,
                error: "Accès non autorisé. Rôle insuffisant.",
            };
            res.status(403).json(errorResponse);
            responseSent = true;
            return;
        }
        hasAccess = true;
        if (hasAccess && !responseSent) {
            next();
        }
    };
    return roleMiddleware;
};
exports.requireRole = requireRole;
/**
 * Vérification de propriété des ressources
 */
const checkResourceOwnership = (resourceType) => {
    const ownershipMiddleware = async (req, res, next) => {
        let hasOwnership = false;
        let responseSent = false;
        try {
            if (!req.user) {
                const errorResponse = {
                    success: false,
                    error: "Authentification requise",
                };
                res.status(401).json(errorResponse);
                responseSent = true;
                return;
            }
            const resourceId = parseInt(req.params.id, 10);
            if (isNaN(resourceId)) {
                const errorResponse = {
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
                    const isAdminOrDoctor = req.user.role === "ADMIN" || req.user.role === "DOCTOR";
                    ownershipVerified = isOwner || isAdminOrDoctor;
                }
                else {
                    const errorResponse = {
                        success: false,
                        error: "Patient non trouvé",
                    };
                    res.status(404).json(errorResponse);
                    responseSent = true;
                    return;
                }
            }
            else if (resourceType === "doctor") {
                const doctor = await prisma.doctor.findUnique({
                    where: { id: resourceId },
                    select: { userId: true },
                });
                if (doctor) {
                    const isOwner = doctor.userId === req.user.id;
                    const isAdmin = req.user.role === "ADMIN";
                    ownershipVerified = isOwner || isAdmin;
                }
                else {
                    const errorResponse = {
                        success: false,
                        error: "Médecin non trouvé",
                    };
                    res.status(404).json(errorResponse);
                    responseSent = true;
                    return;
                }
            }
            else if (resourceType === "appointment") {
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
                }
                else {
                    const errorResponse = {
                        success: false,
                        error: "Rendez-vous non trouvé",
                    };
                    res.status(404).json(errorResponse);
                    responseSent = true;
                    return;
                }
            }
            else {
                const errorResponse = {
                    success: false,
                    error: "Type de ressource non supporté",
                };
                res.status(400).json(errorResponse);
                responseSent = true;
                return;
            }
            if (!ownershipVerified && !responseSent) {
                const errorResponse = {
                    success: false,
                    error: "Accès non autorisé à cette ressource",
                };
                res.status(403).json(errorResponse);
                responseSent = true;
                return;
            }
            hasOwnership = ownershipVerified;
        }
        catch (error) {
            if (!responseSent) {
                console.error("Erreur de vérification de propriété:", error);
                const errorResponse = {
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
exports.checkResourceOwnership = checkResourceOwnership;
