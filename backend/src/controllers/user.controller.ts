import { Request, Response } from 'express';
import { User, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse, AuthRequest } from '../types';

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;

export class UserController {
	private generic: GenericController<User, UserCreateInput, UserUpdateInput>;

	public getAllUsers: (req: Request, res: Response) => Promise<Response>;
	public getUserById: (req: Request, res: Response) => Promise<Response>;
	public updateUser: (req: Request, res: Response) => Promise<Response>;
	public deleteUser: (req: Request, res: Response) => Promise<Response>;

	constructor() {
		const repo = {
			findMany: (params?: Prisma.UserFindManyArgs) =>
				prisma.user.findMany(params),
			findUnique: (params: Prisma.UserFindUniqueArgs) =>
				prisma.user.findUnique(params),
			create: (params: { data: UserCreateInput }) =>
				prisma.user.create({ data: params.data }),
			update: (params: { where: { id: number }; data: UserUpdateInput }) =>
				prisma.user.update({ where: params.where, data: params.data }),
			delete: (params: { where: { id: number } }) =>
				prisma.user.delete({ where: params.where }),
			count: (params?: Prisma.UserCountArgs) =>
				prisma.user.count(params),
		};

		this.generic = new GenericController(repo);

		// bind route methods
		this.getAllUsers = this.generic.getAll;
		this.getUserById = this.generic.getOne;
		this.updateUser = this.generic.update;
		this.deleteUser = this.generic.delete;
	}

	public getUserProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
		let status = 200;
		let response: ApiResponse<Prisma.UserGetPayload<{ include: { patientProfile: true; doctorProfile: true; adminProfile: true } }> | null> = { success: true, data: null };

		try {
			const userId = req.user?.id;
			if (!userId) {
				status = 401;
				response = { success: false, error: 'Non authentifié' };
			} else {
				const user = await prisma.user.findUnique({
					where: { id: userId },
					include: {
						patientProfile: true,
						doctorProfile: true,
						adminProfile: true
					}
				});
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
