# MediBloc Backend

API serveur pour le système de gestion médicale MediBloc.

## Technologies utilisées

- **Node.js** 20 ou plus récent
- **TypeScript** 5.x
- **Express.js** - Serveur web
- **Prisma ORM** - Pour communiquer avec la base de données
- **PostgreSQL** - Base de données
- **JWT** - Sécurité et authentification
- **Vitest** - Pour tester le code

## Première installation

```bash
# Installer toutes les dépendances nécessaires
npm install

# Créer le fichier de configuration
cp .env.example .env
# Ouvrir le fichier .env et remplir vos informations

# Préparer la base de données
npx prisma generate
npx prisma migrate dev

# Lancer le serveur en mode développement
npm run dev
```

Le serveur démarre sur <http://localhost:3000>

## Commandes disponibles

### Pour le développement

```bash
npm run dev          # Démarre le serveur (redémarre automatiquement lors des modifications)
npm run build        # Compile le code TypeScript en JavaScript
npm start            # Démarre le serveur en mode production
```

### Pour les tests

```bash
npm test             # Lance les tests (mode interactif)
npm run test:run     # Lance tous les tests une seule fois
npm run test:watch   # Lance les tests à chaque modification du code
npm run test:coverage # Lance les tests et affiche le taux de couverture
npm run test:ui      # Ouvre une interface graphique pour voir les tests
```

### Pour la base de données

```bash
npm run prisma:generate  # Génère le client Prisma
npm run prisma:migrate   # Crée une nouvelle migration
npm run prisma:studio    # Ouvre l'interface graphique de Prisma
npm run prisma:seed      # Remplit la base avec des données de test
```

## Organisation des fichiers

```txt
backend/
├── src/
│   ├── controllers/     # Fichiers qui gèrent les requêtes HTTP
│   ├── middleware/      # Fonctions intermédiaires (authentification, etc.)
│   ├── routes/          # Définition des URLs de l'API
│   ├── services/        # Logique métier de l'application
│   ├── utils/          # Fonctions utilitaires
│   └── index.ts        # Fichier principal qui démarre le serveur
├── test/
│   ├── controllers/    # Tests pour les contrôleurs
│   ├── setup/          # Configuration pour les tests
│   └── mocks/          # Fausses données pour les tests
├── prisma/
│   ├── schema.prisma   # Modèle de la base de données
│   ├── migrations/     # Historique des modifications de la base
│   └── seed.ts         # Script pour remplir la base de données
├── scripts/
│   ├── install.sh              # Programme d'installation automatique
│   ├── run-tests-periodic.sh   # Lance les tests régulièrement
│   ├── watch-and-test.sh       # Lance les tests à chaque modification
│   └── templates/              # Modèles de configuration
└── logs/                       # Fichiers de logs pour les tests
```

## Points d'accès de l'API (Endpoints)

### Authentification

- `POST /api/auth/register` - Créer un nouveau compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

### Utilisateurs

- `GET /api/users` - Obtenir la liste de tous les utilisateurs
- `GET /api/users/:id` - Obtenir les détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Patients

- `GET /api/patients` - Liste des patients
- `GET /api/patients/:id` - Détails d'un patient
- `POST /api/patients` - Créer un patient
- `PUT /api/patients/:id` - Modifier un patient
- `DELETE /api/patients/:id` - Supprimer un patient

### Médecins

- `GET /api/doctors` - Liste des médecins
- `GET /api/doctors/:id` - Détails d'un médecin
- `GET /api/doctors/specialties` - Liste des spécialités
- `POST /api/doctors` - Créer un médecin
- `PUT /api/doctors/:id` - Modifier un médecin
- `DELETE /api/doctors/:id` - Supprimer un médecin

### Rendez-vous

- `GET /api/appointments` - Liste des rendez-vous
- `GET /api/appointments/:id` - Détails d'un rendez-vous
- `POST /api/appointments` - Créer un rendez-vous
- `PUT /api/appointments/:id` - Modifier un rendez-vous
- `DELETE /api/appointments/:id` - Supprimer un rendez-vous

### Dossiers médicaux

- `GET /api/medical-records` - Liste des dossiers
- `GET /api/medical-records/:id` - Détails d'un dossier
- `POST /api/medical-records` - Créer un dossier
- `PUT /api/medical-records/:id` - Modifier un dossier
- `DELETE /api/medical-records/:id` - Supprimer un dossier

## Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du dossier backend :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/medibloc"

# JWT
JWT_SECRET="votre_secret_tres_securise"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

## Tests

Le projet utilise Vitest pour les tests unitaires avec une couverture complète des contrôleurs.

### Exécuter les tests

```bash
# Tests en mode interactif
npm test

# Tests une seule fois (CI)
npm run test:run

# Tests avec couverture
npm run test:coverage

# Interface graphique
npm run test:ui
```

### Tests automatisés

Pour configurer les tests automatiques périodiques, consultez :

- [README-TESTS.md](./README-TESTS.md) - Documentation des scripts de tests
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement complet

```bash
# Installer l'automatisation des tests
chmod +x scripts/install.sh
./scripts/install.sh
```

## Déploiement

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur :

- Render
- VPS/Serveur dédié
- AWS/GCP/Azure
- Environnements cloud

## Documentation technique

- [README-TESTS.md](./README-TESTS.md) - Configuration des tests automatiques
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement
- [Prisma Schema](./prisma/schema.prisma) - Modèle de données
