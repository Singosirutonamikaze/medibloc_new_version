# Politique de Securite - Backend MediBloc

## 1. Contexte et Protection des Donnees de Sante

La protection des donnees medicales a caractere personnel (dossiers patients, consultations, ordonnances, prescriptions) est au centre de l'architecture du backend MediBloc. Le backend applique des principes stricts alignes sur les standards de securite des donnees de sante (HIPAA / RGPD / HDS).

---

## 2. Versions Prises en Charge

| Branche / Version | Prise en charge des correctifs de securite |
| :--- | :--- |
| `main` | Oui (Correctifs prioritaires immediats) |
| `develop` | Oui (Tests et integration des correctifs) |
| `< 1.0.0` | Non (Version depreciee) |

---

## 3. Mecanismes de Securite Integres

### 3.1 Authentification et Gestion de Session
- Hachage securise des mots de passe avec `bcryptjs` (facteur de cout 10).
- Jetons d'authentification JSON Web Tokens (JWT) signes avec une cle secrete robuste (`JWT_SECRET`) a duree d'expiration courte.
- Extraction securisee du token `Bearer` via middleware d'authentification dedie.

### 3.2 Controle d'Acces Base sur les Roles (RBAC)
- Verification systematique du role de l'utilisateur (`ADMIN`, `DOCTOR`, `PATIENT`) sur chaque route protegee.
- Isolation et cloisonnement des donnees cliniques : un patient ne peut acceder qu'a ses propres dossiers, et un medecin a ses patients assignes.

### 3.3 Validation et Sanitisation des Donnees Entrantes
- Validation de schema stricte au niveau de chaque route avec Zod et les DTOs TypeScript associes.
- Protection contre l'injection SQL grace a l'ORM Prisma (requetes parametrees natives).
- Protection contre les attaques NoSQL et les injections de commandes.

### 3.4 Protection Reseau et En-tetes HTTP
- Middleware Helmet pour appliquer les en-tetes de securite (Content-Security-Policy, X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options).
- Limitation du debit de requetes (Rate Limiting) pour prevenir les attaques par force brute ou deni de service (DoS).
- Configuration CORS restrictive avec liste blanche d'origines autorisees (`CORS_ORIGIN`).

---

## 4. Signalement d'une Vulnerabilite

Si vous decouvrez une faille de securite ou un risque potentiel d'exposition de donnees :

1. Ne publiez jamais l'information dans une issue publique GitHub.
2. Envoyez un rapport detaille et confidentiel a : `security@medibloc.com`.
3. Fournissez les informations suivantes :
   - Type et perimetre de la vulnerabilite.
   - Scenario d'attaque et etapes de reproduction pas a pas.
   - Impact estime sur la confidentialite, l'integrite ou la disponibilite des donnees.

L'equipe technique s'engage a :
- Accuser reception sous 48 heures ouvrables.
- Traiter la vulnerabilite de maniere prioritaire et publier un correctif dans un cycle de release d'urgence.
- Mentionner de maniere responsable le contributeur ayant signale la faille (avec son accord).
