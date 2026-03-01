# MediBloc

MediBloc est une plateforme web de gestion médicale full-stack destinée aux patients, médecins et administrateurs. Elle centralise la gestion des dossiers médicaux, des rendez-vous, des prescriptions, des médicaments et des pharmacies au sein d'une interface unique et sécurisée.

## Aperçu technique

| Couche | Technologies |
| ------ | ----------- |
| Backend | Node.js 18+, Express, TypeScript, Prisma ORM, PostgreSQL |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite, React Router v7 |
| Tests | Vitest, Supertest, Testing Library |
| Documentation API | Swagger / OpenAPI |
| Authentification | JWT avec contrôle d'accès basé sur les rôles (RBAC) |

## Structure du dépôt

```text
medibloc_new_version/
├── backend/                    API REST Node.js / Express
│   ├── src/
│   │   ├── controllers/        Logique métier par ressource
│   │   ├── routes/             Définition des routes HTTP
│   │   ├── middleware/         Authentification, validation, gestion d'erreurs
│   │   ├── config/             Base de données, Swagger, variables d'environnement
│   │   ├── scheduler/          Tâches planifiées (tests périodiques)
│   │   ├── types/              Types TypeScript partagés
│   │   └── utils/              Utilitaires et helpers
│   ├── prisma/
│   │   ├── schema.prisma       Schéma de base de données
│   │   └── migrations/         Historique des migrations
│   ├── test/                   Tests unitaires et d'intégration
│   ├── scripts/                Scripts d'automatisation et de déploiement
│   ├── logs/                   Rapports de tests générés automatiquement
│   ├── README-DEPLOYMENT.md    Guide de déploiement complet
│   └── README-TESTS.md         Guide d'automatisation des tests
│
└── medibloc/                   Interface React
    ├── src/
    │   ├── components/         Composants UI (Atomic Design)
    │   ├── pages/              Pages organisées par rôle
    │   ├── contexts/           Contextes React (Auth, Thème, Notifications)
    │   ├── hooks/              Hooks personnalisés par domaine
    │   ├── services/           Clients API par ressource
    │   ├── routes/             Configuration du routage
    │   ├── types/              Types TypeScript par domaine
    │   ├── utils/              Constantes, helpers, configuration
    │   └── docs/
    │       ├── architectures/ARCHITECTURE.md   Architecture frontend détaillée
    │       └── readme/COMPONENTS.md            Catalogue des composants UI
    └── public/                 Ressources statiques
```

## Domaines fonctionnels

Le système couvre les ressources suivantes, chacune disposant de ses propres routes, contrôleur, service et types :

- **Utilisateurs et authentification** — inscription, connexion, gestion des rôles (Patient, Médecin, Admin)
- **Patients** — profils, dossiers médicaux, suivi des maladies et symptômes
- **Médecins** — profils, spécialités, liste d'appointments
- **Rendez-vous** — réservation, confirmation, annulation, statuts
- **Maladies et symptômes** — catalogue, association maladie/symptôme/pays, diagnostic patient
- **Médicaments et pharmacies** — catalogue pharmaceutique et plantes médicinales, gestion des stocks
- **Prescriptions** — ordonnances médicaux avec détail des traitements
- **Statistiques** — données agrégées pour les tableaux de bord

## Prérequis

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm ou pnpm
- Git

## Installation

### Backend

```bash
git clone https://github.com/Singosirutonamikaze/medibloc_new_version.git
cd medibloc_new_version/backend

npm install

# Copier le fichier d'environnement et le renseigner
cp .env.example .env

# Générer une clé JWT sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Appliquer les migrations de base de données
npm run prisma:migrate

# Démarrer le serveur de développement
npm run dev
```

### Frontend

```bash
cd medibloc_new_version/medibloc

npm install

# Copier le fichier d'environnement (si nécessaire)
cp .env.example .env.local

# Démarrer le serveur de développement
npm run dev
```

## Configuration

### Variables d'environnement — Backend

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/medibloc"

