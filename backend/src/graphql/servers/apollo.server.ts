/**
 * @file apollo.server.ts
 * @description Configuration et initialisation du serveur Apollo GraphQL avec Express.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ApolloServer, HeaderMap, HTTPGraphQLRequest } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { Request, Response, NextFunction } from "express";
import { typeDefs } from "../schemas/index.schema";
import { resolvers } from "../resolvers/index.resolver";
import { verifyToken } from "../../core/utils/helpers/helpers.util";
import { JwtPayload } from "../../core/types/global/global.types";

/**
 * @interface GraphQLContext
 * @description Contexte d'execution partage transmis a l'ensemble des resolveurs GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property user Payload de l'utilisateur authentifie extrait du token JWT ou indefini.
 */
export interface GraphQLContext {
  readonly user: JwtPayload | undefined;
}

/**
 * @description Instancie et configure le serveur Apollo avec les schemas et resolveurs agreges.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Instance configuree du serveur Apollo {@link ApolloServer}.
 */
export const createApolloServer = (): ApolloServer<GraphQLContext> => {
  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: true,
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
  });
};

/**
 * @description Extrait et verifie le jeton Bearer JWT pour injecter le profil utilisateur dans le contexte.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express d'origine.
 * @returns Payload utilisateur decode ou indefini.
 */
const resolveContextUser = (req: Request): JwtPayload | undefined => {
  const authHeader = (req.headers.authorization || req.headers.Authorization || "") as string;
  const isBearer = authHeader.startsWith("Bearer ");
  const token = isBearer ? authHeader.substring(7).trim() : "";
  const hasToken = token.length > 0;

  const tokenHandlers: Record<string, () => JwtPayload | undefined> = {
    valid: () => {
      try {
        return verifyToken(token);
      } catch {
        return undefined;
      }
    },
    missing: () => undefined,
  };

  const statusKey = hasToken ? "valid" : "missing";
  return tokenHandlers[statusKey]();
};

/**
 * @description Construit le contexte asynchrone pour chaque requete GraphQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param contextParam Parametres contenant la requete Express.
 * @returns Promesse du contexte {@link GraphQLContext}.
 */
export const buildGraphQLContext = async ({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> => {
  return {
    user: resolveContextUser(req),
  };
};

/**
 * @description Convertit les en-tetes Express en HeaderMap d'Apollo.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param headers En-tetes de la requete Express.
 * @returns Instance de {@link HeaderMap}.
 */
const createHeaderMap = (headers: Request["headers"]): HeaderMap => {
  const headerMap = new HeaderMap();
  Object.entries(headers).forEach(([key, value]) => {
    const isString = typeof value === "string";
    const isArray = Array.isArray(value);

    const formatters: Record<string, () => void> = {
      string: () => headerMap.set(key.toLowerCase(), value as string),
      array: () => headerMap.set(key.toLowerCase(), (value as string[]).join(", ")),
      none: () => undefined,
    };

    const typeRules: readonly [boolean, string][] = [
      [isString, "string"],
      [isArray, "array"],
    ];

    const matchedRule = typeRules.find(([isMatch]) => isMatch);
    const typeKey =
      matchedRule !== undefined ? (matchedRule as [boolean, string])[1] : "none";

    formatters[typeKey]();
  });
  return headerMap;
};

/**
 * @description Analyse et normalise le corps de la requete pour Apollo Server.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param body Corps de requete brut ou parse.
 * @returns Objet record parse ou corps initial.
 */
const parseRequestBody = (body: unknown): unknown => {
  const isString = typeof body === "string";
  const isObject = typeof body === "object" && body !== null;

  const parseString = (str: string): unknown => {
    const trimmed = str.trim();
    const isJson = trimmed.startsWith("{") || trimmed.startsWith("[");
    const stringParsers: Record<string, () => unknown> = {
      true: () => {
        try {
          return JSON.parse(trimmed);
        } catch {
          return { query: trimmed };
        }
      },
      false: () => ({ query: trimmed }),
    };
    return stringParsers[String(isJson)]();
  };

  const bodyHandlers: Record<string, () => unknown> = {
    string: () => parseString(body as string),
    object: () => body,
    none: () => undefined,
  };

  const bodyRules: readonly [boolean, string][] = [
    [isString, "string"],
    [isObject, "object"],
  ];
  const matchedRule = bodyRules.find(([isMatch]) => isMatch);
  const key = matchedRule !== undefined ? matchedRule[1] : "none";
  return bodyHandlers[key]();
};

let startServerPromise: Promise<void> | null = null;

/**
 * @description Garantit que le serveur Apollo est demarre de maniere idempotente.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param server Instance du serveur Apollo.
 * @returns Promesse d'initialisation resolue.
 */
const ensureApolloStarted = (server: ApolloServer<GraphQLContext>): Promise<void> => {
  const isStarted = startServerPromise !== null;
  const startHandlers: Record<string, () => Promise<void>> = {
    true: () => startServerPromise as Promise<void>,
    false: () => {
      startServerPromise = server.start().catch((err: Error) => {
        const isAlreadyStarted = err.message.includes("You should only call 'start()'");
        const errorHandlers: Record<string, () => void> = {
          true: () => undefined,
          false: () => {
            console.error("Erreur d'initialisation Apollo :", err);
            throw err;
          },
        };
        errorHandlers[String(isAlreadyStarted)]();
      });
      return startServerPromise;
    },
  };
  return startHandlers[String(isStarted)]();
};

/**
 * @description Cree un middleware Express pour executer les requetes GraphQL vers le serveur Apollo.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param server Instance du serveur Apollo.
 * @returns Middleware Express asynchrone.
 */
export const createGraphQLMiddleware = (
  server: ApolloServer<GraphQLContext>
) => {
  return async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      await ensureApolloStarted(server);

      const hasQueryString = req.url.includes("?");
      const searchExtractors: Record<string, () => string> = {
        true: () => `?${req.url.split("?")[1]}`,
        false: () => "",
      };
      const search = searchExtractors[String(hasQueryString)]();

      const httpGraphQLRequest: HTTPGraphQLRequest = {
        method: req.method,
        headers: createHeaderMap(req.headers),
        search,
        body: parseRequestBody(req.body),
      };

      const response = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest,
        context: async () => buildGraphQLContext({ req }),
      });

      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      res.status(response.status || 200);

      const isComplete = response.body.kind === "complete";
      const bodyHandlers: Record<string, () => void> = {
        complete: () => {
          const completeBody = response.body as {
            kind: "complete";
            string: string;
          };
          res.end(completeBody.string);
        },
        chunked: () => {
          res.end();
        },
      };

      const kindKey = isComplete ? "complete" : "chunked";
      bodyHandlers[kindKey]();
    } catch (err) {
      console.error("Erreur d'execution GraphQL :", err);
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.status(500).json({
        errors: [
          {
            message:
              err instanceof Error ? err.message : "Erreur interne GraphQL",
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      });
    }
  };
};
