/**
 * @file test-runner.ts
 * @description Planificateur automatique d'execution des tests de non-regression pour environnements cloud (Render, Railway).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import cron from "node-cron";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import * as path from "node:path";

const execAsync = promisify(exec);

/**
 * @interface ExecResult
 * @description Resultat standard d'une execution de commande processus fils.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property stdout Sortie standard du processus.
 * @property stderr Sortie d'erreur standard du processus.
 */
interface ExecResult {
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * @interface ExecError
 * @description Structure d'exception d'un processus fils en echec.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property message Message d'erreur detaille.
 * @property stdout Flux standard eventuel avant interruption.
 * @property stderr Flux d'erreur genere par la commande.
 */
interface ExecError {
  readonly message: string;
  readonly stdout: string;
  readonly stderr: string;
}

const logDir = path.join(process.cwd(), "logs");

/**
 * @description S'assure de la presence du repertoire de stockage des journaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
const ensureLogDirectory = (): void => {
  const exists = fs.existsSync(logDir);
  const dirHandlers: Record<string, () => void> = {
    true: () => undefined,
    false: () => fs.mkdirSync(logDir, { recursive: true }),
  };
  dirHandlers[String(exists)]();
};

/**
 * @description Construit le contenu formatte du rapport de test en cas de succes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param stdout Sortie standard des tests.
 * @param stderr Sortie d'erreur standard.
 * @param timestamp Horodatage ISO d'execution.
 * @returns Rapport formatte.
 */
const formatSuccessReport = (
  stdout: string,
  stderr: string,
  timestamp: string
): string => {
  return [
    "===========================================",
    `Tests automatiques - ${timestamp}`,
    "===========================================",
    "",
    "STDOUT:",
    stdout,
    "",
    "STDERR:",
    stderr,
    "",
    "===========================================",
    "Tests termines avec succes",
    "===========================================",
  ].join("\n");
};

/**
 * @description Construit le contenu formatte du rapport de test en cas d'echec.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param error Objet d'erreur capture.
 * @param timestamp Horodatage ISO d'execution.
 * @returns Rapport d'erreur formatte.
 */
const formatErrorReport = (error: ExecError, timestamp: string): string => {
  return [
    "===========================================",
    `Tests automatiques - ${timestamp}`,
    "===========================================",
    "",
    "ERREUR:",
    error.message,
    "",
    "STDOUT:",
    error.stdout,
    "",
    "STDERR:",
    error.stderr,
    "",
    "===========================================",
    "Tests termines avec des erreurs",
    "===========================================",
  ].join("\n");
};

/**
 * @description Met a jour le lien symbolique vers le dernier rapport de test genere.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param logFile Chemin absolu du fichier journal cree.
 */
const updateLatestSymlink = (logFile: string): void => {
  const latestLink = path.join(logDir, "latest-test.log");
  const exists = fs.existsSync(latestLink);
  const linkHandlers: Record<string, () => void> = {
    true: () => fs.unlinkSync(latestLink),
    false: () => undefined,
  };
  linkHandlers[String(exists)]();
  fs.symlinkSync(path.basename(logFile), latestLink);
};

/**
 * @description Supprime les fichiers journaux anterieurs au seuil de conservation (30 jours).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
const cleanOldLogs = (): void => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const files = fs.readdirSync(logDir);

  files
    .filter((file) => file.startsWith("test-") && file.endsWith(".log"))
    .forEach((file) => {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      const isOutdated = stats.mtimeMs < thirtyDaysAgo;

      const deleteHandlers: Record<string, () => void> = {
        true: () => {
          fs.unlinkSync(filePath);
          console.log(`Ancien log supprime : ${file}`);
        },
        false: () => undefined,
      };

      deleteHandlers[String(isOutdated)]();
    });
};

/**
 * @description Execute la suite de tests unitaires et persiste le rapport dans les journaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const runTests = async (): Promise<void> => {
  ensureLogDirectory();
  const rawTimestamp = new Date().toISOString();
  const fileTimestamp = rawTimestamp.replaceAll(/[:.]/g, "-");
  const logFile = path.join(logDir, `test-${fileTimestamp}.log`);

  console.log(`[${rawTimestamp}] Demarrage de la suite de tests...`);

  try {
    const result = (await execAsync("npm run test:run", {
      cwd: process.cwd(),
      env: process.env,
    })) as ExecResult;

    const report = formatSuccessReport(
      result.stdout,
      result.stderr,
      rawTimestamp
    );
    fs.writeFileSync(logFile, report);
    console.log(`[${rawTimestamp}] Tests termines avec succes`);
    console.log(`Logs sauvegardes dans : ${logFile}`);

    updateLatestSymlink(logFile);
  } catch (err) {
    const rawError = err as {
      message?: string;
      stdout?: string;
      stderr?: string;
    };
    const execError: ExecError = {
      message: rawError.message || "Echec d'execution des tests",
      stdout: rawError.stdout || "",
      stderr: rawError.stderr || "",
    };

    const report = formatErrorReport(execError, rawTimestamp);
    fs.writeFileSync(logFile, report);
    console.error(`[${rawTimestamp}] Echec de la suite de tests :`);
    console.error(execError.message);
  }

  cleanOldLogs();
};

/**
 * @description Calcule l'horodatage previsible de la prochaine iteration du planificateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Chaine formattee ISO 8601.
 */
export const getNextRunTime = (): string => {
  const now = new Date();
  const nextRun = new Date(now);
  nextRun.setHours(Math.ceil(now.getHours() / 2) * 2, 0, 0, 0);

  const isPastOrPresent = nextRun.getTime() <= now.getTime();
  const timeAdjusters: Record<string, () => void> = {
    true: () => {
      nextRun.setHours(nextRun.getHours() + 2);
    },
    false: () => undefined,
  };
  timeAdjusters[String(isPastOrPresent)]();

  return nextRun.toISOString();
};

/**
 * @description Demarre la planification periodique de la suite de tests (toutes les 2 heures).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const startScheduler = (): void => {
  console.log("===========================================");
  console.log("Test Scheduler demarre");
  console.log("Planification : Toutes les 2 heures");
  console.log(`Dossier de logs : ${logDir}`);
  console.log("===========================================");

  cron.schedule("0 */2 * * *", async () => {
    await runTests();
  });

  runTests();

  console.log("Planificateur en cours d'execution...");
  console.log("Prochaine execution : ", getNextRunTime());
};

const isDirectExecution = require.main === module;
const launchHandlers: Record<string, () => void> = {
  true: () => {
    startScheduler();

    process.on("SIGTERM", () => {
      console.log("SIGTERM recu, arret propre du planificateur...");
      process.exit(0);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT recu, arret propre du planificateur...");
      process.exit(0);
    });
  },
  false: () => undefined,
};

launchHandlers[String(isDirectExecution)]();

export default {
  start: startScheduler,
  runTests,
  getNextRunTime,
};