# Sécurité JWT (obligatoire, minimum 32 caractères)
JWT_SECRET="votre-cle-secrete-generee"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
CORS_CREDENTIALS="false"
```

### Variables d'environnement — Frontend

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## Commandes disponibles

### Commandes Backend

```bash
npm run dev              # Serveur de développement avec rechargement automatique
npm run build            # Compilation TypeScript + génération Prisma Client
npm run start            # Démarrage en production
npm run test             # Exécution des tests (mode watch)
npm run test:run         # Exécution unique des tests
npm run test:coverage    # Rapport de couverture de code
npm run prisma:migrate   # Appliquer les migrations
npm run prisma:studio    # Interface visuelle Prisma
npm run prisma:seed      # Seed de la base de données
```

### Commandes Frontend

```bash
npm run dev              # Serveur de développement Vite
npm run build            # Compilation de production
npm run preview          # Prévisualisation du build
npm run test             # Exécution des tests
npm run lint             # Vérification du code
```

## Points d'accès

| Service | URL |
| ------- | --- |
| Frontend | <http://localhost:5173> |
| API REST | <http://localhost:3000/api/v1> |
| Documentation Swagger | <http://localhost:3000/api-docs> |
| Health check | <http://localhost:3000/health> |

## API REST — Exemples

Les endpoints suivent la convention REST. Tous les endpoints protégés nécessitent un header `Authorization: Bearer <token>`.

### Inscription

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "MotDePasseSecure123!",
  "firstName": "SINGO",
  "lastName": "Yao Dieu Donné"
}
```

### Connexion

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "MotDePasseSecure123!"
}
```

### Créer un rendez-vous

```http
POST /api/v1/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2,
  "scheduledAt": "2026-04-10T09:00:00Z",
  "reason": "Consultation de suivi"
}
```

Pour la référence complète de tous les endpoints disponibles, consulter la documentation Swagger accessible à l'adresse `http://localhost:3000/api-docs` une fois le serveur démarré.

## Tests

Les tests sont organisés en tests unitaires pour les contrôleurs et en tests d'intégration pour les routes.

```bash
cd backend

# Exécuter tous les tests une fois
npm run test:run

# Mode watch (relance automatique à chaque modification)
npm run test:watch

# Rapport de couverture
npm run test:coverage
```

La structure des tests reflète celle du code source :

```text
backend/test/
├── controllers/     Tests unitaires des contrôleurs
├── routes/          Tests d'intégration des routes HTTP
└── setup/           Configuration globale et mocks
```

Les rapports HTML et JSON des tests sont générés dans `backend/logs/`.

Pour la configuration de l'automatisation des tests (cron, systemd, GitHub Actions, Render), se référer à `backend/README-TESTS.md`.

## Documentation interne

| Document | Emplacement | Contenu |
| -------- | ----------- | ------- |
| Architecture frontend | `medibloc/src/docs/architectures/ARCHITECTURE.md` | Organisation des dossiers, principes d'Atomic Design, conventions d'exportation |
| Catalogue des composants | `medibloc/src/docs/readme/COMPONENTS.md` | Liste et description de tous les composants UI (atoms, molecules, organisms) |
| Guide de déploiement | `backend/README-DEPLOYMENT.md` | Déploiement sur Render, VPS, configuration systemd et GitHub Actions |
| Guide des tests | `backend/README-TESTS.md` | Automatisation des tests avec cron, systemd, scripts shell |
| Journal des modifications | `CHANGELOG.md` | Historique des versions et changements notables |

## Déploiement

Le projet peut être déployé sur Render, un VPS Linux ou tout environnement Node.js compatible. Le guide complet est disponible dans `backend/README-DEPLOYMENT.md`.

Les tests en intégration continue sont préconfigurés via GitHub Actions dans `.github/workflows/`.

## Sécurité

- Les tokens JWT sont signés avec une clé secrète d'au minimum 32 caractères, obligatoirement fournie via variable d'environnement.
- Le middleware CORS applique une liste blanche d'origines autorisées.
- Toutes les entrées utilisateur sont validées via `express-validator` avant traitement.
- Le fichier `.env` n'est pas inclus dans le dépôt ; un fichier `.env.example` documente les variables requises.
- Les requêtes en base de données passent exclusivement par Prisma, éliminant tout risque d'injection SQL.
- Les messages d'erreur exposés au client ne contiennent pas d'informations système sensibles.

## Contribution

1. Créer une branche à partir de `main`
2. Apporter les modifications en respectant le style de code existant (TypeScript strict, linting activé)
3. Écrire ou mettre à jour les tests correspondants
4. Ouvrir une pull request avec une description claire des changements

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour les termes complets.

## Pour aller plus loin

Chaque partie du projet dispose de sa propre documentation détaillée :

- [Guide de déploiement Backend](backend/README-DEPLOYMENT.md) — mise en ligne sur Render, VPS, configuration GitHub Actions
- [Guide des tests Backend](backend/README-TESTS.md) — automatisation avec cron, systemd et scripts shell
- [Architecture Frontend](medibloc/src/docs/architectures/ARCHITECTURE.md) — organisation des dossiers et conventions
- [Catalogue des composants](medibloc/src/docs/readme/COMPONENTS.md) — référence de tous les composants UI
- [Journal des modifications](CHANGELOG.md) — historique des versions

---

![MediBloc](medibloc/public/logo.png)
