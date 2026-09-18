/**
 * @file user.queries.ts
 * @description Requetes GraphQL pour les utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { UserWithProfiles } from "../../interfaces/user.interface";
import { findAllUsers, findUserById } from "../../services/user.service";

/**
 * @description Recupere tous les utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const usersQuery = async (): Promise<UserWithProfiles[]> => {
  return findAllUsers();
};

/**
 * @description Recupere un utilisateur par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const userQuery = async (
  _parent: object,
  args: { id: number }
): Promise<UserWithProfiles | null> => {
  try {
    return await findUserById(args.id);
  } catch {
    return null;
  }
};

/**
 * @description Recupere le profil de l'utilisateur connecte.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const userProfileQuery = async (
  _parent: object,
  _args: object,
  context: { user?: { id: number } }
): Promise<UserWithProfiles | null> => {
  const hasUser = Boolean(context.user);

  const queryActionMap: Record<string, () => Promise<UserWithProfiles | null>> = {
    true: async () => {
      const user = context.user as { id: number };
      return findUserById(user.id);
    },
    false: async () => null,
  };

  return queryActionMap[String(hasUser)]();
};
