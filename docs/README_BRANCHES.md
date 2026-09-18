# Architecture des Branches Git - MediBloc (Client & Serveur)

Ce document décrit l'organisation et la séparation stricte des branches pour le **Client (Frontend)** et le **Serveur (Backend)**, ainsi que le déclenchement universel de la CI.

---

## 1. Arborescence Complète des Branches Principales

```text
[CLIENT / FRONTEND]                                 [SERVEUR / BACKEND]
developement-client                                 developement-serveur
       │                                                   │
       ▼                                                   ▼
  tests-client                                        tests-serveur
       │                                                   │
       ▼                                                   ▼
 staging-client                                      staging-serveur
       │                                                   │
       ▼                                                   ▼
deploiement-client                                  deploiement-serveur
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
                           developement  (Convergence globale)
                                 │
                                 ▼
                               tests     (Tests globaux E2E)
                                 │
                                 ▼
                              staging    (Pré-production unifiée)
                                 │
                                 ▼
                               main      (Production stable)
                                 │
                                 ▼
                            deploiement  (Release Docker globale)
```

---

## 2. Rôle des Branches par Périmètre

### A. Branches Spécifiques au CLIENT (Frontend React)
- **`developement-client`** : Branche d'intégration des fonctionnalités et composants UI.
- **`tests-client`** : Exécution des suites de tests unitaires Vitest et React Testing Library.
- **`staging-client`** : Pré-production du client web pour recette d'interface.
- **`deploiement-client`** : Déploiement et génération du conteneur Docker Nginx du client.

### B. Branches Spécifiques au SERVEUR (Backend Express / Prisma / GraphQL)
- **`developement-serveur`** : Branche d'intégration des services, schémas GraphQL et contrôleurs.
- **`tests-serveur`** : Exécution des 199 tests Vitest automatisés de l'API.
- **`staging-serveur`** : Pré-production de l'API pour validation d'intégration.
- **`deploiement-serveur`** : Déploiement et génération du conteneur Docker de l'API Node.js.

### C. Branches Transversales & Environnements Globaux
- **`developement`** : Intégration conjointe du client et du serveur.
- **`tests`** : Validation des flux de bout en bout (E2E).
- **`staging`** : Environnement miroir de pré-production complet.
- **`main`** : Version officielle de production.
- **`deploiement`** : Déclenchement de la publication de l'ensemble des images Docker.

---

## 3. Déclenchement Universel de la CI (GitHub Actions)

L'intégration continue (`.github/workflows/ci.yml`) est configurée pour s'exécuter **automatiquement sur toutes les branches** (`branches: ['**']`) :
- **Backend CI** : Audit de sécurité npm, vérification Prisma, typage TypeScript strict, 199 tests Vitest, compilation de production.
- **Frontend CI** : Audit de sécurité npm, tests unitaires de composants, vérification et compilation Vite.

---

## 4. Nomenclature des Branches de Travail

- **Côté Client** : `feat/client-<nom>`, `fix/client-<nom>`, `test/client-<nom>`
  - Exemple : `git checkout -b feat/client-patient-dashboard developement-client`
- **Côté Serveur** : `feat/serveur-<nom>`, `fix/serveur-<nom>`, `test/serveur-<nom>`
  - Exemple : `git checkout -b feat/serveur-medical-records developement-serveur`
