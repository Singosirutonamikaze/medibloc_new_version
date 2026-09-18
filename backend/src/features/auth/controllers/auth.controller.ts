/**
 * @file auth.controller.ts
 * @description Controleur HTTP Express pour les points d'entree d'authentification.
 * Delegue l'ensemble de la logique metier a {@link auth.service.ts}.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import { registerUser, loginUser, getUserProfileById } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { AuthRequest, AuthenticatedUser } from "../../../core/types/global/global.types";

/**
 * @description Point d'entree pour l'inscription d'un nouvel utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express transportant {@link RegisterDto}.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: RegisterDto = req.body;
    const result = await registerUser(dto);
    return successResponse(res, result, "Compte utilisateur cree avec succes", 201);
  } catch (err) {
    const error = err as Error;
    const message = error.message;
    const statusCode = message.includes("deja utilisee") ? 409 : 500;
    return errorResponse(res, message, statusCode);
  }
};

/**
 * @description Point d'entree pour la connexion utilisateur et la delivrance du jeton JWT.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express transportant {@link LoginDto}.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: LoginDto = req.body;
    const result = await loginUser(dto);
    return successResponse(res, result, "Connexion reussie", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 401);
  }
};

/**
 * @description Point d'entree pour obtenir le profil de l'utilisateur connecte.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP authentifiee.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as AuthenticatedUser;
    const profile = await getUserProfileById(user.id);
    return successResponse(res, profile, "Profil recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Deconnexion de la session utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param _req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const logout = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  return successResponse(res, null, "Deconnexion effectuee avec succes", 200);
};
