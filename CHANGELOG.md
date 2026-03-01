# Changelog

Tous les changements notables dans ce projet sont documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Configuration de base du projet avec Express et TypeScript
- Système d'authentification JWT
- API REST avec gestion des patients, médecins, rendez-vous
- Base de données Prisma avec migration
- Tests avec Vitest
- Documentation Swagger

### Security

- Clé JWT requise via variable d'environnement
- Configuration CORS avec liste blanche d'origines
- Authentification middleware sur toutes les routes sensibles
- Suppression de .env du repository
- Tests de données sans mots de passe en dur

### Fixed

- Suppression du JWT secret en dur du code
- Configuration de sécurité CORS améliorée
- Code commenté nettoyé

### Changed

- Amélioration de la structure des routes
- Refactorisation des contrôleurs génériques

## v1.0.0 - 2026-03-01

### Ajouté

- Version initiale du projet
- Système complet de gestion médical
- API REST complète
- Tests automatisés
- Documentation API avec Swagger

[Unreleased]: https://github.com/Singosirutonamikaze/medibloc_new_version/compare/v1.0.0...HEAD
