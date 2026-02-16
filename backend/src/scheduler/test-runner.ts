/**
 * Test Runner pour environnements cloud (Render, Railway, etc.)
 * Alternative à cron/systemd pour les plateformes PaaS
 * 
 * Installation: npm install node-cron
 * 
 * Pour l'utiliser sur Render:
 * 1. Ajoutez "node-cron" aux dependencies dans package.json
 * 2. Créez un nouveau "Background Worker" sur Render
 * 3. Commande de démarrage: node dist/scheduler/test-runner.js
 */

import cron from 'node-cron';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';

const execAsync = promisify(exec);

class TestScheduler {
  private readonly logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private async runTests(): Promise<void> {
    const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
    const logFile = path.join(this.logDir, `test-${timestamp}.log`);

    console.log(`[${new Date().toISOString()}] Démarrage des tests...`);

    try {
      const { stdout, stderr } = await execAsync('npm run test:run', {
        cwd: process.cwd(),
        env: process.env,
      });

      const logContent = [
        '===========================================',
        `Tests automatiques - ${new Date().toISOString()}`,
        '===========================================',
        '',
        'STDOUT:',
        stdout,
        '',
        'STDERR:',
        stderr,
        '',
        '===========================================',
        'Tests terminés avec succès',
        '===========================================',
      ].join('\n');

      fs.writeFileSync(logFile, logContent);
      console.log(`[${new Date().toISOString()}] Tests terminés avec succès`);
      console.log(`Logs sauvegardés dans: ${logFile}`);

      // Créer un lien symbolique vers le dernier log
      const latestLink = path.join(this.logDir, 'latest-test.log');
      if (fs.existsSync(latestLink)) {
        fs.unlinkSync(latestLink);
      }
      fs.symlinkSync(path.basename(logFile), latestLink);

    } catch (error: any) {
      const errorContent = [
        '===========================================',
        `Tests automatiques - ${new Date().toISOString()}`,
        '===========================================',
        '',
        'ERREUR:',
        error.message,
        '',
        'STDOUT:',
        error.stdout || '',
        '',
        'STDERR:',
        error.stderr || '',
        '',
        '===========================================',
        'Tests terminés avec des erreurs',
        '===========================================',
      ].join('\n');

      fs.writeFileSync(logFile, errorContent);
      console.error(`[${new Date().toISOString()}] Les tests ont échoué`);
      console.error(error.message);
    }

    // Nettoyer les anciens logs (garder les 30 derniers jours)
    this.cleanOldLogs();
  }

  private cleanOldLogs(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    fs.readdirSync(this.logDir).forEach((file) => {
      if (file.startsWith('test-') && file.endsWith('.log')) {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtimeMs < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`Ancien log supprimé: ${file}`);
        }
      }
    });
  }

  public start(): void {
    console.log('===========================================');
    console.log('Test Scheduler démarré');
    console.log('Schedule: Toutes les 2 heures');
    console.log(`Logs: ${this.logDir}`);
    console.log('===========================================');

    // Exécuter les tests toutes les 2 heures
    cron.schedule('0 */2 * * *', async () => {
      await this.runTests();
    });

    // Exécuter les tests immédiatement au démarrage
    this.runTests();

    console.log('Scheduler en cours d\'exécution...');
    console.log('Prochain run: ', this.getNextRunTime());
  }

  private getNextRunTime(): string {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(Math.ceil(now.getHours() / 2) * 2, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setHours(nextRun.getHours() + 2);
    }

    return nextRun.toISOString();
  }
}

// Démarrer le scheduler si ce fichier est exécuté directement
if (require.main === module) {
  const scheduler = new TestScheduler();
  scheduler.start();

  // Gérer les signaux pour un arrêt propre
  process.on('SIGTERM', () => {
    console.log('SIGTERM reçu, arrêt du scheduler...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT reçu, arrêt du scheduler...');
    process.exit(0);
  });
}

export default TestScheduler;
