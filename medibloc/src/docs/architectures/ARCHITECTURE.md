# Architecture Frontend MediBloc

Ce document décrit en détail l'organisation, les conventions d'architecture et les bonnes pratiques de développement du frontend de la plateforme MediBloc.

## Liens de navigation

- [Retour au README de l'application](../../../README.md)
- [Retour au README principal du projet](../../../../README.md)
- [Consulter le Catalogue des composants](../readme/COMPONENTS.md)

## Structure générale du projet

Le projet est structuré selon les principes du pattern Atomic Design pour les composants et est organisé par domaines fonctionnels pour les types, services et hooks.

```text
src/
├── components/           # Composants réutilisables (Atomic Design)
│   ├── atoms/            # Composants de base (Button, Input, Alert, Badge, etc.)
│   ├── molecules/        # Composants combinés (DatePicker, FormField, Modal, etc.)
│   ├── organisms/        # Composants complexes autonomes (MedicalRecordDetailsModal, etc.)
│   ├── common/           # Composants partagés et transversaux (ErrorBoundary, etc.)
│   ├── layout/           # Mises en page globales (AuthLayout, DashboardLayout, etc.)
│   └── guards/           # Composants de protection des routes (PrivateRoute, RoleGuard)
│
├── contexts/             # Contextes globaux de l'application
│   ├── AuthContext/      # Authentification et session utilisateur
│   ├── ThemeContext/     # Gestion du thème sombre/clair
│   └── NotificationContext/ # Système de notifications et d'alertes globales
│
├── hooks/                # Hooks personnalisés organisés par domaine
│   ├── useAppointments/  # Gestion des rendez-vous
│   ├── useAuth/          # Accès au contexte d'authentification
│   ├── useDiseases/      # Consultation des maladies
│   ├── useDoctors/       # Gestion des profils de médecins
│   ├── useHeaderInfo/    # Informations d'en-tête contextuelles
│   ├── useMedicalRecords/ # Gestion des dossiers médicaux
│   ├── useMedicines/     # Catalogue des médicaments
│   ├── useNotification/  # Accès aux notifications
│   ├── usePatients/      # Gestion des profils de patients
│   ├── usePharmacies/    # Liste des pharmacies partenaires
│   ├── usePrescriptions/ # Gestion des ordonnances
│   ├── useStats/         # Chargement des statistiques de tableau de bord
│   ├── useSymptoms/      # Consultation des symptômes
│   ├── useTheme/         # Accès aux préférences de thème
│   └── useUsers/         # Administration des utilisateurs
│
├── pages/                # Pages organisées par rôles utilisateurs
│   ├── [admin]/          # Espace d'administration
│   ├── [docteur]/        # Espace médecin (suivi patient, rendez-vous)
│   ├── [patient]/        # Espace patient (rendez-vous, dossiers, prescriptions)
│   ├── auth/             # Pages de connexion et d'inscription
│   ├── home/             # Page d'accueil publique
│   └── not-found/        # Page d'erreur 404
│
├── routes/               # Configuration du routage de l'application
│   ├── Routes.tsx        # Définition des routes de l'application
│   ├── AppRouter.tsx     # Fournisseur de routage principal
│   └── index.ts          # Exports des modules de routage
│
├── services/             # Clients de communication API et stockage
│   ├── api/              # Clients API typés par ressource
│   │   ├── appointments/
│   │   ├── auth/
│   │   ├── discussions/  # Service de messagerie
│   │   ├── diseases/
│   │   ├── doctors/
│   │   ├── hostpots/     # Service d'épi-surveillance
│   │   ├── invoices/     # Service de facturation
│   │   ├── medical-records/
│   │   ├── medicines/
│   │   ├── notifications/# Service de notifications utilisateur
│   │   ├── patients/
│   │   ├── pharmacies/
│   │   ├── prescriptions/
│   │   ├── reviews/      # Service d'avis
│   │   ├── stats/
│   │   ├── symptoms/
│   │   └── users/
│   └── storage/          # Gestion du stockage local (localStorage, cookies)
│
├── types/                # Définitions des types TypeScript par domaine
│   ├── appointment/
│   ├── auth/
│   ├── common/
│   ├── country/
│   ├── dashboard/
│   ├── discussion/       # Types pour la messagerie et les conversations
│   ├── disease/
│   ├── doctor/
│   ├── invoice/          # Types pour la facturation et les règlements
│   ├── medical-record/
│   ├── medicine/
│   ├── notification/     # Types pour les alertes système
│   ├── patient/
│   ├── pharmacy/
│   ├── prescription/
│   ├── review/           # Types pour les avis médicaux
│   ├── symptom/
│   └── user/
│
└── utils/                # Fonctions utilitaires transversales
    ├── api/              # Configuration Axios et intercepteurs
    ├── constants/        # Constantes globales
    ├── helpers/          # Helpers de formatage, calculs, etc.
    └── config/           # Configuration générale de l'application
```

## Principes d'organisation architecturale

### 1. Isolation par domaine fonctionnel

Chaque ressource (ex: `medical-record`, `discussion`, `invoice`) possède sa propre architecture interne complète sous les dossiers clés :

- **Types** (`src/types/[domaine]`) : Déclare les structures exactes des modèles retournés par l'API et les types de requêtes.
- **Services** (`src/services/api/[domaine]`) : Gère les appels HTTP avec Axios. Aucun autre endroit du code ne doit effectuer d'appels réseau directement.
- **Hooks** (`src/hooks/use[Domaine]`) : Gère l'état asynchrone (chargement, erreur, succès) et la mise en cache locale.

### 2. Exportations uniques (Pattern Barrel)

Chaque répertoire fonctionnel intermédiaire doit exporter ses membres via un fichier `index.ts`. Les importations transversales se font uniquement à partir de ces points d'entrée. Cela évite les chemins complexes d'importation relatifs profonds.
*Exemple correct :*

```typescript
import { useAuth, useNotification } from '@/hooks';
```

*Exemple incorrect :*

```typescript
import { useAuth } from '../../../../hooks/useAuth/useAuth';
```

## Bonnes pratiques de codage et standards de React 19

### 1. Immutabilité des Propriétés (Props)

Les interfaces décrivant les propriétés reçues par les composants doivent être marquées comme en lecture seule (`readonly`) pour garantir la prédictibilité des données :

```typescript
export interface MyProps {
  readonly title: string;
  readonly recordId: number;
}
```

### 2. Pureté du Rendu

Les composants React doivent être des fonctions pures. Les appels à des fonctions impures (ex: `Date.now()`, les générateurs d'UUID, etc.) ne doivent jamais être appelés en pleine phase de rendu car ils compromettent l'idempotence du composant.

- **Solution** : Déplacez ces appels en dehors du corps de rendu du composant (fonctions d'aide statiques externes) ou encapsulez-les dans un hook d'effet si l'évaluation doit être dynamique.
*Exemple correct :*

```typescript
// Fonction définie à l'extérieur pour garantir l'idempotence du rendu
const calculateAge = (birthDate: string): number => {
  return Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970);
};

export function PatientDetails({ birthDate }: Readonly<Props>) {
  const age = calculateAge(birthDate);
  return <div>Age : {age} ans</div>;
}
```

### 3. Éviter les mises à jour d'état en cascade (Cascading Renders)

L'appel synchrone d'une fonction `setState` dans un hook `useEffect` provoque un second rendu immédiat, ce qui dégrade les performances.

- **Solution** : Déterminez l'état directement pendant la phase de rendu si la valeur dépend des propriétés, ou déclenchez la modification de l'état lors de l'action utilisateur initiale (clic, saisie) plutôt que d'attendre un effet secondaire de synchronisation.

### 4. Accessibilité (a11y) et sémantique HTML

- **Labels** : Chaque champ de saisie doit posséder un `<label>` associé de manière explicite grâce à l'attribut `htmlFor` qui doit correspondre à l'identifiant unique `id` du champ.
- **Boutons** : Tout bouton interactif qui ne soumet pas de formulaire doit porter l'attribut explicite `type="button"` pour empêcher le navigateur de soumettre le formulaire parent par défaut.

### 5. Standards de test avec Vitest

- Chaque composant d'interface interactif ou complexe (comme les modals) doit posséder un fichier de test associé portant l'extension `.test.tsx` situé dans son propre répertoire.
- Les tests unitaires simulent des scénarios utilisateurs réels en s'appuyant sur les rôles sémantiques fournis par `@testing-library/react` (boutons, en-têtes, boîtes de dialogue) plutôt que sur des sélecteurs CSS arbitraires.
- Les dépendances externes complexes (ex: appels API réseau via Axios, contextes globaux) doivent être systématiquement mockées afin d'isoler le comportement du composant testé.
