# MediBloc - Système de Gestion Médical

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

MediBloc est une plateforme web complète de gestion médical permettant aux patients, médecins et pharmaciens de gérer efficacement les dossiers médicaux, rendez-vous, et prescriptions.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API REST](#api-rest)
- [Tests](#tests)
- [Documentation](#documentation)
- [Sécurité](#sécurité)
- [Contribution](#contribution)
- [Licence](#licence)

## Fonctionnalités

### 🏥 Gestion Patients
- Créer et modifier des profils patients
- Historique médical complet
- Gestion des dossiers médicaux
- Suivi des rendez-vous

### 👨‍⚕️ Gestion Médecins
- Profil médecin avec spécialité
- Gestion du calendrier des rendez-vous
- Prescription de médicaments
- Historique des patients

### 💊 Gestion Pharmacie
- Inventaire des médicaments
- Traitement des ordonnances
- Historique des prescriptions

### 📅 Rendez-vous
- Système de réservation
- Notification et rappels
- Gestion des statuts (en attente, confirmé, annulé)

### 🔐 Authentification
- Authentification JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Sécurité des données sensibles

## Architecture

```
medibloc_new_version/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── controllers/        # Logique métier
│   │   ├── routes/            # Définition des routes
│   │   ├── middleware/        # Authentification, validation
│   │   ├── config/            # Configuration, base de données
│   │   ├── types/             # Types TypeScript
│   │   └── utils/             # Utilitaires et helpers
│   ├── test/                  # Tests unitaires et d'intégration
│   └── prisma/                # Schéma et migrations de BD
├── medibloc/                   # Interface React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/             # Pages de l'application
│   │   ├── contexts/          # Contexte React (Auth, etc.)
│   │   ├── services/          # Services API
│   │   └── types/             # Types TypeScript
│   └── public/                # Ressources statiques
└── docs/                       # Documentation

Stack:
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, React Router, Axios
- **Tests**: Vitest, Supertest
- **Documentation**: Swagger/OpenAPI
```

## Installation

### Prérequis

- Node.js >= 18.x
- npm ou pnpm
- PostgreSQL >= 12.x
- Git

### Cloner le repository

```bash
git clone https://github.com/Singosirutonamikaze/medibloc_new_version.git
cd medibloc_new_version
```

### Installation du Backend

```bash
cd backend
npm install

# Créer le fichier .env en copiant .env.example
cp .env.example .env

# Générer une clé JWT forte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Ajouter la clé dans .env en tant que JWT_SECRET

# Configurer DATABASE_URL dans .env

# Exécuter les migrations
npm run db:migrate

# (Optionnel) Seed la base de données
npm run db:seed
```

### Installation du Frontend

```bash
cd medibloc
npm install

# Configuration du .env (si nécessaire)
cp .env.example .env.local
```

## Configuration

### Variables d'environnement Backend

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medibloc"
PASSWORD="your_database_password"

# JWT Security (REQUIRED)
JWT_SECRET="generated-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
CORS_CREDENTIALS="false"
```

### Variables d'environnement Frontend

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## Utilisation

### Démarrer le Backend

```bash
cd backend

# Développement avec rechargement automatique
npm run dev

# Production
npm run build
npm run start

# Tests
npm run test
npm run test:watch

# Couverture de tests
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check
```

### Démarrer le Frontend

```bash
cd medibloc

# Développement
npm run dev

# Production
npm run build
npm run preview

# Tests
npm run test

# Linting
npm run lint:fix
```

### Accéder à l'application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api/v1
- **Documentation API**: http://localhost:3000/api-docs
- **HealthCheck**: http://localhost:3000/health

## API REST

### Authentification

#### Créer un compte
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Se connecter
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Patients

#### Créer un patient
```bash
POST /api/v1/patients
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": 1,
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "phone": "+33612345678",
  "address": "123 Rue principale, Paris",
  "bloodType": "O+",
  "allergies": "Pénicilline"
}
```

#### Récupérer tous les patients
```bash
GET /api/v1/patients?page=1&limit=10
Authorization: Bearer <TOKEN>
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "dateOfBirth": "1990-01-15",
      "gender": "MALE",
      "phone": "+33612345678",
      "address": "123 Rue principale, Paris",
      "bloodType": "O+",
      "allergies": "Pénicilline"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Médecins

#### Créer un médecin
```bash
POST /api/v1/doctors
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": 2,
  "specialty": "Cardiologie",
  "licenseNumber": "CARD-12345",
  "phone": "+33654321098"
}
```

#### Récupérer tous les médecins
```bash
GET /api/v1/doctors?page=1&limit=10
```

### Rendez-vous

#### Créer un rendez-vous
```bash
POST /api/v1/appointments
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDate": "2026-03-15T14:30:00Z",
  "reason": "Suivi cardiaque",
  "status": "PENDING"
}
```

#### Récupérer les rendez-vous d'un patient
```bash
GET /api/v1/appointments/patient/1
Authorization: Bearer <TOKEN>
```

### Documentation complète

Pour plus de détails sur tous les endpoints disponibles, consultez la documentation Swagger :

```
http://localhost:3000/api-docs
```

## Tests

### Exécuter les tests

```bash
cd backend

# Exécuter tous les tests
npm run test

# Mode watch (re-run au changement de fichier)
npm run test:watch

# Couverture de code
npm run test:coverage

# Tests spécifiques
npm run test -- routes/auth.routes.test
```

### Structure des tests

```
backend/test/
├── routes/           # Tests d'intégration des routes
├── controllers/      # Tests unitaires des contrôleurs
├── setup/           # Configuration et mocks
└── helpers          # Utilitaires de test
```

## Documentation

- [Architecture détaillée](medibloc/ARCHITECTURE.md)
- [Composants React](medibloc/COMPONENTS.md)
- [Guide de déploiement Backend](backend/README-DEPLOYMENT.md)
- [Guide des tests](backend/README-TESTS.md)

## Sécurité

### Bonnes pratiques implémentées

✅ **Authentification JWT**
- Tokens signés avec clé forte (minimum 32 caractères)
- Expiration configurable
- Validation stricte du token

✅ **CORS Configuration**
- Liste blanche d'origines
- Credentials désactivés pour les accès publics
- Avertissement pour usage de wildcard (*)

✅ **Validation des données**
- Schémas de validation strictes
- Sanitization des entrées utilisateur
- Messages d'erreur génériques

✅ **Gestion des erreurs**
- Pas d'exposition d'informations sensibles
- Logging sécurisé
- Middleware d'erreur centralisé

✅ **Base de données**
- Migrations de schéma versionnées
- Requêtes paramétrées (Prisma)
- Pas de SQL injection possible

✅ **Environnement**
- .env non commité au repository
- .env.example fourni pour documentation
- Variables obligatoires validées au démarrage

### Rapports de sécurité

Pour signaler une vulnérabilité, veuillez envoyer un email privé à:
```
security@example.com
```

Ne publiez pas les vulnérabilités publiquement jusqu'à ce qu'elles soient corrigées.

## Contribution

Les contributions sont bienvenues! Voici comment faire:

1. Forkez le projet (`git clone <votre-fork>`)
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de code

- Utilisez TypeScript pour la sécurité des types
- Suivez le style existant via le linter
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez les changements complexes

## Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## Support

- 📧 Email: support@medibloc.dev
- 🐛 Issues: https://github.com/Singosirutonamikaze/medibloc_new_version/issues
- 💬 Discussions: https://github.com/Singosirutonamikaze/medibloc_new_version/discussions

---

**Créé avec ❤️ par Siruto**
