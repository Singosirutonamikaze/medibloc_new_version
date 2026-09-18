/**
 * @file auth.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour la fonctionnalite d'authentification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { meQuery } from "../queries/auth.queries";
import { registerMutation, loginMutation } from "../mutations/auth.mutations";

export const authResolvers = {
  Query: {
    me: meQuery,
  },
  Mutation: {
    register: registerMutation,
    login: loginMutation,
  },
};

export default authResolvers;
