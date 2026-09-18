# Strategie Complete de Gestion des Branches Git - MediBloc

Ce document detaille l'integralite du modele de branches Git (Git Flow adapte), le cycle de vie des developpements, la separation Frontend / Backend, ainsi que les regles de transition entre chaque environnement.

---

## 1. Vue d'Ensemble du Flux de Travail (Workflow)

```text
[Branches de Developpement]
   - feat/backend-*
   - feat/frontend-*
   - fix/backend-*
   - fix/frontend-*
   - chore/backend-*
   - chore/frontend-*
   - test/*
   - docs/*
          │
          │  (1) Pull Request + Revue de Code + CI
          ▼
    developement    <--- [Environnement de developpement integre]
          │
          │  (2) Promotion pour validation des tests
          ▼
        tests       <--- [Environnement de recette / Tests automatises / Vitest]
          │
          │  (3) Promotion pour validation fonctionnelle
          ▼
       staging      <--- [Environnement de pre-production / Validation finale]
          │
          │  (4) Mise en production
          ▼
        main        <--- [Environnement de production stable]
          │
          │  (5) Publication de version taggée (ex: v1.0.0)
          ▼
    deploiement     <--- [Deploiement continu / Generation images Docker]
```

---

## 2. Detail des 5 Branches Permanentes

| Branche | Environnement Cible | Objectif & Responsabilite | Regles de Protection |
| :--- | :--- | :--- | :--- |
| **`developement`** | Developpement local & partagé | Point de convergence de tous les travaux d'equipe. C'est la branche par defaut pour creer et fusionner les branches de taches. | Rejet des pushes directs. Merge uniquement via Pull Request validee. |
| **`tests`** | Serveur de test / QA | Branche dediee a l'execution des suites completes de tests (unitaires, integration, non-regression). | Validation obligatoire des 199 tests backend et des tests frontend. |
| **`staging`** | Serveur de pre-production | Environnement miroir exact de la production. Permet la recette fonctionnelle utilisateur et les tests d'acceptation. | Merge valide uniquement si l'environnement de staging est operationnel. |
| **`main`** | Serveur de production | Code source de production officiel, securise et audite. | Branche hautement protegee. Aucun commit direct. Seul le code passe par `staging` peut y entrer. |
| **`deploiement`** | Registre Docker / CD | Declenchement automatique des pipelines de construction d'images Docker de production (`medibloc-backend`, `medibloc-frontend`). | Declenchement automatique sur creation de tag Git (`git tag vX.Y.Z`). |

---

## 3. Nomenclature Standardisee des Branches Temporaires

Toute branche de travail est creee a partir de `developement` et adopte obligatoirement la nomenclature :
```text
<type>/<domaine>-<description_courte>
```

### 3.1 Types Autorises
- `feat` : Ajout d'une nouvelle fonctionnalite metier ou utilisateur.
- `fix` : Correction d'un bug ou d'une anomalie.
- `refactor` : Restructuration de code sans modification fonctionnelle.
- `test` : Ajout, refonte ou maintenance de suites de tests.
- `chore` : Configuration d'outils, dependances, Docker, scripts de build.
- `docs` : Documentation technique uniquement.
- `hotfix` : Correctif d'urgence applique directement sur `main` puis reporte sur `developement`.

---

## 4. Cartographie Complete des Branches par Domaine

### 4.1 Branches Specifiques au BACKEND

| Nom de Branche Type | Scope Fonctionnel | Description |
| :--- | :--- | :--- |
| `feat/backend-auth` | `src/features/auth` | Gestion des JWT, rafraichissement, sessions, hachage bcrypt, RBAC. |
| `feat/backend-graphql` | `src/graphql` | Schemas Apollo, resolvers, requetes et mutations specialisees. |
| `feat/backend-medical-records`| `src/features/medical-records` | Dossiers cliniques, observations medicales, antecedents. |
| `feat/backend-appointments` | `src/features/appointments` | Calendrier, disponibilites praticiens, prise de rendez-vous. |
| `feat/backend-prescriptions` | `src/features/prescriptions` | Ordonnances, medicaments, posologies et dispensation. |
| `feat/backend-invoices` | `src/features/invoices` | Facturation des actes medicaux et gestion des paiements. |
| `feat/backend-epidemiology` | `src/features/hotspots` | Donnees de veille sanitaire et surveillance des epidemies. |
| `feat/backend-discussions` | `src/features/discussions` | Messagerie securisee praticien / patient. |
| `feat/backend-notifications` | `src/features/notifications` | Systeme d'alertes et rappels de rendez-vous. |
| `fix/backend-cors` | `src/core/configs/env` | Correctifs sur les origines autorisees et requetes OPTIONS. |
| `fix/backend-prisma` | `prisma/` | Correctifs sur les modeles de donnees PostgreSQL. |
| `test/backend-vitest` | `test/` | Suites de tests unitaires (controllers, services, routes). |
| `chore/backend-docker` | `docker/` | Optimisation de l'image Docker multi-stage et compose PostgreSQL. |

