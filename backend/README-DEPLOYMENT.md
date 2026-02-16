# Guide de mise en ligne du projet

Ce document explique comment mettre votre projet en ligne et comment configurer les tests automatiques.

## Les 3 façons de lancer les tests automatiquement

Selon où vous mettez votre projet en ligne, vous avez 3 options :

1. **GitHub Actions** (la meilleure solution dans tous les cas)
2. **Scripts automatiques** (si vous avez votre propre serveur)
3. **Programmation dans le cloud** (plateformes d'hébergement comme Render)

---

## Mettre en ligne sur Render

### Ce qu'il faut configurer

1. **Configuration du service web**
   - Commande de construction : `npm install && npm run build`
   - Commande de démarrage : `npm start`
   - Version de Node.js : 18 ou plus récent
2. **Variables secrètes à configurer**

   ```txt
   DATABASE_URL=postgresql://...        (adresse de votre base de données)
   JWT_SECRET=your_secret_key          (clé secrète pour la sécurité)
   NODE_ENV=production                 (mode production)
   ```

### Lancer les tests automatiquement sur Render

#### Solution 1 : GitHub Actions (LA MEILLEURE)

Le fichier `.github/workflows/test.yml` fait déjà tout le travail automatiquement :

- Lance les tests chaque fois que vous envoyez du code
- Lance les tests pour chaque proposition de modification (pull request)
- Lance les tests toutes les 2 heures

**Ce que vous devez faire :**

Rien du tout ! Les tests se lancent automatiquement sur GitHub avant même d'envoyer le code sur Render.

#### Solution 2 : Fonction Cron Job de Render

Créer une tâche programmée dans le tableau de bord Render :

```txt
Nom : MediBloc Tests
Commande : npm run test:run
Programmation : 0 */2 * * * (toutes les 2 heures)
Branche : main
```

**Points à savoir :**

- Les résultats ne sont gardés que 7 jours
- Cette option coûte de l'argent en fonction de l'utilisation
- Moins pratique que GitHub Actions

#### Solution 3 : Programme en arrière-plan (non recommandé)

Cette solution utilise `node-cron` mais consomme beaucoup de ressources.
Si vous voulez vraiment l'utiliser, regardez le fichier `src/scheduler/test-runner.ts`.

---

## Mettre en ligne sur votre propre serveur (VPS)

### Ce dont vous avez besoin avant de commencer

- Node.js version 18 ou plus récent installé
- npm (ou yarn si vous préférez)
- PostgreSQL installé et configuré
- Les droits administrateur (sudo) si vous voulez utiliser systemd

### Comment installer le projet

```bash
# Télécharger le projet depuis Git
git clone <adresse-de-votre-repository>
cd medibloc_new_version/backend

# Installer toutes les dépendances
npm install

# Créer le fichier de configuration
cp .env.example .env
# Ouvrir le fichier .env et remplir avec vos informations

# Préparer Prisma pour communiquer avec la base de données
npx prisma generate

# Mettre la base de données à jour
npx prisma migrate deploy

# Compiler le projet
npm run build
```

### Lancer les tests automatiquement sur votre serveur

#### Solution 1 : Systemd (LA MEILLEURE pour un vrai serveur)

```bash
# Lancer le programme d'installation
cd backend
chmod +x scripts/install.sh
./scripts/install.sh

# Choisir l'option 2 (Systemd)
# Suivre les instructions qui s'affichent
```

**Voir si ça marche :**

```bash
# Voir le statut
systemctl status medibloc-test.timer

# Voir toutes les tâches programmées
systemctl list-timers | grep medibloc
```

**Voir les résultats :**

```bash
# Voir les 50 derniers messages système
journalctl -u medibloc-test.service -n 50

# Voir les résultats en direct
tail -f backend/logs/latest-test.log
```

#### Solution 2 : Cron (plus simple mais moins puissant)

```bash
# Ouvrir l'éditeur de tâches programmées
crontab -e

# Ajouter cette ligne (remplacer /chemin/vers/votre/projet par le vrai chemin)
0 */2 * * * cd /chemin/vers/votre/projet/backend && ./scripts/run-tests-periodic.sh
```

**Voir si ça marche :**

```bash
# Voir vos tâches programmées
crontab -l

# Voir les logs de cron
grep CRON /var/log/syslog
```

---

## Mettre en ligne sur les grandes plateformes cloud (AWS, Google Cloud, Azure)

### Comment faire les tests automatiques

La meilleure solution : Combiner GitHub Actions avec les outils de programmation du cloud

#### Amazon Web Services (AWS)

- **GitHub Actions** pour faire tourner votre code
- **EventBridge** pour programmer l'exécution des tests
- **Lambda** pour exécuter la commande `npm run test:run`
- **CloudWatch Logs** pour sauvegarder les résultats

#### Google Cloud Platform (GCP)

- **GitHub Actions** pour faire tourner votre code
- **Cloud Scheduler** pour programmer l'exécution des tests
- **Cloud Run Jobs** pour exécuter les tests
- **Cloud Logging** pour sauvegarder les résultats

#### Microsoft Azure

- **GitHub Actions** pour faire tourner votre code
- **Azure Logic Apps** ou **Timer Triggers** pour programmer les tests
- **Azure Functions** pour exécuter les tests
- **Application Insights** pour sauvegarder les résultats

---

## Comment fonctionne GitHub Actions

Tout est configuré dans le fichier `.github/workflows/test.yml`

### Quand les tests se lancent-ils ?

```yaml
on:
  push:
    branches: [main, develop]     # Quand vous envoyez du code sur ces branches
  pull_request:
    branches: [main, develop]     # Quand quelqu'un propose des modifications
  schedule:
    - cron: '0 */2 * * *'          # Toutes les 2 heures automatiquement
  workflow_dispatch:               # Vous pouvez aussi les lancer manuellement
```

### Sur quelles versions de Node.js les tests sont lancés

Les tests sont lancés sur :

- Node.js version 18
- Node.js version 20

Cela garantit que votre code marche sur plusieurs versions.

### Conservation des résultats

Les résultats des tests sont gardés pendant 30 jours. Vous pouvez les télécharger depuis l'onglet "Actions" sur GitHub.

---

## Toutes les commandes disponibles pour les tests

| Commande | À quoi ça sert |
| -------- | ----------------- |
| `npm test` | Lance les tests en mode interactif (vous pouvez choisir quoi tester) |
| `npm run test:run` | Lance tous les tests une seule fois (pour l'intégration continue) |
| `npm run test:watch` | Lance les tests automatiquement quand vous modifiez le code |
| `npm run test:coverage` | Lance les tests et montre quelles parties du code sont testées |
| `npm run test:ui` | Ouvre une interface graphique pour voir les tests |
| `npm run test:log` | Lance les tests et enregistre les résultats dans un fichier |
| `npm run build:test` | Compile le code puis lance les tests |

---

## Gestion des logs

### Structure

```txt
backend/logs/
├── latest-test.log           # Lien symbolique vers le dernier log
├── test-20260216-140500.log  # Logs horodatés
├── test-20260216-160530.log
└── systemd-test.log          # Logs systemd (si applicable)
```

### Rotation

- Logs locaux: Conservation 30 jours (nettoyage automatique)
- GitHub Actions: Artefacts 30 jours
- Render: Dashboard 7 jours
- Systemd: Rotation via journald

### Consultation

```bash
# Dernier log en temps réel
tail -f logs/latest-test.log

# Rechercher des erreurs
grep -i error logs/latest-test.log

# Tous les logs récents
ls -lht logs/test-*.log | head -10
```

---

## Recommandations par environnement

| Environnement | Solution principale | Solution secondaire |
| ------------- | ------------------- | ------------------- |
| Render | GitHub Actions | Render Cron Jobs |
| Vercel | GitHub Actions | Vercel Cron |
| Railway | GitHub Actions | - |
| Netlify | GitHub Actions | - |
| AWS | GitHub Actions | EventBridge + Lambda |
| GCP | GitHub Actions | Cloud Scheduler |
| Azure | GitHub Actions | Logic Apps |
| VPS Linux | Systemd Timer | Cron |
| Développement | test:watch | GitHub Actions |

---

## Surveillance et alertes

### GitHub Actions

Les échecs de tests génèrent :

- Annotations dans les fichiers concernés
- Artefacts téléchargeables
- Notifications par email (configurable)

### Systemd

```bash
# Configurer les notifications par email
# Installer mailutils
sudo apt install mailutils

# Éditer le service pour ajouter OnFailure
sudo systemctl edit medibloc-test.service

# Ajouter:
[Unit]
OnFailure=status-email@%n.service
```

### Monitoring externe

Intégrations possibles :

- Datadog
- New Relic
- Sentry
- PagerDuty

---

## Sécurité : Protéger vos informations sensibles

### Informations à JAMAIS mettre sur Git

Ces informations doivent rester secrètes :

- `DATABASE_URL` (l'adresse de votre base de données)
- `JWT_SECRET` (votre clé de sécurité)
- Les clés API
- Les mots de passe

### Configurer les secrets sur GitHub Actions

Sur GitHub, allez dans Settings > Secrets and variables > Actions et ajoutez :

```txt
DATABASE_URL_TEST    (adresse de la base de données de test)
JWT_SECRET_TEST      (clé secrète pour les tests)
```

### Protéger vos fichiers sur un serveur

```bash
# Protéger le fichier .env (seul le propriétaire peut le lire)
chmod 600 .env
chown www-data:www-data .env

# Protéger le dossier de logs
chmod 750 logs
```

---

## Que faire si quelque chose ne marche pas

### Les tests échouent sur GitHub Actions

1. Regarder les détails dans l'onglet "Actions" de votre projet GitHub
2. Lancer les tests sur votre ordinateur avec : `npm run test:run`
3. Vérifier que vous utilisez la bonne version de Node.js
4. Vérifier que toutes les variables secrètes sont bien configurées

### Cron ne lance pas les tests

```bash
# Vérifier que le service cron fonctionne
sudo systemctl status cron

# Voir les messages de cron dans les logs système
grep CRON /var/log/syslog

# Tester le script manuellement
./scripts/run-tests-periodic.sh
```

### Systemd ne démarre pas

```bash
# Voir le statut du timer
systemctl status medibloc-test.timer

# Recharger la configuration et redémarrer
sudo systemctl daemon-reload
sudo systemctl restart medibloc-test.timer

# Voir les messages d'erreur détaillés
journalctl -xe -u medibloc-test.timer
```

### Les scripts n'ont pas les droits d'exécution

```bash
# Donner les permissions d'exécution à tous les scripts
chmod +x scripts/*.sh

# Vérifier qui est le propriétaire des fichiers
ls -la scripts/
```

---

## Entretien du projet

### Mettre à jour les dépendances

```bash
# Voir quels packages ont des mises à jour disponibles
npm outdated

# Mettre à jour les packages
npm update

# Corriger les problèmes de sécurité
npm audit fix
```

### Nettoyer les anciens résultats de tests

```bash
# Supprimer manuellement les fichiers de plus de 30 jours
find logs/ -name "test-*.log" -mtime +30 -delete

# Note : Le nettoyage est déjà automatique dans les scripts
```

### Sauvegarder les résultats importants

```bash
# Créer une archive compressée des logs avec la date du jour
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# Copier les logs sur un autre serveur
rsync -av logs/ utilisateur@serveur-sauvegarde:/sauvegardes/medibloc/logs/
```

---

## Besoin d'aide ?

Si vous rencontrez un problème, suivez ces étapes :

1. Lire la documentation principale dans [README.md](README.md)
2. Regarder les messages d'erreur dans les fichiers de logs
3. Utiliser le programme d'installation : `./scripts/install.sh`
4. Consulter les problèmes déjà signalés (issues) sur le projet GitHub
