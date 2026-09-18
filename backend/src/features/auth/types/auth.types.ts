/**
 * @file auth.types.ts
 * @description Alias et re-exports de types pour le module d'authentification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export type {
  SafeUser,
  AuthResult,
  TokenPayload,
} from "../interfaces/auth.interface";
export type { RegisterDto, LoginDto } from "../dtos/auth.dto";
