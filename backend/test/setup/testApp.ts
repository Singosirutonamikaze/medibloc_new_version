import express from "express";

let cachedApp: express.Express | null = null;

/**
 * Crée et configure l'application Express pour les tests
 * Utilise un cache pour éviter de recréer l'app à chaque test
 */
export async function createTestApp(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = express();
  app.use(express.json());

  // Import des routes
  const mod = await import("../../src/routes/index.routes");
  const routes = (mod && (mod as unknown as { default?: express.Router }).default) 
    ?? (mod as unknown as express.Router);
  
  app.use("/api/v1", routes);

  cachedApp = app;
  return app;
}

/**
 * Réinitialise le cache de l'application (utile pour certains tests)
 */
export function resetTestApp(): void {
  cachedApp = null;
}
