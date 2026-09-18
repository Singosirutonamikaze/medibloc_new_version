/**
 * @file auth.service.ts
 * @description Couche de logique metier pour l'authentification, le hachage et la delivrance de jetons JWT.
 * Implementee selon le paradigme declaratif sans instructions conditionnelles directes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import jwt from "jsonwebtoken";
import { Role, User } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { config } from "../../../core/configs/env/env.config";
import {
  hashPassword,
  comparePassword,
} from "../../../core/utils/security/hash.util";
import {
  SafeUser,
  AuthResult,
  TokenPayload,
} from "../interfaces/auth.interface";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

/**
 * @description Transforme un enregistrement complet de base de donnees {@link User} en objet {@link SafeUser}.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param user Enregistrement utilisateur brut issu de Prisma.
 * @returns Profil public securise.
 */
export const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  avatarUrl: user.avatarUrl,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * @description Genere un jeton JWT signe a partir du payload utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param payload Charge utile contenant l'identifiant, l'email et le role.
 * @returns Jeton JWT encode.
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
};

/**
 * @description Enregistre un nouvel utilisateur et initialise son profil selon son role.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Donnees d'inscription conformes a {@link RegisterDto}.
 * @returns Promesse resolue avec {@link AuthResult}.
 * @throws Error Lorsque l'adresse email est deja attribuee.
 */
export const registerUser = async (dto: RegisterDto): Promise<AuthResult> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  const checkExistingUser: Record<string, () => Promise<User>> = {
    true: async () => {
      throw new Error("L'adresse email est deja utilisee par un autre compte");
    },
    false: async () => {
      const hashedPassword = await hashPassword(dto.password);
      const role: Role = dto.role || Role.PATIENT;

      const profileCreators: Record<Role, object> = {
        PATIENT: { patientProfile: { create: {} } },
        DOCTOR: { doctorProfile: { create: {} } },
        ADMIN: { adminProfile: { create: {} } },
      };

      const selectedProfile = profileCreators[role];

      return prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role,
          ...selectedProfile,
        },
      });
    },
  };

  const isExisting = Boolean(existingUser);
  const createdUser = await checkExistingUser[String(isExisting)]();
  const token = generateToken({
    id: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
  });

  return {
    user: toSafeUser(createdUser),
    token,
  };
};

/**
 * @description Authentifie un utilisateur a partir de ses identifiants email et mot de passe.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param dto Identifiants de connexion {@link LoginDto}.
 * @returns Promesse resolue avec {@link AuthResult}.
 * @throws Error Lorsque l'email ou le mot de passe est incorrect.
 */
export const loginUser = async (dto: LoginDto): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  const processAuthentication: Record<string, () => Promise<AuthResult>> = {
    false: async () => {
      throw new Error("Identifiants de connexion invalides");
    },
    true: async () => {
      const validUser = user as User;
      const isPasswordValid = await comparePassword(
        dto.password,
        validUser.password,
      );

      const handlePasswordCheck: Record<string, () => AuthResult> = {
        false: () => {
          throw new Error("Identifiants de connexion invalides");
        },
        true: () => {
          const token = generateToken({
            id: validUser.id,
            email: validUser.email,
            role: validUser.role,
          });
          return {
            user: toSafeUser(validUser),
            token,
          };
        },
      };

      return handlePasswordCheck[String(isPasswordValid)]();
    },
  };

  const isUserFound = Boolean(user);
  return processAuthentication[String(isUserFound)]();
};

/**
 * @description Recupere le profil public d'un utilisateur a partir de son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param userId Identifiant numerique unique.
 * @returns Profil securise {@link SafeUser}.
 * @throws Error Lorsque l'utilisateur est introuvable.
 */
export const getUserProfileById = async (userId: number): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const userActionMap: Record<string, () => SafeUser> = {
    true: () => toSafeUser(user as User),
    false: () => {
      throw new Error("Utilisateur introuvable");
    },
  };

  const isFound = Boolean(user);
  return userActionMap[String(isFound)]();
};
