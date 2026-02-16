/**
 * Repository<T, CreateDto, UpdateDto>
 *
 * A minimal, strongly-typed repository contract that the GenericController
 * expects. It is intentionally narrow to stay ORM-agnostic while matching
 * common patterns found in clients like Prisma.
 *
 * @template T - Entity type returned by the repository.
 * @template CreateDto - Shape of the data used to create a new entity.
 * @template UpdateDto - Shape of the data used to update an existing entity.
 *
 * @remarks
 * - Implementations should return entity instances (or null for not found)
 *   and respect the optional `include` argument to load relations when needed.
 * - The `count` method is optional: when absent, the controller may infer
 *   total counts from non-paginated findMany results. If provided, it should
 *   return the total number of records matching the provided `where`.
 */

/**
 * GenericController<T, CreateDto, UpdateDto>
 *
 * Provides a set of reusable Express request handlers implementing common
 * CRUD operations for any repository conforming to the `Repository` interface.
 * Handlers perform basic validation, consistent response shaping and error
 * handling, and a simple pagination strategy for list queries.
 *
 * @template T - Entity type handled by the controller.
 * @template CreateDto - DTO/type used when creating an entity.
 * @template UpdateDto - DTO/type used when updating an entity.
 *
 * @remarks
 * - All handlers return an Express `Response` with a consistent `ApiResponse` shape.
 * - Numeric id parsing uses `parseNumber` and rejects invalid or non-positive ids
 *   with HTTP 400.
 * - Errors thrown by the repository are caught and returned as HTTP 500 with a
 *   safe message when the error is not an `Error` instance.
 * - The `getAll` handler supports optional `page` and `limit` query params and
 *   will use the repository's `count` method if available to compute total pages.
 * - The class is constructed with a concrete repository instance that implements
 *   the `Repository` interface; this keeps the controller generic and easily testable.
 *
 * @example
 * // Example of wiring a controller for a `User` repository (pseudo-code)
 * // const userController = new GenericController<User, CreateUserDto, UpdateUserDto>(userRepo);
 * // router.get('/users', userController.getAll);
 * // router.get('/users/:id', userController.getOne);
 * // router.post('/users', userController.create);
 * // router.put('/users/:id', userController.update);
 * // router.delete('/users/:id', userController.delete);
 */

/**
 * getAll
 *
 * Handler for listing resources with optional pagination.
 *
 * Query parameters:
 * - page: positive integer, defaults to 1.
 * - limit: positive integer, defaults to 10.
 *
 * Responses:
 * - 200: success with paginated data (PaginatedResponse<T>).
 * - 500: internal server error with error message.
 *
 * @returns Promise<Response> - JSON response containing ApiResponse<PaginatedResponse<T> | T[]>.
 */

/**
 * getOne
 *
 * Handler for fetching a single resource by numeric id path parameter.
 *
 * Path parameter:
 * - id: numeric id of the resource
 *
 * Responses:
 * - 200: success with the requested entity.
 * - 400: invalid id provided.
 * - 404: resource not found.
 * - 500: internal server error with error message.
 *
 * @returns Promise<Response> - JSON response containing ApiResponse<T | null>.
 */

/**
 * create
 *
 * Handler for creating a new resource.
 *
 * Body:
 * - payload matching CreateDto
 *
 * Responses:
 * - 201: resource created successfully with created entity returned.
 * - 500: internal server error with error message.
 *
 * @returns Promise<Response> - JSON response containing ApiResponse<T | null>.
 */

/**
 * update
 *
 * Handler for updating an existing resource identified by numeric id.
 *
 * Path parameter:
 * - id: numeric id of the resource to update
 *
 * Body:
 * - payload matching UpdateDto
 *
 * Responses:
 * - 200: update successful, returns updated entity.
 * - 400: invalid id provided.
 * - 404: resource not found.
 * - 500: internal server error with error message.
 *
 * @returns Promise<Response> - JSON response containing ApiResponse<T | null>.
 */

/**
 * delete
 *
 * Handler for deleting an existing resource identified by numeric id.
 *
 * Path parameter:
 * - id: numeric id of the resource to delete
 *
 * Responses:
 * - 200: deletion successful.
 * - 400: invalid id provided.
 * - 404: resource not found.
 * - 500: internal server error with error message.
 *
 * @returns Promise<Response> - JSON response containing ApiResponse<null>.
 */
