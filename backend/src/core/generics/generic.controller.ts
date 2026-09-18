/**
 * @file generic.controller.ts
 * @description Controleur CRUD generique pour la reutilisation standardisee des endpoints REST.
 * Reecrit selon le paradigme declaratif strict sans structures conditionnelles directes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  successResponse,
  errorResponse,
} from "../utils/responses/response.util";
import { parseIdParam } from "../utils/parsers/parseIdParam.util";
import {
  calculatePagination,
  parseNumber,
} from "../utils/helpers/helpers.util";
import { PaginatedResponse } from "../types/global/global.types";

/**
 * @interface GenericRepository
 * @description Contrat d'acces aux donnees requis par le controleur generique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property findMany Methode de recuperation paginee d'entites.
 * @property findUnique Methode de recherche par identifiant unique.
 * @property create Methode d'insertion d'entite.
 * @property update Methode de mise a jour d'entite.
 * @property delete Methode de suppression d'entite.
 * @property count Methode de comptage total.
 */
export interface GenericRepository<T, CreateDto, UpdateDto> {
  findMany(params?: {
    where?: Record<string, string | number | boolean | null>;
    skip?: number;
    take?: number;
    include?: Record<string, boolean>;
  }): Promise<T[]>;
  findUnique(params: {
    where: { id: number };
    include?: Record<string, boolean>;
  }): Promise<T | null>;
  create(params: {
    data: CreateDto;
    include?: Record<string, boolean>;
  }): Promise<T>;
  update(params: {
    where: { id: number };
    data: UpdateDto;
    include?: Record<string, boolean>;
  }): Promise<T | null>;
  delete(params: { where: { id: number } }): Promise<T | null>;
  count?(params?: {
    where?: Record<string, string | number | boolean | null>;
  }): Promise<number>;
}

/**
 * @class GenericController
 * @description Controleur CRUD abstrait fournissant les methodes de point d'entree Express.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export default class GenericController<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
> {
  private readonly repo: GenericRepository<T, CreateDto, UpdateDto>;

  constructor(repository: GenericRepository<T, CreateDto, UpdateDto>) {
    this.repo = repository;
  }

  /**
   * @description Recupere une liste paginee d'entites.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   *
   * @param req Requete HTTP Express.
   * @param res Reponse HTTP Express.
   * @returns Promesse de reponse HTTP.
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pageQuery =
        typeof req.query.page === "string" ? req.query.page : "1";
      const limitQuery =
        typeof req.query.limit === "string" ? req.query.limit : "10";
      const page = parseNumber(pageQuery, 1);
      const limit = parseNumber(limitQuery, 10);
      const { skip, take } = calculatePagination(page, limit);

      const countPromise = this.repo.count
        ? this.repo.count({})
        : this.repo.findMany({}).then((items: T[]): number => items.length);

      const [items, total] = await Promise.all([
        this.repo.findMany({ skip, take }),
        countPromise,
      ]);

      const totalPages = Math.ceil(total / limit);
      const paginatedData: PaginatedResponse<T> = {
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };

      return successResponse(
        res,
        paginatedData,
        "Elements recuperes avec succes",
        200,
      );
    } catch (err) {
      const error = err as Error;
      return errorResponse(res, error.message, 500);
    }
  };

  /**
   * @description Recupere une entite specifique par son identifiant.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   *
   * @param req Requete HTTP Express.
   * @param res Reponse HTTP Express.
   * @returns Promesse de reponse HTTP.
   */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseIdParam(req.params.id);
      const isInvalidId = Number.isNaN(id) || id <= 0;

      const handleInvalidId = (): Response =>
        errorResponse(res, "Identifiant invalide", 400);

      const handleValidId = async (): Promise<Response> => {
        const item = await this.repo.findUnique({ where: { id } });
        const exists = Boolean(item);

        const foundActionMap: Record<string, () => Response> = {
          true: () =>
            successResponse(
              res,
              item as T,
              "Element recupere avec succes",
              200,
            ),
          false: () => errorResponse(res, "Element introuvable", 404),
        };

        return foundActionMap[String(exists)]();
      };

      const dispatchMap: Record<string, () => Promise<Response> | Response> = {
        true: handleInvalidId,
        false: handleValidId,
      };

      return await dispatchMap[String(isInvalidId)]();
    } catch (err) {
      const error = err as Error;
      return errorResponse(res, error.message, 500);
    }
  };

  /**
   * @description Cree une nouvelle entite.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   *
   * @param req Requete HTTP Express.
   * @param res Reponse HTTP Express.
   * @returns Promesse de reponse HTTP.
   */
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreateDto = req.body;
      const created = await this.repo.create({ data: dto });
      return successResponse(res, created, "Element cree avec succes", 201);
    } catch (err) {
      const error = err as Error;
      return errorResponse(res, error.message, 400);
    }
  };

  /**
   * @description Met a jour une entite existante.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   *
   * @param req Requete HTTP Express.
   * @param res Reponse HTTP Express.
   * @returns Promesse de reponse HTTP.
   */
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseIdParam(req.params.id);
      const isInvalidId = Number.isNaN(id) || id <= 0;

      const handleInvalidId = (): Response =>
        errorResponse(res, "Identifiant invalide", 400);

      const handleValidId = async (): Promise<Response> => {
        const dto: UpdateDto = req.body;
        const updated = await this.repo.update({ where: { id }, data: dto });
        const exists = Boolean(updated);

        const foundActionMap: Record<string, () => Response> = {
          true: () =>
            successResponse(
              res,
              updated as T,
              "Element mis a jour avec succes",
              200,
            ),
          false: () => errorResponse(res, "Element introuvable", 404),
        };

        return foundActionMap[String(exists)]();
      };

      const dispatchMap: Record<string, () => Promise<Response> | Response> = {
        true: handleInvalidId,
        false: handleValidId,
      };

      return await dispatchMap[String(isInvalidId)]();
    } catch (err) {
      const error = err as Error;
      return errorResponse(res, error.message, 400);
    }
  };

  /**
   * @description Supprime une entite existante.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   *
   * @param req Requete HTTP Express.
   * @param res Reponse HTTP Express.
   * @returns Promesse de reponse HTTP.
   */
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseIdParam(req.params.id);
      const isInvalidId = Number.isNaN(id) || id <= 0;

      const handleInvalidId = (): Response =>
        errorResponse(res, "Identifiant invalide", 400);

      const handleValidId = async (): Promise<Response> => {
        const deleted = await this.repo.delete({ where: { id } });
        const exists = Boolean(deleted);

        const foundActionMap: Record<string, () => Response> = {
          true: () =>
            successResponse(
              res,
              deleted as T,
              "Element supprime avec succes",
              200,
            ),
          false: () => errorResponse(res, "Element introuvable", 404),
        };

        return foundActionMap[String(exists)]();
      };

      const dispatchMap: Record<string, () => Promise<Response> | Response> = {
        true: handleInvalidId,
        false: handleValidId,
      };

      return await dispatchMap[String(isInvalidId)]();
    } catch (err) {
      const error = err as Error;
      return errorResponse(res, error.message, 400);
    }
  };
}
