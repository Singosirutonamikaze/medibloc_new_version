/**
 * @file user.controller.ts
 * @description Controleur HTTP Express pour le routage des actions utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  updateUserAvatar,
} from "../services/user.service";
import { UpdateUserDto } from "../dtos/user.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";
import { AuthRequest, AuthenticatedUser } from "../../../core/types/global/global.types";

/**
 * @description Liste l'ensemble des utilisateurs enregistres.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await findAllUsers();
    return successResponse(res, users, "Utilisateurs recuperes avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un utilisateur par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const user = await findUserById(id);
    return successResponse(res, user, "Utilisateur recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Met a jour les informations d'un utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateUserDto = req.body;
    const updated = await updateUser(id, dto);
    return successResponse(res, updated, "Utilisateur mis a jour avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteUser(id);
    return successResponse(res, deleted, "Utilisateur supprime avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Recupere le profil complet de l'utilisateur connecte.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = req.user as AuthenticatedUser;
    const profile = await findUserById(user.id);
    return successResponse(res, profile, "Profil utilisateur recupere", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Met a jour l'avatar apres upload.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = req.user as AuthenticatedUser;
    const file = req.file;
    const hasFile = Boolean(file);

    const handleNoFile = (): Response =>
      errorResponse(res, "Aucun fichier image n'a ete fourni", 400);

    const handleWithFile = async (): Promise<Response> => {
      const uploadedFile = file as Express.Multer.File;
      const avatarUrl = `/uploads/avatars/${uploadedFile.filename}`;
      const updated = await updateUserAvatar(user.id, avatarUrl);
      return successResponse(res, updated, "Avatar mis a jour avec succes", 200);
    };

    const actionMap: Record<string, () => Promise<Response> | Response> = {
      true: handleWithFile,
      false: handleNoFile,
    };

    return await actionMap[String(hasFile)]();
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};