import { Request, Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types";
import { calculatePagination, parseNumber } from "../utils/helpers";

/**
 * Repository interface that matches common ORM/DB client methods (Prisma-like).
 * Keep it narrow and fully typed so the controller stays generic but safe.
 */
export interface Repository<T, CreateDto, UpdateDto> {
  findMany(params?: {
    where?: Record<string, unknown>;
    skip?: number;
    take?: number;
    include?: Record<string, unknown>;
  }): Promise<T[]>;
  findUnique(params: {
    where: { id: number };
    include?: Record<string, unknown>;
  }): Promise<T | null>;
  create(params: {
    data: CreateDto;
    include?: Record<string, unknown>;
  }): Promise<T>;
  update(params: {
    where: { id: number };
    data: UpdateDto;
    include?: Record<string, unknown>;
  }): Promise<T | null>;
  delete(params: { where: { id: number } }): Promise<T | null>;
  count?(params?: { where?: Record<string, unknown> }): Promise<number>;
}

/**
 * GenericController provides CRUD handlers for a repository following the
 * Repository interface above. Each handler uses a single return statement
 * and avoids use of `any`.
 */
export default class GenericController<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>
> {
  private readonly repo: Repository<T, CreateDto, UpdateDto>;

  constructor(repository: Repository<T, CreateDto, UpdateDto>) {
    this.repo = repository;
  }

  /** GET / - list with pagination */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<PaginatedResponse<T> | T[]> = {
      success: true,
      data: [],
    };

    try {
      const page = parseNumber(req.query.page ?? undefined, 1);
      const limit = parseNumber(req.query.limit ?? undefined, 10);
      const { skip, take } = calculatePagination(page, limit);

      const [items, total] = await Promise.all([
        this.repo.findMany({ skip, take }),
        // If repo provides count(), use it; otherwise infer from returned length
        this.repo.count
          ? this.repo.count({})
          : Promise.resolve<number>((await this.repo.findMany({})).length),
      ]);

      const totalPages = Math.ceil(total / limit);
      // Build a PaginatedResponse<T> and wrap it into ApiResponse
      const paginated = {
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      } as PaginatedResponse<T>;

      response = { success: true, data: paginated } as ApiResponse<
        PaginatedResponse<T>
      >;
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }

    return res.status(status).json(response);
  };

  /** GET /:id - get one resource by id */
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<T | null> = { success: true, data: null };

    try {
      const id = parseNumber(req.params.id, Number.NaN);
      if (Number.isNaN(id) || id <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant invalide" };
      } else {
        const item = await this.repo.findUnique({ where: { id } });
        if (item) {
          response = { success: true, data: item };
        } else {
          status = 404;
          response = { success: false, error: "Ressource non trouvée" };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }

    return res.status(status).json(response);
  };

  /** POST / - create resource */
  public create = async (req: Request, res: Response): Promise<Response> => {
    let status = 201;
    let response: ApiResponse<T | null> = { success: true, data: null };

    try {
      const payload = req.body as CreateDto;
      const created = await this.repo.create({ data: payload });
      response = { success: true, data: created, message: "Créé" };
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }

    return res.status(status).json(response);
  };

  /** PUT /:id - update resource */
  public update = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<T | null> = { success: true, data: null };

    try {
      const id = parseNumber(req.params.id, Number.NaN);
      if (Number.isNaN(id) || id <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant invalide" };
      } else {
        const payload = req.body as UpdateDto;
        const updated = await this.repo.update({
          where: { id },
          data: payload,
        });
        if (updated) {
          response = { success: true, data: updated, message: "Mis à jour" };
        } else {
          status = 404;
          response = { success: false, error: "Ressource non trouvée" };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }

    return res.status(status).json(response);
  };

  /** DELETE /:id - delete resource */
  public delete = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<null> = { success: true, data: null };

    try {
      const id = parseNumber(req.params.id, Number.NaN);
      if (Number.isNaN(id) || id <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant invalide" };
      } else {
        const deleted = await this.repo.delete({ where: { id } });
        if (deleted) {
          response = { success: true, message: "Supprimé" };
        } else {
          status = 404;
          response = { success: false, error: "Ressource non trouvée" };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }

    return res.status(status).json(response);
  };
}
