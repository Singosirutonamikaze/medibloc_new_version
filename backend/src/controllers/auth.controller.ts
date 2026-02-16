import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers';
import { ApiResponse, RegisterUserDto } from '../types';

export class AuthController {
  public register = async (req: Request, res: Response): Promise<Response> => {
    let status = 201;
    let response: ApiResponse<any> = { success: true, data: null };

    try {
      const body = req.body as RegisterUserDto;
      const existing = await prisma.user.findUnique({ where: { email: body.email } });
      if (existing) {
        status = 409;
        response = { success: false, error: 'Email déjà utilisé' };
      } else {
        const hashed = await hashPassword(body.password);
        const user = await prisma.user.create({ data: { email: body.email, password: hashed, firstName: body.firstName, lastName: body.lastName, role: body.role ?? 'PATIENT' } as any });
        const token = generateToken({ id: user.id, email: user.email, role: user.role } as any);
        response = { success: true, data: { user, token }, message: 'Utilisateur créé' };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<any> = { success: true, data: null };

    try {
      const { email, password } = req.body as { email: string; password: string };
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const ok = await comparePassword(password, user.password);
        if (ok) {
          const token = generateToken({ id: user.id, email: user.email, role: user.role } as any);
          // hide password
          // @ts-ignore
          const { password: _pwd, ...safeUser } = user;
          response = { success: true, data: { user: safeUser, token } };
        } else {
          status = 401;
          response = { success: false, error: 'Identifiants invalides' };
        }
      } else {
        status = 401;
        response = { success: false, error: 'Identifiants invalides' };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getCurrentUser = async (req: Request & { user?: { id: number } }, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<any> = { success: true, data: null };
    try {
      const userId = req.user?.id;
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          // @ts-ignore
          const { password: _pwd, ...safeUser } = user;
          response = { success: true, data: safeUser };
        } else {
          status = 404;
          response = { success: false, error: 'Utilisateur non trouvé' };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public refreshToken = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(501).json({ success: false, error: 'Not implemented' });
  };

  public logout = async (_req: Request, res: Response): Promise<Response> => {
    return res.json({ success: true, message: 'Déconnecté' });
  };
}
