# Guide de Contribution - Projet MediBloc

Ce document definit l'ensemble des normes architecturales, des regles de developpement et des standards de qualite a respecter imperativement pour toute contribution au projet MediBloc (Backend et Frontend).

---

## 1. Principes Fondamentaux et Regles de Codage

Toute contribution doit respecter les regles de programmation suivantes sans aucune exception :

### 1.1 Paradigme Declaratif et Programmation Fonctionnelle Pure
- **Interdiction absolue des instructions `if` / `else`** : Utiliser des expressions ternaires, des tables de correspondance (lookup records ou maps) ou des fonctions de garde pures.
- **Interdiction formelle des instructions `switch` / `case`**.
- **Interdiction des boucles imperatives** (`for`, `while`, `do..while`, `for..in`, `for..of`) : Utiliser exclusivement les methodes fonctionnelles d'iteration (`Array.prototype.map`, `filter`, `reduce`, `find`, `some`, `every`, `flatMap`).
- **Interdiction du chainage optionnel (`?.`) et de l'operateur nullish coalescing (`??`)** : Tous les acces aux proprietes d'objets doivent etre securises par des validateurs types ou des fonctions utilitaires explicites (`isDefined`).

### 1.2 Typage TypeScript Strict
- **Interdiction des types `any` et `unknown`**.
- Typage complet et explicite des signatures de fonctions, arguments et valeurs de retour.
- Pas d'assertion de type non verifiee (`as any`).
- Validation systematique du typage sans emission de code : `npx tsc --noEmit`.

### 1.3 Documentation et Commentaires JSDoc
- **Tous les commentaires et documentations doivent etre rediges en francais**.
- Chaque fichier, interface, type, classe, methode et fonction utilitaire doit comporter un bloc JSDoc complet.
- Presence obligatoire des balises suivantes :
  - `@author SINGO Yao Dieu Donne`
  - `@since AAAA-MM-JJ`
  - `@description <description claire en francais>`
- **Aucun emoji** n'est tolere dans le code source, les noms de fichiers, les tests ou les commentaires techniques.

---

## 2. Structure et Organisation des Modules

### 2.1 Backend (`backend/`)
- Architecture modulaire basee sur les fonctionnalites metier :
  - `src/features/<feature>/controllers/` : Controleurs HTTP recevant les requetes Express et delegant aux services.
  - `src/features/<feature>/services/` : Logique metier pure avec transactions Prisma.
  - `src/features/<feature>/routes/` : Definition des endpoints Express securises par middlewares.
  - `src/features/<feature>/dtos/` : Objets de transfert de donnees avec typage strict.
  - `src/features/<feature>/validations/` : Schemas de validation Zod des requetes entrantes.
  - `src/features/<feature>/graphql/` : Schemas GraphQL, queries, mutations et resolveurs.
  - `src/core/` : Configurations de base, middlewares d'authentification et de securite, types globaux et utilitaires transverses.
  - `prisma/` : Schema de base de donnees relationnelle PostgreSQL, migrations et scripts de seed.
  - `test/` : Suite de tests Vitest structuree en sous-dossiers (`controllers/`, `services/`, `routes/`, `setup/`, `data/`).

### 2.2 Frontend (`medibloc/`)
- Application React avec TypeScript, Vite et Tailwind CSS :
  - `src/components/` : Composants reutilisables et atomiques.
  - `src/pages/` : Vues et ecrans principaux de l'application.
  - `src/services/` : Couche d'appel aux APIs REST et GraphQL.
  - `src/types/` : Definitions des types et interfaces partages.

---

## 3. Commandes et Automatisation Makefile

Des Makefiles standardises sont disponibles a la racine du projet et dans le sous-dossier `backend/` :

```bash
# Afficher l'aide et l'ensemble des commandes disponibles
make help

# Installer toutes les dependances (backend et frontend)
make install

# Demarrer les environnements de developpement
make dev-backend
make dev-frontend

# Lancer la suite complete de tests backend
make test-backend

# Executer un audit qualite complet (types + tests)
make audit

# Nettoyer les fichiers generes et artefacts temporaires
make clean
```

---

## 4. Convention des Messages de Commit

Les commits doivent respecter strictement la norme Conventional Commits :

- `feat:` Ajout d'une nouvelle fonctionnalite metier
- `fix:` Correction d'une anomalie ou d'un bug
- `refactor:` Restructuration interne sans changement de comportement
- `test:` Ajout ou mise a jour de tests unitaires ou d'integration
- `docs:` Documentation technique ou commentaires JSDoc
- `chore:` Taches d'infrastructure, dependances ou CI/CD
- `perf:` Optimisation des performances

Exemple : `feat(patient): ajout de la recherche multicritere par pathologie`

---

## 5. Processus de Contribution et Pull Request

1. Creer une branche de travail a partir de `develop` selon le format `feature/<nom>`, `fix/<nom>` ou `refactor/<nom>`.
2. Developper en appliquant les regles de codage strictes.
3. Executer `make audit` localement et s'assurer que 100% des tests reussissent avec 0 erreur TypeScript.
4. Ouvrir une Pull Request vers la branche `develop` en renseignant fidelement toutes les rubriques du modele de PR.
