"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
/**
 * GenericController provides CRUD handlers for a repository following the
 * Repository interface above. Each handler uses a single return statement
 * and avoids use of `any`.
 */
class GenericController {
    constructor(repository) {
        /** GET / - list with pagination */
        this.getAll = async (req, res) => {
            let status = 200;
            let response = {
                success: true,
                data: [],
            };
            try {
                const page = (0, helpers_1.parseNumber)(req.query.page ?? undefined, 1);
                const limit = (0, helpers_1.parseNumber)(req.query.limit ?? undefined, 10);
                const { skip, take } = (0, helpers_1.calculatePagination)(page, limit);
                const [items, total] = await Promise.all([
                    this.repo.findMany({ skip, take }),
                    // If repo provides count(), use it; otherwise infer from returned length
                    this.repo.count
                        ? this.repo.count({})
                        : Promise.resolve((await this.repo.findMany({})).length),
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
                };
                response = { success: true, data: paginated };
            }
            catch (err) {
                status = 500;
                response = {
                    success: false,
                    error: err instanceof Error ? err.message : "Erreur interne",
                };
            }
            return res.status(status).json(response);
        };
        /** GET /:id - get one resource by id */
        this.getOne = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = (0, helpers_1.parseNumber)(req.params.id, NaN);
                if (Number.isNaN(id) || id <= 0) {
                    status = 400;
                    response = { success: false, error: "Identifiant invalide" };
                }
                else {
                    const item = await this.repo.findUnique({ where: { id } });
                    if (!item) {
                        status = 404;
                        response = { success: false, error: "Ressource non trouvée" };
                    }
                    else {
                        response = { success: true, data: item };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = {
                    success: false,
                    error: err instanceof Error ? err.message : "Erreur interne",
                };
            }
            return res.status(status).json(response);
        };
        /** POST / - create resource */
        this.create = async (req, res) => {
            let status = 201;
            let response = { success: true, data: null };
            try {
                const payload = req.body;
                const created = await this.repo.create({ data: payload });
                response = { success: true, data: created, message: "Créé" };
            }
            catch (err) {
                status = 500;
                response = {
                    success: false,
                    error: err instanceof Error ? err.message : "Erreur interne",
                };
            }
            return res.status(status).json(response);
        };
        /** PUT /:id - update resource */
        this.update = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = (0, helpers_1.parseNumber)(req.params.id, NaN);
                if (Number.isNaN(id) || id <= 0) {
                    status = 400;
                    response = { success: false, error: "Identifiant invalide" };
                }
                else {
                    const payload = req.body;
                    const updated = await this.repo.update({
                        where: { id },
                        data: payload,
                    });
                    if (!updated) {
                        status = 404;
                        response = { success: false, error: "Ressource non trouvée" };
                    }
                    else {
                        response = { success: true, data: updated, message: "Mis à jour" };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = {
                    success: false,
                    error: err instanceof Error ? err.message : "Erreur interne",
                };
            }
            return res.status(status).json(response);
        };
        /** DELETE /:id - delete resource */
        this.delete = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = (0, helpers_1.parseNumber)(req.params.id, NaN);
                if (Number.isNaN(id) || id <= 0) {
                    status = 400;
                    response = { success: false, error: "Identifiant invalide" };
                }
                else {
                    const deleted = await this.repo.delete({ where: { id } });
                    if (!deleted) {
                        status = 404;
                        response = { success: false, error: "Ressource non trouvée" };
                    }
                    else {
                        response = { success: true, message: "Supprimé" };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = {
                    success: false,
                    error: err instanceof Error ? err.message : "Erreur interne",
                };
            }
            return res.status(status).json(response);
        };
        this.repo = repository;
    }
}
exports.default = GenericController;
