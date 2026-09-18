/**
 * @file user.service.ts
 * @description Logique metier pure et acces persistant Prisma pour la gestion des utilisateurs et profils.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { User } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { UpdateUserDto } from "../dtos/user.dto";
import { UserWithProfiles } from "../interfaces/user.interface";

/**
 * @description Recupere la liste complete des utilisateurs sans exposer les mots de passe.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Collection d'utilisateurs.
 */
export const findAllUsers = async (): Promise<UserWithProfiles[]> => {
  return prisma.user.findMany({
    include: {
      patientProfile: true,
      doctorProfile: true,
      adminProfile: true,
    },
    orderBy: { id: "asc" },
  });
};

/**
 * @description Recherche un utilisateur par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique de l'utilisateur.
 * @returns Utilisateur trouve {@link UserWithProfiles}.
 * @throws Error Lorsque l'utilisateur n'existe pas.
 */
export const findUserById = async (id: number): Promise<UserWithProfiles> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      patientProfile: true,
      doctorProfile: true,
      adminProfile: true,
    },
  });

  const actionMap: Record<string, () => UserWithProfiles> = {
    true: () => user as UserWithProfiles,
    false: () => {
      throw new Error("Utilisateur introuvable");
    },
  };

  return actionMap[String(Boolean(user))]();
};

/**
 * @description Met a jour les informations d'un utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant numerique.
 * @param dto Donnees a modifier {@link UpdateUserDto}.
 * @returns Utilisateur mis a jour.
 */
export const updateUser = async (
  id: number,
  dto: UpdateUserDto
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: {
      ...(dto.firstName ? { firstName: dto.firstName } : {}),
      ...(dto.lastName ? { lastName: dto.lastName } : {}),
      ...(dto.role ? { role: dto.role } : {}),
      ...(dto.avatarUrl ? { avatarUrl: dto.avatarUrl } : {}),
    },
  });
};

/**
 * @description Supprime definitivement un compte utilisateur et ses profils en cascade.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param id Identifiant de l'utilisateur a supprimer.
 * @returns Entite utilisateur supprimee.
 */
export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

/**
 * @description Met a jour l'URL d'avatar d'un utilisateur suite a un televersement reussi.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param userId Identifiant de l'utilisateur.
 * @param avatarUrl Chemin d'acces public du fichier.
 * @returns Utilisateur mis a jour.
 */
export const updateUserAvatar = async (
  userId: number,
  avatarUrl: string
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });
};
