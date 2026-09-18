/**
 * @file helpers.util.ts
 * @description Boite a outils de fonctions pures pour la pagination, la validation de format email,
 * le calcul de dates et l'assainissement d'objets metiers.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../configs/env/env.config";
import {
  JwtPayload,
  User,
  SanitizedUser,
} from "../../types/global/global.types";

const BCRYPT_SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

/**
 * @interface PaginationResult
 * @description Resultat du calcul de decalage et de prise pour Prisma ORM.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property skip Nombre d'enregistrements a ignorer.
 * @property take Nombre d'enregistrements a recuperer.
 */
export interface PaginationResult {
  readonly skip: number;
  readonly take: number;
}

/**
 * @description Hache un mot de passe de maniere securisee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param password Mot de passe en clair.
 * @returns Empreinte hachee.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * @description Compare un mot de passe en clair avec son empreinte hachee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param password Mot de passe en clair.
 * @param hash Empreinte stockee.
 * @returns Promesse de booleen de validite.
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * @description Genere un jeton JWT signe a partir du payload utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param payload Donnees de l'utilisateur authentifie.
 * @returns Jeton JWT encode.
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

/**
 * @description Verifie et decode un jeton JWT.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param token Jeton JWT recu.
 * @returns Payload decode.
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (err) {
    const isExpired = err instanceof jwt.TokenExpiredError;
    const message = isExpired ? "Token expire" : "Token invalide";
    throw new Error(message);
  }
};

/**
 * @description Calcule les offsets de pagination pour les requetes de base de donnees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param page Numero de page indexee a partir de 1.
 * @param limit Nombre maximal d'elements par page.
 * @returns Objet {@link PaginationResult}.
 */
export const calculatePagination = (
  page: number = 1,
  limit: number = 10,
): PaginationResult => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit));
  return {
    skip: (validPage - 1) * validLimit,
    take: validLimit,
  };
};

/**
 * @description Parse un nombre a partir d'une chaine ou retourne une valeur de repli par defaut.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param value Chaine de caracteres source ou undefined.
 * @param defaultValue Valeur numerique de secours.
 * @returns Nombre entier ou decimal valide.
 */
export const parseNumber = (
  value: string | undefined,
  defaultValue: number,
): number => {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/**
 * @description Verifie la validite syntaxique d'une adresse de messagerie electronique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param email Adresse email a evaluer.
 * @returns Booleen indiquant la conformite.
 */
export const isValidEmail = (email: string): boolean => {
  return typeof email === "string" && EMAIL_REGEX.test(email);
};

/**
 * @description Formate une date en chaine ISO standard UTC.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param date Date source ou horodatage.
 * @returns Chaine formattee ISO 8601.
 */
export const formatDateToIso = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
};

/**
 * @description Supprime les proprietes sensibles d'une entite utilisateur pour restitution publique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param user Entite utilisateur brute.
 * @returns Objet assaini conforme a {@link SanitizedUser}.
 */
export const sanitizeUser = (user: User): SanitizedUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: formatDateToIso(user.createdAt),
  updatedAt: formatDateToIso(user.updatedAt),
});
