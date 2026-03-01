/**
 * Utilitaires pour générer les documentations OpenAPI communes
 * Réduit la duplication de code dans les définitions de routes
 */

export const generatePaginatedListDoc = (resourceName: string, resourceExample: any) => `
 *   get:
 *     summary: Récupérer la liste des ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
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

export const generateCreateDoc = (resourceName: string, requestBodySchema: any) => `
 *   post:
 *     summary: Créer un nouveau ${resourceName}
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
 *         description: ${resourceName} créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
`;

export const generateGetByIdDoc = (resourceName: string) => `
 *   get:
 *     summary: Récupérer un ${resourceName} par ID
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ${resourceName} trouvé
 *       404:
 *         description: ${resourceName} non trouvé
 *       500:
 *         description: Erreur serveur
`;

export const generateUpdateDoc = (resourceName: string) => `
 *   put:
 *     summary: Mettre à jour un ${resourceName}
 *     tags:
 *       - ${resourceName}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: ${resourceName} mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: ${resourceName} non trouvé
 *       500:
 *         description: Erreur serveur
`;

export const generateDeleteDoc = (resourceName: string) => `
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
 *     responses:
 *       200:
 *         description: ${resourceName} supprimé avec succès
 *       404:
 *         description: ${resourceName} non trouvé
 *       500:
 *         description: Erreur serveur
`;

/**
 * Génère les réponses standard d'erreur OpenAPI
 */
export const STANDARD_ERROR_RESPONSES = {
  badRequest: {
    400: {
      description: "Requête invalide",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Données invalides" }
            }
          }
        }
      }
    }
  },
  unauthorized: {
    401: {
      description: "Non authentifié",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Token invalide" }
            }
          }
        }
      }
    }
  },
  forbidden: {
    403: {
      description: "Accès refusé",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Permissions insuffisantes" }
            }
          }
        }
      }
    }
  },
  notFound: {
    404: {
      description: "Ressource non trouvée",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Ressource non trouvée" }
            }
          }
        }
      }
    }
  },
  serverError: {
    500: {
      description: "Erreur serveur",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Erreur interne du serveur" }
            }
          }
        }
      }
    }
  }
};

/**
 * Schémas réutilisables
 */
export const COMMON_SCHEMAS = {
  pagination: {
    type: "object",
    properties: {
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 10 },
      total: { type: "integer", example: 45 },
      totalPages: { type: "integer", example: 5 }
    }
  },
  apiResponse: (dataSchema: any) => ({
    type: "object",
    properties: {
      success: { type: "boolean" },
      data: dataSchema,
      message: { type: "string" }
    }
  }),
  paginatedResponse: (itemSchema: any) => ({
    type: "object",
    properties: {
      success: { type: "boolean" },
      data: { type: "array", items: itemSchema },
      pagination: COMMON_SCHEMAS.pagination
    }
  })
};

/**
 * Tags OpenAPI standards
 */
export const OPENAPI_TAGS = [
  { name: "Auth", description: "Authentification et gestion des utilisateurs" },
  { name: "Patients", description: "Gestion des patients" },
  { name: "Doctors", description: "Gestion des médecins" },
  { name: "Appointments", description: "Gestion des rendez-vous" },
  { name: "Prescriptions", description: "Gestion des ordonnances" },
  { name: "Medicines", description: "Gestion des médicaments" },
  { name: "Pharmacies", description: "Gestion des pharmacies" },
  { name: "Medical Records", description: "Gestion des dossiers médicaux" },
  { name: "Diseases", description: "Gestion des maladies" },
  { name: "Symptoms", description: "Gestion des symptômes" },
  { name: "Stats", description: "Statistiques et rapports" }
];
