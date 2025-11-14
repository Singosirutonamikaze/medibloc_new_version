import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type UserCreate = unknown;
type UserUpdate = unknown;

export class UserController {
	private generic: GenericController<unknown, UserCreate, UserUpdate>;

	public getAllUsers: (req: Request, res: Response) => Promise<Response>;
	public getUserById: (req: Request, res: Response) => Promise<Response>;
	public updateUser: (req: Request, res: Response) => Promise<Response>;
	public deleteUser: (req: Request, res: Response) => Promise<Response>;

	constructor() {
		const repo = {
			findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
				prisma.user.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
			findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
				prisma.user.findUnique({ where: params.where as any, include: params.include as any }),
			create: (params: { data: UserCreate }) => prisma.user.create({ data: params.data as any }),
			update: (params: { where: { id: number }; data: UserUpdate }) =>
				prisma.user.update({ where: params.where as any, data: params.data as any }),
			delete: (params: { where: { id: number } }) => prisma.user.delete({ where: params.where as any }),
			count: (params?: { where?: Record<string, unknown> }) => prisma.user.count({ where: params?.where as any }),
		};

		this.generic = new GenericController(repo);

		// bind route methods
		this.getAllUsers = this.generic.getAll;
		this.getUserById = this.generic.getOne;
		this.updateUser = this.generic.update;
		this.deleteUser = this.generic.delete;
	}

	public getUserProfile = async (req: Request & { user?: { id: number } }, res: Response): Promise<Response> => {
		let status = 200;
		let response: ApiResponse<unknown | null> = { success: true, data: null };

		try {
			const userId = req.user?.id;
			if (!userId) {
				status = 401;
				response = { success: false, error: 'Non authentifié' };
			} else {
				const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } as any });
				if (!user) {
					status = 404;
					response = { success: false, error: "Utilisateur non trouvé" };
				} else {
					response = { success: true, data: user };
				}
			}
		} catch (err: unknown) {
			status = 500;
			response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
		}

		return res.status(status).json(response);
	};
}
