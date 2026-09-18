# Politique de Securite - Frontend MediBloc

## 1. Engagement de Securite de l'Application Client

L'application web React MediBloc manipule des donnees cliniques sensibles destinees aux praticiens hospitaliers et aux patients. La securite de la couche presentation et des communications client-serveur repose sur les meilleures pratiques de l'OWASP pour les applications Single Page (SPA).

---

## 2. Authentification et Gestion des Sessions

### 2.1 Cycle de Vie des Jetons JWT
- Les jetons d'acces JWT sont geres par le contexte d'authentification (`AuthContext`).
- Les requetes HTTP sortantes injectent automatiquement le jeton dans l'en-tete :
  ```http
  Authorization: Bearer <token>
  ```
- En cas de reception d'une reponse HTTP `401 Unauthorized` ou `403 Forbidden`, l'intercepteur Axios purge immediatement la session locale et declenche la redirection vers la mire de connexion.

### 2.2 Protection des Routes et Controle d'Acces
- Les composants de garde de route (`PrivateRoute`, `RoleGuard`) verifient les permissions et le role de l'utilisateur (`ADMIN`, `DOCTEUR`, `PATIENT`) avant le montage de la vue.
- Tout acces non autorise est intercepte avant le rendu de donnees sensibles.

---

## 3. Prevention des Attaques Cotes Client

### 3.1 Protection Contre les Injections XSS (Cross-Site Scripting)
- React echappe par defaut tout contenu textuel injecte dans le JSX.
- L'utilisation de `dangerouslySetInnerHTML` est strictement restreinte et doit faire l'objet d'une sanitisation prealable avec DOMPurify.
- Validation et assainissement stricts des champs de formulaire avant envoi.

### 3.2 Protection Contre le Clickjacking
- Le serveur Nginx en production applique la directive de protection des cadres :
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN" always;
  ```

### 3.3 Protection Contre le Reniflage de Type MIME (MIME Sniffing)
- En-tete HTTP de blocage de detection de contenu :
  ```nginx
  add_header X-Content-Type-Options "nosniff" always;
  ```

### 3.4 En-tetes de Securite et Restrictions de Permissions
- Politiques strictes de Referrer et de permissions materielles :
  ```nginx
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Permissions-Policy "geolocation=(), camera=(), microphone=(), payment=()" always;
  add_header X-Permitted-Cross-Domain-Policies "none" always;
  ```

---

## 4. Securite des Communications Reseau

- Toutes les communications avec l'API Backend s'effectuent imperativement via HTTPS en production.
- Les requetes GraphQL et REST partagent le meme contrat d'authentification Bearer securise.
- Aucune information d'identification, cle privee ou donnee clinique brute n'est stockee en clair dans le code source ou dans les journaux console du navigateur.

---

## 5. Signalement de Vulnerabilite

Pour signaler toute faille de securite :
- Contact : `security@medibloc.com`
- Processus : Divulgation coordonnee et responsable. Aucun detail public ne doit etre diffuse avant publication d'un correctif officiel.
