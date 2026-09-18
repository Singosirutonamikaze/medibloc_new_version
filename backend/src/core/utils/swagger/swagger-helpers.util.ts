/**
 * @file swagger-helpers.util.ts
 * @description Utilitaires fonctionnels pour la generation des fragments de documentation OpenAPI / Swagger.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @description Genere le bloc OpenAPI pour un endpoint de liste paginee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceName Nom de la ressource au pluriel.
 * @param resourceExample Exemple d'objet JSON.
 * @returns Chaine formattee OpenAPI.
 */
export const generatePaginatedListDoc = (
  resourceName: string,
  resourceExample: object
): string => `
 *   get:
 *     summary: Recuperer la liste des ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'elements par page
 *     responses:
 *       200:
 *         description: Liste des ${resourceName}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     example: ${JSON.stringify(resourceExample)}
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
`;

/**
 * @description Genere le bloc OpenAPI pour un endpoint de creation d'entite.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceName Nom de la ressource au singulier.
 * @param requestBodySchema Schema JSON de la charge utile.
 * @returns Chaine formattee OpenAPI.
 */
export const generateCreateDoc = (
  resourceName: string,
  requestBodySchema: object
): string => `
 *   post:
 *     summary: Creer un nouveau ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example: ${JSON.stringify(requestBodySchema)}
 *     responses:
 *       201:
 *         description: ${resourceName} cree avec succes
 *       400:
 *         description: Donnees de requete invalides
`;

/**
 * @description Genere le bloc OpenAPI pour un endpoint de recuperation par identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceName Nom de la ressource.
 * @param resourceExample Exemple d'objet.
 * @returns Chaine formattee OpenAPI.
 */
export const generateGetByIdDoc = (
  resourceName: string,
  resourceExample: object
): string => `
 *   get:
 *     summary: Recuperer un ${resourceName} par son identifiant
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique
 *     responses:
 *       200:
 *         description: Detail du ${resourceName}
 *         content:
 *           application/json:
 *             schema:
 *               example: ${JSON.stringify(resourceExample)}
 *       404:
 *         description: ${resourceName} introuvable
`;

/**
 * @description Genere le bloc OpenAPI pour un endpoint de mise a jour d'entite.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceName Nom de la ressource.
 * @param updateBodySchema Schema JSON des modifications.
 * @returns Chaine formattee OpenAPI.
 */
export const generateUpdateDoc = (
  resourceName: string,
  updateBodySchema: object
): string => `
 *   put:
 *     summary: Mettre a jour un ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example: ${JSON.stringify(updateBodySchema)}
 *     responses:
 *       200:
 *         description: ${resourceName} mis a jour avec succes
 *       404:
 *         description: ${resourceName} introuvable
`;

/**
 * @description Genere le bloc OpenAPI pour un endpoint de suppression.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param resourceName Nom de la ressource.
 * @returns Chaine formattee OpenAPI.
 */
export const generateDeleteDoc = (resourceName: string): string => `
 *   delete:
 *     summary: Supprimer un ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique
 *     responses:
 *       200:
 *         description: ${resourceName} supprime avec succes
 *       404:
 *         description: ${resourceName} introuvable
`;
