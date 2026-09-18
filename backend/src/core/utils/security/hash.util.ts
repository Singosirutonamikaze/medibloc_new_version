/**
 * @file hash.util.ts
 * @description Outils cryptographiques et fonctions pures de hachage et de comparaison de mots de passe.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

/**
 * @description Hache une chaine de caracteres en clair en utilisant l'algorithme {@code bcrypt}.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param plainText Chaine de caracteres non chiffree a securiser.
 * @param saltRounds Facteur de travail algorithmique.
 * @returns Empreinte hachee securisee.
 */
export const hashPassword = async (
  plainText: string,
  saltRounds: number = DEFAULT_SALT_ROUNDS,
): Promise<string> => {
  return bcrypt.hash(plainText, saltRounds);
};

/**
 * @description Compare un mot de passe en clair avec une empreinte hachee stockee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param plainText Mot de passe en clair fourni lors de l'authentification.
 * @param hashedText Empreinte hachee issue de la base de donnees.
 * @returns Booleen indiquant si la correspondance est confirmee.
 */
export const comparePassword = async (
  plainText: string,
  hashedText: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedText);
};
