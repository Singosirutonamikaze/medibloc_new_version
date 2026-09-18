/**
 * @file auth.queries.ts
 * @description Logique des requetes GraphQL pour le domaine d'authentification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { SafeUser } from "../../interfaces/auth.interface";
import { getUserProfileById } from "../../services/auth.service";

/**
 * @description Resout le profil de l'utilisateur courant via le contexte GraphQL authentifie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param _parent Objet racine parent.
 * @param _args Arguments de requete.
 * @param context Contexte d'execution contenant l'utilisateur authentifie.
 * @returns Promesse contenant le profil {@link SafeUser}.
 */
export const meQuery = async (
  _parent: object,
  _args: object,
  context: { user?: { id: number } }
): Promise<SafeUser | null> => {
  const hasUser = Boolean(context.user);

  const queryActionMap: Record<string, () => Promise<SafeUser | null>> = {
    true: async () => {
      const user = context.user as { id: number };
      return getUserProfileById(user.id);
    },
    false: async () => null,
  };

  return queryActionMap[String(hasUser)]();
};
