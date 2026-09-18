# Conventions de Code et Normes d'Architecture - MediBloc Backend

## 1. Principes Fondamentaux et Regles de Purete du Code

Le developpement du backend MediBloc obeit a un standard fonctionnel et declaratif strict sans compromis :

- **Interdiction des structures conditionnelles classiques** : Aucun usage de `if` ou de `switch`. La logique metier, le routage d'etat et le traitement des cas d'erreur reposent exclusivement sur des tables de correspondance typees (`Record<Cle, Gestionnaire>`), des dictionnaires fonctionnels et des fonctions pures.
- **Interdiction des boucles imperatives** : Aucun usage des mots-cles `for`, `while`, `do..while`, `for..in`, `for..of`. Toutes les iterations et transformations de collections s'effectuent via les methodes fonctionnelles d'ordre superieur : `map`, `filter`, `reduce`, `flatMap`, `find`, `every`, `some`, `Object.keys`, `Object.entries`.
- **Typage Strict Deterministe (Zero any, Zero unknown)** : Interdiction absolue des types `any` et `unknown`. Tous les parametres, variables et retours de fonction possedent des types explicites et garantis issus des modeles Prisma, d'interfaces TypeScript et de DTOs dedies.
- **Zero Ambiguite de Nullite (Zero ?. et Zero ??)** : Les operateurs de chainage optionnel `?.` et de coalescence des nuls `??` sont proscrits. Les flux entrants (requetes HTTP, payloads GraphQL) sont assainis et valides en amont par des validateurs stricts pour garantir que les structures de donnees manipulees par les services et les controleurs sont toujours completes et exemptes de valeurs indefines impromptues.
- **Absence d'emojis** : Aucun emoji n'est tolere dans le code source, les logs, les messages de validation ou les documentations.
- **Langue francaise obligatoire** : Tous les commentaires, documentations techniques et messages d'erreur metier sont obligatoirement rediges en francais.

---

## 2. Organisation Modulaire par Fonctionnalite (Vertical Slice)

L'architecture est decouplee par domaine metier. Chaque fonctionnalite est logee dans `src/features/<nom_feature>/` avec une separation stricte ou chaque fichier possede son sous-dossier dedie :

```txt
src/features/<nom_feature>/
├── controllers/
│   └── <nom_feature>.controller.ts
├── services/
│   └── <nom_feature>.service.ts
├── routes/
│   └── <nom_feature>.routes.ts
├── validations/
│   └── <nom_feature>.validation.ts
├── interfaces/
│   └── <nom_feature>.interface.ts
├── types/
│   └── <nom_feature>.types.ts
├── dtos/
│   └── <nom_feature>.dto.ts
└── graphql/
    ├── schemas/
    │   └── <nom_feature>.schema.ts
    ├── queries/
    │   └── <nom_feature>.queries.ts
    ├── mutations/
    │   └── <nom_feature>.mutations.ts
    └── resolvers/
        └── <nom_feature>.resolver.ts
```

---

## 3. Socle Transversal (`src/core/`)

Les composants transversaux et utilitaires communs sont regroupes dans `src/core/` selon le meme principe de sous-dossiers dedies :

- `src/core/configs/` :
  - `env/` : Validation et chargement des variables d'environnement.
  - `database/` : Instance Prisma Client et cycle de vie de connexion.
  - `swagger/` : Specification OpenAPI.
- `src/core/middlewares/` :
  - `auth/` : Verification des jetons JWT et controle des roles (RBAC).
  - `errors/` : Gestionnaire centralise des exceptions 404 et 500.
  - `uploads/` : Gestion des fichiers et medias via Multer.
  - `validations/` : Middleware generique de verification des regles de validation.
- `src/core/utils/` :
  - `responses/` : Formateur standardise des reponses JSON.
  - `security/` : Outils de hachage et de cryptographie.
  - `parsers/` : Outils d'extraction et de conversion des parametres d'URL.
  - `swagger/` : Helpers OpenAPI.
- `src/core/types/` :
  - `global/` : Interfaces et types transversaux.
  - `epidemio/` : Types dedies a la surveillance epidemiologique.
- `src/core/generics/` :
  - Controleurs et services generiques reecrits selon le paradigme declaratif.

---

## 4. Agregation GraphQL (`src/graphql/`)

Le serveur GraphQL unifie l'ensemble des modules metiers de maniere independante :

- `src/graphql/schemas/index.schema.ts` : Agregation des TypeDefs de toutes les fonctionnalites.
- `src/graphql/resolvers/index.resolver.ts` : Agregation des resolvers de toutes les fonctionnalites.
- `src/graphql/servers/apollo.server.ts` : Point de demarrage et configuration du serveur Apollo.

---

## 5. Conventions de Nommage

- **Dossiers** : minuscules et kebab-case (`medical-record`, `controllers`, `services`).
- **Fichiers** : `nom-feature.role.ts` (ex: `appointment.service.ts`, `auth.controller.ts`).
- **Types et Interfaces** : PascalCase (ex: `CreateAppointmentDto`, `UserPayload`).
- **Fonctions et Variables** : camelCase (ex: `findAppointmentById`, `tokenSecret`).
- **Constantes Globales** : UPPER_SNAKE_CASE (ex: `DEFAULT_PORT`, `MAX_FILE_SIZE`).
