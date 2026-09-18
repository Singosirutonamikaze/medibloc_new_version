# MediBloc Backend

API serveur pour le systeme de gestion medicale MediBloc.

## Technologies utilisees

- **Node.js** 20 ou plus recent
- **TypeScript** 5.x / 6.x
- **Express.js** - Serveur web
- **Prisma ORM** - Communication avec la base de donnees
- **PostgreSQL** - Base de donnees relationnelle
- **JWT** - Authentification et securite par jetons
- **Vitest** - Suite de tests unitaires et d'integration

---

## Installation Rapide

```bash
# 1. Installer les dependances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Preparer la base de donnees
npx prisma generate
npx prisma migrate dev

# 4. Lancer le serveur en mode developpement
npm run dev
```

Le serveur demarre sur `http://localhost:3000` (API disponible sur `http://localhost:3000/api/v1`).
Documentation interactive Swagger disponible sur `http://localhost:3000/api-docs`.

---

## Commandes Makefile

Le projet dispose d'un Makefile pour simplifier toutes les operations courantes :

```bash
make help             # Affiche toutes les commandes disponibles
make dev              # Demarre le serveur de developpement
make build            # Compile le backend (Prisma + TypeScript)
make test             # Execute la suite de tests Vitest
make test-coverage    # Execute les tests avec rapport de couverture
make typecheck        # Verification statique des types TypeScript
make audit            # Audit complet (Typecheck + Tests)
make prisma-generate  # Genere le client Prisma
make prisma-migrate   # Applique les migrations de base de donnees
make prisma-studio    # Ouvre l'interface graphique Prisma Studio
make prisma-seed      # Remplit la base avec des donnees initiales
make clean            # Nettoie les fichiers de build et de logs
```

---

## Documentation Technique

La documentation detaillee du backend est centralisee dans le dossier [docs/](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/README.md) :

- [Architecture Technique](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/architecture/Architecture.md) : Conception modulaire, flux des requetes et schema relationnel
- [Guide de Securite](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/security/Security.md) : Authentification JWT, RBAC, politique CORS et assainissement des donnees
- [Guide de Deploiement](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/deployment/Deployment.md) : Deploiement en production, Nginx, PM2 et Cloud (Render)
- [Reference de l'API](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/api/Api.md) : Endpoints, conventions REST et codes de reponse
- [Guide des Tests](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/testing/Testing.md) : Commandes Vitest et scripts d'automatisation
- [Guide de Contribution](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/contributing/Contributing.md) : Workflow Git, branches et Conventional Commits
- [Conventions de Code](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/conventions/Conventions.md) : Normes TypeScript, controleurs et bonnes pratiques Prisma
