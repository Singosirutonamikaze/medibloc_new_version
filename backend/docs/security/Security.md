# Guide de Securite - MediBloc Backend

## 1. Principes de Securite Fondamentaux

Le backend MediBloc traite des donnees medicales a caractere hautement confidentiel. La securite repose sur l'isolation des responsabilites, le typage strict des requetes et la protection multicouche (reseau, transport, persistance).

---

## 2. Authentification et Gestion des Jetons (JWT)

### 2.1 Hachage des Mots de Passe
- Tous les mots de passe sont haches via l'utilitaire `core/utils/security/hash.util.ts` avec bcryptjs et un cout d'iteration eleve avant insertion en base de donnees.
- Les empreintes hachees et les mots de passe ne sont jamais exposes dans les logs ni transmis dans les retours d'API REST ou GraphQL.

### 2.2 Tokens JWT et Gestion des Sessions
- Signature des jetons JWT via une cle cryptographique forte definie par la variable `JWT_SECRET`.
- Verification stricte au demarrage de l'application : l'environnement de production refuse de demarrer si la variable `JWT_SECRET` est absente.
- Duree de validite courte controlee par `JWT_EXPIRES_IN`.
- Mecanisme de renouvellement avec table `Session` permettant la revocation immediate des sessions utilisateur compromises.

---

## 3. Controle d'Acces Fonde sur les Roles (RBAC)

Le middleware d'authentification verifie l'identite de l'emetteur et restreint l'acces selon son role :

| Role | Perimetre d'Acces | Exemples d'Operations |
| :--- | :--- | :--- |
| PATIENT | Donnees de sante personnelles, consultations associees | Consulter ses rendez-vous, ses ordonnances, messagerie avec son medecin |
| DOCTOR | Donnees de ses patients suivis, prescriptions | Emettre une ordonnance, planifier des disponibilites, clore une consultation |
| ADMIN | Administration globale de la plateforme | Gestion des comptes, consultation des metriques d'activite |

---

## 4. Protection Reseau et Politique CORS

- Filtrage des origines autorisees via la variable `CORS_ORIGIN`.
- Desactivation des caracteres universels d'origine en production pour interdire les acces non autorises d'autres domaines.
- Journalisation complete des requetes via le format standard Morgan.

---

## 5. Validation et Assainissement des Flux Entrants

- Validation prealable de l'ensemble des requetes REST et GraphQL par des schemas stricts (`express-validator` et types GraphQL).
- Protection contre les injections SQL grace a la generation de requetes parametrees natives de Prisma ORM.
- Absence d'interpretation dynamique de code ou de requetes brutes non assainies.

---

## 6. Securite des Televersements de Fichiers

- Controle strict des types MIME autorises (formats PDF, JPEG, PNG, WEBP).
- Limitation stricte de la taille maximale autorisee a 5 Mo par fichier.
- Renommage cryptographique et stockage securise hors du flux d'execution direct.

---

## 7. Journalisation et Confidentialite

- Exclusion absolue de toute donnee de sante nominative, mot de passe ou jeton d'authentification des fichiers de logs.
- Arret gracieux du serveur pour garantir l'integrite transactionnelle des donnees de la base PostgreSQL en cas d'interruption.
