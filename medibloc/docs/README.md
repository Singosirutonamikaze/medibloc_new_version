# Documentation Technique - MediBloc Web (Frontend)

Bienvenue dans le centre de documentation technique du frontend web MediBloc. Ce dossier regroupe tous les guides d'architecture, de securite, d'exploitation et de developpement de l'application cliente.

---

## Sommaire de la Documentation

1. [Architecture Technique](architecture/Architecture.md)
   - Vue d'ensemble du systeme frontend SPA (React 19, TypeScript, Tailwind CSS v4)
   - Organisation et granularite par Atomic Design (atomes, molecules, organismes, layout)
   - Flux de donnees unilateral, custom hooks et services API
   - Routage et protection des acces (Route Guards)

2. [Guide de Securite](security/Security.md)
   - Gestion des jetons JWT et intercepteurs de session Axios
   - Controle d'acces fonde sur les roles (RBAC)
   - Prevention des attaques XSS et Clickjacking
   - En-tetes de securite HTTP Nginx (CSP, Referrer-Policy, Permissions-Policy)

3. [Reference et Integration de l'API](api/Api.md)
   - Contrat de communication REST `/api/v1` et GraphQL `/graphql`
   - Format standard des reponses et normalisation des erreurs
   - Catalogue des services API typés (`src/services/api/`)

4. [Conventions de Codage](conventions/Conventions.md)
   - Normes de typage TypeScript strict (0 `any`, 0 `unknown`, 0 `!`)
   - Bonnes pratiques React 19 (purete du rendu, immutabilite des props)
   - Accessibilite (a11y) et systeme de design Tailwind CSS

5. [Guide des Tests et Qualite](testing/Testing.md)
   - Commandes d'execution Vitest et React Testing Library
   - Bonnes pratiques de redaction de tests unitaires et isolation des mocks

6. [Guide de Contribution](contributing/Contributing.md)
   - Workflow Git et gestion des branches
   - Format des messages de commit (Conventional Commits, zero emoji)
   - Processus de validation locale et Pull Request

7. [Guide de Deploiement et Conteneurisation](deployment/Deployment.md)
   - Image Docker multi-stage Nginx Alpine
   - Configuration du serveur Nginx, proxy API et mise en cache des assets

8. [Liste des Contributeurs](contributors/Contributors.md)
   - Profils de l'equipe de developpement, roles et liens GitHub

9. [Historique des Contributions](historique/Historique.md)
   - Journal chronologique des commits et modifications


