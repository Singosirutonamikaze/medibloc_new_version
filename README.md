# MediBloc

MediBloc est une plateforme web de gestion medicale full-stack destinee aux patients, medecins et administrateurs. Elle centralise la gestion des dossiers medicaux, des rendez-vous, des prescriptions, des medicaments et des pharmacies au sein d'une interface unique et securisee.

## Apercu technique

| Couche | Technologies |
| :--- | :--- |
| Backend | Node.js 20+, Express, TypeScript, Prisma ORM, PostgreSQL |
| Frontend | React 19, TypeScript, Tailwind CSS, Vite, React Router |
| Tests | Vitest, Supertest, Testing Library |
| Documentation API | Swagger / OpenAPI |
| Securite | JWT avec controle d'acces base sur les roles (RBAC) |

---

## Structure du Depot

```text
medibloc_new_version/
├── Makefile                    Commandes d'orchestration globale
├── backend/                    API REST Node.js / Express / TypeScript
│   ├── src/                    Code source de l'API (controllers, routes, middleware)
│   ├── prisma/                 Schema et migrations PostgreSQL
│   ├── test/                   Tests unitaires et d'integration Vitest
│   ├── scripts/                Scripts shell d'automatisation
│   ├── logs/                   Journaux d'acces et rapports de tests
│   ├── Makefile                Commandes directes backend
│   └── docs/                   Centre de documentation technique
│       ├── README.md           Index general de la documentation
│       ├── architecture/       Architecture technique et schema
│       ├── security/           Securite, JWT et conformite
│       ├── deployment/         Guide de mise en production
│       ├── api/                Reference complete de l'API REST
│       ├── testing/            Tests et automatisation
│       ├── contributing/       Guide de contribution Git
│       └── conventions/        Conventions de code TypeScript
│
└── medibloc/                   Application Frontend React
    ├── src/                    Composants, pages, hooks, services
    └── public/                 Ressources statiques
```

---

## Prerequis

- Node.js >= 20.x
- PostgreSQL >= 14.x
- npm ou pnpm
- Make (optionnel mais recommande)

---

## Demarrage Rapide avec Makefile

Le projet intègre un Makefile à la racine pour simplifier toutes les tâches de développement :

```bash
# 1. Installer toutes les dépendances (backend + frontend)
make install

# 2. Configurer les variables d'environnement
cp backend/.env.example backend/.env
cp medibloc/.env.example medibloc/.env.local

# 3. Préparer la base de données
make prisma-migrate

# 4. Lancer les serveurs de développement
# Dans un terminal pour le backend :
make dev-backend
# Dans un second terminal pour le frontend :
make dev-frontend

# 5. Lancer l'audit et les tests
make audit
```

---

## Points d'acces et Services

| Service | URL |
| :--- | :--- |
| Application Frontend | `http://localhost:5173` |
| API REST Backend | `http://localhost:3000/api/v1` |
| Documentation Swagger | `http://localhost:3000/api-docs` |
| Verification de sante (Health) | `http://localhost:3000/api/v1/health` |

---

## Documentation Technique

Pour consulter la documentation detaillee par domaine :

- [Documentation Globale Backend](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/README.md)
- [Architecture Technique](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/architecture/Architecture.md)
- [Guide de Securite](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/security/Security.md)
- [Guide de Deploiement](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/deployment/Deployment.md)
- [Reference de l'API](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/api/Api.md)
- [Guide des Tests](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/testing/Testing.md)
- [Guide de Contribution](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/contributing/Contributing.md)
- [Conventions de Code](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/backend/docs/conventions/Conventions.md)

---

## Licence

Ce projet est distribue sous licence MIT. Voir le fichier [LICENSE](file:///home/siruto/Documents/codesdocs/react_web/medibloc_new_version/LICENSE) pour les termes complets.
