import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';
import fs from 'node:fs';

export class UploadController {
  /**
   * Upload / remplace l'avatar d'un utilisateur
   * POST /api/v1/users/:id/avatar
   */
  public uploadAvatar = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<{ avatarUrl: string } | null> = { success: true, data: null };

    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'ID utilisateur invalide' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Aucun fichier fourni' });
      }

      // Construire l'URL publique accessible
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Récupérer l'ancien avatar pour le supprimer du disque
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
        select: { id: true, avatarUrl: true },
      });

      // Supprimer l'ancienne image si elle existe et est locale
      if (existingUser?.avatarUrl && existingUser.avatarUrl.startsWith('/uploads/')) {
        const oldPath = `${process.cwd()}${existingUser.avatarUrl}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      response = { success: true, data: { avatarUrl: updatedUser.avatarUrl! } };
    } catch (err: unknown) {
      // Multer renvoie une erreur avec message si le fichier est trop grand
      if (err instanceof Error && err.message.includes('File too large')) {
        status = 413;
        response = { success: false, error: 'Fichier trop volumineux. Maximum autorisé : 2 Mo' };
      } else {
        status = 500;
        response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
      }
    }

    return res.status(status).json(response);
  };

  /**
   * Supprimer l'avatar d'un utilisateur
   * DELETE /api/v1/users/:id/avatar
   */
  public deleteAvatar = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<null> = { success: true, data: null };

    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'ID utilisateur invalide' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
      }

      if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/')) {
        const filePath = `${process.cwd()}${user.avatarUrl}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: null },
      });

      response = { success: true, data: null, message: 'Avatar supprimé' };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
