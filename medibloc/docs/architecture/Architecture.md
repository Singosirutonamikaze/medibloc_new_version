
# Architecture Frontend - MediBloc Web

## 1. Vue d'Ensemble du Systeme Frontend

L'application web client MediBloc est une Single Page Application (SPA) bâtie sur **React 19**, **TypeScript** et **Tailwind CSS v4**. Elle communique avec l'API Backend RESTful (`/api/v1`) et GraphQL (`/graphql`).

```text
+-------------------------------------------------------------------------+
|                           Navigateur Web Client                         |
|                                                                         |
|  +-----------------------+  +-------------------+  +-----------------+  |
|  |     Pages / Vues      |  |  Composants UI    |  |  Contextes      |  |
|  | (Admin/Docteur/Patient)|  |  (Atomic Design)  |  |  (Auth, Theme)  |  |
|  +-----------+-----------+  +---------+---------+  +--------+--------+  |
|              |                        |                     |           |
|              +------------------------+---------------------+           |
|                                       |                                 |
|                             +---------v---------+                       |
|                             |  Custom Hooks     |                       |
|                             | (Gestion d'etat)  |                       |
|                             +---------+---------+                       |
|                                       |                                 |
|                             +---------v---------+                       |
|                             | Services API &    |                       |
|                             | Intercepteurs     |                       |
|                             +---------+---------+                       |
+---------------------------------------|---------------------------------+
                                        | (HTTPS / Bearer JWT)
+---------------------------------------v---------------------------------+
|                       API Backend Express / GraphQL                     |
+-------------------------------------------------------------------------+
```

---

## 2. Organisation par Atomic Design

Le code des composants est decoupe en granularite d'interface :
1. **Atomes** (`src/components/atoms/`) : Elements unitaires de base (Bouton, Champ de saisie, Badge, Alerte, Spinner).
2. **Molecules** (`src/components/molecules/`) : Combinaisons d'atomes (Selecteur de date, Champ de formulaire avec libelle et erreur, Modal).
3. **Organismes** (`src/components/organisms/`) : Blocs fonctionnels complexes autonomes (Barre de navigation, En-tete, Modale de consultation clinique).
4. **Layouts** (`src/components/layout/`) : Gabarits d'affichage (`AuthLayout`, `DashboardLayout`).
5. **Guards** (`src/components/guards/`) : Gardes d'acces aux routes (`PrivateRoute`, `RoleGuard`).

---

## 3. Flux de Donnees et Gestion d'Etat

- **Contrats Typés** : Tous les modèles proviennent du dossier `src/types/` (alignés avec les schémas Prisma du backend).
- **Communication API Centralisée** : Tous les appels HTTP transitent par `src/services/api/` via une instance unique Axios dotée d'intercepteurs.
- **Hooks Déclaratifs** : Les composants d'affichage délèguent l'accès aux données à des hooks personnalisés (`useAppointments`, `usePatients`, etc.).
- **Immutabilité Strict** : Toutes les propriétés (Props) sont immuables (`readonly`).

---

## 4. Protection et Routage

- Routage gere par React Router avec hierarchie declarative.
- Verification systematique du role (`ADMIN`, `DOCTEUR`, `PATIENT`) avant affichage d'une page securisee.
