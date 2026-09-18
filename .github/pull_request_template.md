<!-- ----------------------------------------------------------------------- -->
<!--                   MODELE DE PULL REQUEST - PROJET MEDIBLOC            -->
<!-- ----------------------------------------------------------------------- -->

## Informations Generales

| Attribut | Valeur |
| :--- | :--- |
| **Auteur** | @ |
| **Type de PR** | [ ] `feat` &nbsp; [ ] `fix` &nbsp; [ ] `refactor` &nbsp; [ ] `test` &nbsp; [ ] `docs` &nbsp; [ ] `chore` &nbsp; [ ] `perf` |
| **Branche Cible** | `develop` / `main` |
| **Ticket / Issue(s)** | Closes # |

---

## 1. Description et Contexte Metier

### Quoi (Resume des changements)
<!-- Decrivez de maniere claire et concise les modifications introduites dans cette PR. -->

### Pourquoi (Justification metier / clinique)
<!-- Quel probleme utilisateur ou besoin medical cette PR resout-elle ? -->

### Comment (Choix d'implementation et architecture)
<!-- Expliquez la logique technique, les patterns utilises et les decisions d'architecture prises. -->

---

## 2. Cartographie Precise des Fichiers et Modules Impactes

### Backend (`backend/`)
- [ ] **Controleurs** : `backend/src/features/**/controllers/*.controller.ts`
- [ ] **Services Metier** : `backend/src/features/**/services/*.service.ts`
- [ ] **Routes et Middlewares** : `backend/src/features/**/routes/*.routes.ts`
- [ ] **DTOs et Validations** : `backend/src/features/**/dtos/`, `backend/src/features/**/validations/`
- [ ] **GraphQL (Schemas, Queries, Mutations, Resolvers)** : `backend/src/features/**/graphql/`
- [ ] **Base de Donnees et Schema Prisma** : `backend/prisma/schema.prisma`, `backend/prisma/migrations/`
- [ ] **Noyau et Utilitaires Globaux** : `backend/src/core/**`

### Tests (`backend/test/`)
- [ ] **Tests de Controleurs** : `backend/test/controllers/*.controller.test.ts`
- [ ] **Tests de Services** : `backend/test/services/*.service.test.ts`
- [ ] **Tests de Routes / Integration** : `backend/test/routes/*.routes.test.ts`
- [ ] **Donnees de Test et Fixtures** : `backend/test/data/mock-data.ts`, `backend/test/data/index.ts`
- [ ] **Configuration de Test** : `backend/test/setup/*.ts`, `backend/vitest.config.ts`

### Frontend (`medibloc/`)
- [ ] **Composants et Vues** : `medibloc/src/components/`, `medibloc/src/pages/`
- [ ] **Services et Client API** : `medibloc/src/services/`
- [ ] **Styles et Theme** : `medibloc/src/styles/`
- [ ] **Tests Frontend** : `medibloc/src/**/*.test.tsx`, `medibloc/src/**/*.test.ts`

### DevOps et Configuration Globale
- [ ] **Workflows CI/CD** : `.github/workflows/ci.yml`
- [ ] **Automatisation Make** : `Makefile`, `backend/Makefile`
- [ ] **Qualite et Types** : `backend/tsconfig.json`, `backend/sonar-project.properties`

---

## 3. Preuves de Tests et Resultats de Validation

### Resume des Tests Executes
| Type de Test | Commande Executee | Resultat | Couverture / Statut |
| :--- | :--- | :--- | :--- |
| **Verification Typage** | `make typecheck` | Reussi (0 erreur) | Strict TypeScript |
| **Tests Unitaires Services** | `npm run test:services` | Reussi | 100% |
| **Tests Controleurs** | `npm run test:controllers` | Reussi | 100% |
| **Tests d'Integration Routes** | `npm run test:routes` | Reussi | 100% |
| **Suite Complete Vitest** | `make test` | Reussi (199/199) | 33/33 fichiers |
| **Audit Global** | `make audit` | Reussi | Valide |
| **Build de Production** | `make build` | Reussi | Dist genere |

### Preuves d'Execution (Logs et Rapports)
<!-- Collez un extrait du rapport de test ou la sortie console sans emoji. -->
```text
✓ test/services/*.test.ts (6 tests)
✓ test/controllers/*.test.ts (6 tests)
✓ test/routes/*.test.ts (6 tests)
Test Files  33 passed (33)
Tests       199 passed (199)
```

---

## 4. Securite et Protection des Donnees Medicales

- [ ] **Confidentialite des donnees de sante** : Aucun identifiant patient ou donnee medicale sensible n'est expose sans authentification.
- [ ] **Controle d'acces base sur les roles (RBAC)** : Les permissions `ADMIN`, `DOCTOR` et `PATIENT` sont strictement verifiees.
- [ ] **Validation des entrees** : Tous les payloads entrants sont valides via Zod et les DTOs associes.
- [ ] **Gestion des secrets** : Aucune cle privee, mot de passe en clair ou token JWT n'a ete commite dans le depot.

---

## 5. Checklist de Qualite et Conformite du Code

> [!IMPORTANT]
> Chaque case ci-dessous doit etre cochee avant de demander une relecture de code.

### Paradigme Fonctionnel et Clean Code
- [ ] **0 instruction `if` / `else`** : Remplacees par des expressions ternaires, lookup maps ou guard expressions fonctionnelles.
- [ ] **0 instruction `switch` / `case`**.
- [ ] **0 boucle imperative (`for`, `while`, `do..while`)** : Utilisation exclusive des methodes fonctionnelles (`map`, `filter`, `reduce`, `find`, etc.).
- [ ] **0 operateur optionnel (`?.`) et 0 operateur `??`** : Validations explicites et gardes types.

### Typage TypeScript
- [ ] **0 utilisation de `any` ou `unknown`**.
- [ ] Toutes les fonctions, parametres et retours sont explicitement types.
- [ ] Validation `npx tsc --noEmit` sans aucune erreur.

### Documentation JSDoc et Standard
- [ ] Commentaires techniques exhaustifs et rediges en **francais**.
- [ ] Presence des balises obligatoires `@author SINGO Yao Dieu Donne` et `@since YYYY-MM-DD` sur chaque fichier et composant exporte.
- [ ] **Aucun emoji** present dans le code source ou les commentaires techniques.

---

## 6. Guide de Relecture et Test Local pour les Reviewers

### Instructions pas a pas pour tester cette PR :
```bash
# 1. Recuperer la branche
git fetch origin
git checkout <nom-de-la-branche>

# 2. Installer les dependances
make install

# 3. Lancer l'audit de qualite (typage + tests)
make audit

# 4. Lancer le serveur backend
make dev-backend
```

---

## 7. Plan de Deploiement et Rollback

- **Migration de base de donnees requise ?** &nbsp; [ ] Oui (`npm run prisma:migrate`) &nbsp; [ ] Non
- **Nouvelles variables d'environnement ?** &nbsp; [ ] Oui (detailler ci-dessous) &nbsp; [ ] Non
- **Procedure de Rollback** : Revert du commit de merge et rollback de migration Prisma si necessaire.
