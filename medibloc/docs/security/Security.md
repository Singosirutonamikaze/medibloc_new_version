# Guide de Securite - MediBloc Web Frontend

## 1. Principes de Securite Frontend

La securite de l'application cliente MediBloc garantit la confidentialite des donnees medicales et prevoit une protection robuste contre les menaces applicatives courantes (OWASP Top 10 Web Client).

---

## 2. Authentification, Sessions et Tokens JWT

### 2.1 Injection et Stockage des Jetons
- Les jetons JWT sont recuperes lors de l'authentification et injectes systematiquement dans l'en-tete HTTP `Authorization: Bearer <token>` de chaque requete sortante.
- En cas de reception d'une erreur `401 Unauthorized` ou `403 Forbidden`, l'intercepteur de reponse Axios declenche la deconnexion et la purge des donnees locales.

### 2.2 Controle d'Acces et Gardes de Navigation (RBAC)
- Les composants de protection `PrivateRoute` et `RoleGuard` empechent le montage d'ecrans non autorises aux utilisateurs ne possedant pas les privileges requis (`ADMIN`, `DOCTEUR`, `PATIENT`).

---

## 3. Defense en Profondeur et Protections Cotes Client

### 3.1 Protection Contre les Injections XSS
- React echappe nativement les expressions JavaScript evaluees dans le JSX.
- L'utilisation de `dangerouslySetInnerHTML` est strictement restreinte et requiert une sanitisation avec DOMPurify.

### 3.2 En-tetes de Securite du Serveur Web (Nginx)
Le conteneur Nginx de production applique les en-tetes suivants a chaque reponse :

| En-tete HTTP | Valeur | Protection |
| :--- | :--- | :--- |
| `X-Frame-Options` | `SAMEORIGIN` | Empeche le detournement de clics (Clickjacking). |
| `X-Content-Type-Options` | `nosniff` | Bloque la detection automatique de types MIME malveillants. |
| `X-XSS-Protection` | `1; mode=block` | Active le filtre XSS navigateur. |
| `Referrer-Policy` | `no-referrer-when-downgrade` | Protege les URLs sensibles des referrers externes. |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` | Desactive l'acces non sollicite aux capteurs du terminal. |
| `X-Permitted-Cross-Domain-Policies` | `none` | Interdit l'acces cross-domain par Flash / PDF tiers. |

---

## 4. Confidentialite et Bonnes Pratiques de Developpement

- Aucune donnee de mot de passe, donnee clinique nominative ou jeton n'est enregistree dans les journaux console (`console.log`) en production.
- Les requetes GraphQL et REST empruntent exclusivement des canaux chiffres HTTPS.
- Les formulaires d'entree sont valides en local avant l'envoi au backend.
