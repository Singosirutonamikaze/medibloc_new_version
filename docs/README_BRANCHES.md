# Architecture des Branches Git - MediBloc (Client & Serveur)

Ce document décrit l'organisation et la séparation stricte des branches pour le **Client (Frontend)** et le **Serveur (Backend)**.

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
                            deploiement  (Release Docker)
```

---

## 2. Rôle des Branches par Périmètre

### A. Branches Spécifiques au CLIENT (Frontend React)
- **`developement-client`** : Branche d'intégration des fonctionnalités et composants UI.
- **`tests-client`** : Exécution des suites de tests unitaires Vitest et React Testing Library.
- **`staging-client`** : Pré-production du client web pour recette d'interface.

### B. Branches Spécifiques au SERVEUR (Backend Express / Prisma / GraphQL)
- **`developement-serveur`** : Branche d'intégration des services, schémas GraphQL et contrôleurs.
- **`tests-serveur`** : Exécution des 199 tests Vitest automatisés de l'API.
- **`staging-serveur`** : Pré-production de l'API pour validation d'intégration.

### C. Branches Transversales & Environnements Globaux
- **`developement`** : Intégration conjointe du client et du serveur.
- **`tests`** : Validation des flux de bout en bout (E2E).
- **`staging`** : Environnement miroir de pré-production complet.
- **`main`** : Version officielle de production.
- **`deploiement`** : Déclenchement de la publication des images Docker.

---

## 3. Nomenclature des Branches de Travail (Features & Fixes)

- **Côté Client** : `feat/client-<nom>`, `fix/client-<nom>`, `test/client-<nom>`
  - Exemple : `git checkout -b feat/client-patient-dashboard developement-client`
- **Côté Serveur** : `feat/serveur-<nom>`, `fix/serveur-<nom>`, `test/serveur-<nom>`
  - Exemple : `git checkout -b feat/serveur-medical-records developement-serveur`