---

### 4.2 Branches Specifiques au FRONTEND

| Nom de Branche Type | Scope Fonctionnel | Description |
| :--- | :--- | :--- |
| `feat/frontend-auth-ui` | `src/pages/auth` | Vues de connexion, inscription, gardes de route (`PrivateRoute`). |
| `feat/frontend-patient-portal`| `src/pages/[patient]` | Tableau de bord patient, prise de rendez-vous, carnet de sante. |
| `feat/frontend-doctor-portal` | `src/pages/[docteur]` | Tableau de bord medecin, redaction d'ordonnances, consultations. |
| `feat/frontend-admin-portal` | `src/pages/[admin]` | Gestion des utilisateurs, analytics et parametres generaux. |
| `feat/frontend-components` | `src/components/` | Nouveaux atomes, molecules et organismes (Atomic Design). |
| `feat/frontend-discussions-ui`| `src/components/` | Composants de chat et messagerie instantanee. |
| `feat/frontend-invoices-ui` | `src/components/` | Affichage des factures et interfaces de paiement. |
| `fix/frontend-routing` | `src/routes/` | Correctifs de navigation ou de redirection SPA. |
| `fix/frontend-styles` | `src/` | Ajustements du responsive design Tailwind CSS v4. |
| `test/frontend-components` | `src/**/*.test.tsx` | Tests unitaires React Testing Library et Vitest. |
| `chore/frontend-docker` | `docker/` | Configuration du conteneur Nginx Alpine et des en-tetes HTTP. |

---

### 4.3 Branches Transversales & Infrastructure

| Nom de Branche Type | Scope | Description |
| :--- | :--- | :--- |
| `docs/technical-documentation`| `docs/` | Redaction et mise a jour des architectures, securite et API. |
| `chore/github-actions-ci` | `.github/workflows` | Pipeline CI multi-jobs (backend + frontend). |
| `chore/root-makefile` | Racine | Scripts et cibles d'automatisation Makefile. |

---

## 5. Guide Etape par Etape du Cycle de Developpement

### Etape 1 : Creer sa branche de fonctionnalite
```bash
# S'assurer d'etre sur developement a jour
git checkout developement
git pull origin developement

# Creer une nouvelle branche (exemple pour un feature backend)
git checkout -b feat/backend-medical-records
```

### Etape 2 : Developper et valider en local
```bash
# Backend : Verification et tests
cd backend
npm run lint
npm run test:run
npm run build

# Frontend : Verification et tests
cd ../medibloc
npm run lint
npm run test -- --run
npm run build
```

### Etape 3 : Committer selon les Conventional Commits
```bash
git add .
git commit -m "feat(backend-medical-records): ajout de la consultation securisee des observations"
```

### Etape 4 : Pousser et ouvrir la Pull Request
```bash
git push -u origin feat/backend-medical-records
```
- Ouvrir la Pull Request vers la branche cible : **`developement`**.
- Attendre la validation de l'Integration Continue (CI) et la revue de code.

---

## 6. Processus de Release (De `developement` a `production`)

Lorsqu'un ensemble de fonctionnalites est termine et valide sur `developement` :

1. **Promotion vers `tests`** :
   - Fusion de `developement` dans `tests`.
   - Execution complete de la suite de tests automatisés.

2. **Promotion vers `staging`** :
   - Fusion de `tests` dans `staging`.
   - Deploiement sur le serveur de pre-production pour recette clinique / utilisateur.

3. **Mise en Production sur `main`** :
   - Fusion de `staging` dans `main`.
   - Creation d'un tag de version sémantique (ex: `git tag v1.0.0`).

4. **Deploiement sur `deploiement`** :
   - Fusion de `main` dans `deploiement`.
   - Declenchement du build final des conteneurs Docker de production.

---

## 7. Gestion des Urgences en Production (Hotfix)

En cas de bug critique detecte directement en production :

1. Creer une branche `hotfix/<description>` directement depuis `main` :
   ```bash
   git checkout -b hotfix/graphql-cors main
   ```
2. Appliquer et tester le correctif.
3. Fusionner le hotfix dans **`main`** ET dans **`developement`** pour eviter toute regression.
