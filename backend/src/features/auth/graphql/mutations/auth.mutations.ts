/**
 * @file auth.mutations.ts
 * @description Logique des mutations GraphQL pour l'inscription et la connexion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { AuthResult } from "../../interfaces/auth.interface";
import { RegisterDto, LoginDto } from "../../dtos/auth.dto";
import { registerUser, loginUser } from "../../services/auth.service";

/**
 * @description Execute la mutation d'inscription GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param _parent Objet racine.
 * @param args Arguments encapsules sous la cle {@code input}.
 * @returns Promesse de resultat {@link AuthResult}.
 */
export const registerMutation = async (
  _parent: object,
  args: { input: RegisterDto }
): Promise<AuthResult> => {
  return registerUser(args.input);
};

/**
 * @description Execute la mutation de connexion GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param _parent Objet racine.
 * @param args Arguments encapsules sous la cle {@code input}.
 * @returns Promesse de resultat {@link AuthResult}.
 */
export const loginMutation = async (
  _parent: object,
  args: { input: LoginDto }
): Promise<AuthResult> => {
  return loginUser(args.input);
};
