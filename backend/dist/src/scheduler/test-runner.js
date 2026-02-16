"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
class TestScheduler {
    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }
    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    async runTests() {
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
        }
        catch (error) {
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
    cleanOldLogs() {
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
    start() {
        console.log('===========================================');
        console.log('Test Scheduler démarré');
        console.log('Schedule: Toutes les 2 heures');
        console.log(`Logs: ${this.logDir}`);
        console.log('===========================================');
        // Exécuter les tests toutes les 2 heures
        node_cron_1.default.schedule('0 */2 * * *', async () => {
            await this.runTests();
        });
        // Exécuter les tests immédiatement au démarrage
        this.runTests();
        console.log('Scheduler en cours d\'exécution...');
        console.log('Prochain run: ', this.getNextRunTime());
    }
    getNextRunTime() {
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
exports.default = TestScheduler;
