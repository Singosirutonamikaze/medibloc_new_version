/**
 * @file database-lifecycle.config.ts
 * @description Gestionnaire du cycle de vie des connexions a la base de donnees PostgreSQL.
 * Fournit les fonctions d'initialisation, de fermeture propre et de sondage d'etat (health check).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { prisma } from "./database.config";

/**
 * @description Initialise et verifie la connexion active avec la base de donnees.
 * En cas d'indisponibilite critique, arrete le processus avec le code {@code 1}.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Promesse resolue des que la commande de verification SQL est executee.
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connexion a la base de donnees etablie avec succes.");
  } catch (err) {
    const error = err as Error;
    console.error("Echec de la connexion a la base de donnees:", error.message);
    process.exit(1);
  }
};

/**
 * @description Clot de maniere gracieuse la connexion au pool PostgreSQL lors de l'arret du serveur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Promesse resolue apres liberation complete des sockets.
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("Deconnexion de la base de donnees effectuee.");
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la deconnexion de la base de donnees:", error.message);
  }
};

/**
 * @description Verifie la disponibilite instantanee de la base de donnees pour les sondes d'infrastructure.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns {@code true} si la base repond positivement a la requete {@code SELECT 1}, sinon {@code false}.
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};
