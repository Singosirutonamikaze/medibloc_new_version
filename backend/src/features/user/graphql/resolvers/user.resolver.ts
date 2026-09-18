/**
 * @file user.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { usersQuery, userQuery, userProfileQuery } from "../queries/user.queries";
import { updateUserMutation, deleteUserMutation } from "../mutations/user.mutations";

export const userResolvers = {
  Query: {
    users: usersQuery,
    user: userQuery,
    userProfile: userProfileQuery,
  },
  Mutation: {
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
  },
};

export default userResolvers;
