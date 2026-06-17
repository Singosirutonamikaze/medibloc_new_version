# Architecture de l'Application Client MediBloc

Ce document présente les grandes lignes de l'architecture du client web MediBloc.

Pour une explication exhaustive des structures de fichiers, du flux des données, de l'état global et des conventions techniques détaillées de React 19, veuillez consulter le document technique de référence :

- [Documentation Technique Détaillée de l'Architecture](../src/docs/architectures/ARCHITECTURE.md)

## Objectifs de conception

1. **Modularité par domaine** : Le code est segmenté par entités fonctionnelles (patients, médecins, rendez-vous, discussions, factures) pour permettre une maintenance aisée.
2. **Atomic Design** : Les éléments visuels de l'interface sont découpés en niveaux de granularité (atomes, molécules, organismes) pour encourager la réutilisation.
3. **Pureté et Performance** : Les composants React respectent les règles strictes de pureté (pas d'effets de bord durant la phase de rendu) pour éviter les rendus inutiles.
4. **Sécurité et Contrôle d'Accès** : L'accès aux fonctionnalités est protégé par des gardes (Route Guards) vérifiant les privilèges associés au jeton d'authentification JWT de l'utilisateur connecté.
