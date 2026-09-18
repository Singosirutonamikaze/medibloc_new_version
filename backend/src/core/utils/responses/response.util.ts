/**
 * @file response.util.ts
 * @description Standardisation des structures de reponses JSON pour l'ensemble de l'API REST MediBloc.
 * Garantit un contrat uniforme pour les retours de succes et les retours d'erreurs metier.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Response } from "express";

/**
 * @interface ApiResponse
 * @description Structure standardisee d'une reponse HTTP JSON emise par les controleurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property success Booleen indiquant la reussite ou l'echec de l'operation.
 * @property data Contenu de la reponse en cas de succes.
 * @property message Message informatif ou descriptif destine au client.
 * @property errors Tableau des erreurs de validation ou de traitement.
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly errors?: string[];
}

/**
 * @description Envoie une reponse JSON de succes avec code HTTP configure.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param res Objet de reponse Express.
 * @param data Charge utile de donnees a retourner.
 * @param message Message informatif associe.
 * @param statusCode Code de statut HTTP (valeur par defaut {@code 200}).
 * @returns Reponse Express formattee.
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = "Operation effectuee avec succes",
  statusCode: number = 200,
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * @description Envoie une reponse JSON d'erreur avec code HTTP specifie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param res Objet de reponse Express.
 * @param message Description textuelle de l'anomalie constatee.
 * @param statusCode Code de statut HTTP d'erreur (valeur par defaut {@code 400}).
 * @param errors Liste optionnelle des details d'erreurs.
 * @returns Reponse Express formattee.
 */
export const errorResponse = (
  res: Response,
  message: string = "Une erreur est survenue lors du traitement",
  statusCode: number = 400,
  errors: string[] = [],
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
