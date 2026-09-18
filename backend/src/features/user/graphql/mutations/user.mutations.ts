/**
 * @file user.mutations.ts
 * @description Mutations GraphQL pour les utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { User } from "@prisma/client";
import { UpdateUserDto } from "../../dtos/user.dto";
import { updateUser, deleteUser } from "../../services/user.service";

/**
 * @description Mutation GraphQL de mise a jour utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const updateUserMutation = async (
  _parent: object,
  args: { id: number; input: UpdateUserDto }
): Promise<User> => {
  return updateUser(args.id, args.input);
};

/**
 * @description Mutation GraphQL de suppression utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const deleteUserMutation = async (
  _parent: object,
  args: { id: number }
): Promise<User> => {
  return deleteUser(args.id);
};
