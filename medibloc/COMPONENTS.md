# Composants - MediBloc Frontend

## Structure generale

Le projet utilise une organisation basee sur le pattern Atomic Design. La structure regroupe les composants par categorie et par domaine.

## Categories de composants

### Atoms

Les atomes constituent les elements les plus petits et reutilisables.

| Nom | Description |
| --- | --- |
| Alert | Affichage de messages d'alerte |
| Avatar | Photo de profil utilisateur |
| Badge | Etiquettes et badges |
| Button | Boutons interactifs |
| Card | Cartes conteneur |
| Checkbox | Cases a cocher |
| Divider | Separateurs visuels |
| Icon | Icones |
| Input | Champs de saisie texte |
| Label | Etiquettes de formulaire |
| Link | Liens de navigation |
| Radio | Boutons radio |
| Select | Listes deroulantes |
| Spinner | Indicateurs de chargement |
| TextArea | Zones de texte multiligne |

### Molecules

Les molecules combinent plusieurs atomes pour creer des composants plus complexes.

| Nom | Description |
| --- | --- |
| Breadcrumb | Fil d'ariane de navigation |
| DatePicker | Selecteur de date |
| Dropdown | Menu deroulant |
| FileUpload | Upload de fichiers |
| FormField | Champ de formulaire complet |
| Modal | Fenetre modale |
| Pagination | Pagination de liste |
| SearchBar | Barre de recherche |
| Tabs | Onglets de navigation |
| Tooltip | Info-bulles |

### Organisms

Les organismes forment des sections completes et autonomes.

| Nom | Description |
| --- | --- |
| AppointmentForm | Formulaire de rendez-vous |
| DashboardStats | Statistiques du tableau de bord |
| DataTable | Tableau de donnees |
| DoctorForm | Formulaire docteur |
| Footer | Pied de page |
| Header | En-tete de page |
| MedicalRecordCard | Carte de dossier medical |
| PatientForm | Formulaire patient |
| PrescriptionCard | Carte d'ordonnance |
| Sidebar | Barre laterale |
| UserForm | Formulaire utilisateur |

### Common

Les composants communs offrent des fonctionnalites partagees.

| Nom | Description |
| --- | --- |
| EmptyState | Etat vide pour absence de donnees |
| ErrorBoundary | Gestion des erreurs React |
| LoadingScreen | Ecran de chargement |

### Layout

Les layouts definissent la structure generale des pages.

| Nom | Description |
| --- | --- |
| AuthLayout | Layout pour pages d'authentification |
| DashboardLayout | Layout pour tableaux de bord |
| MainLayout | Layout principal de l'application |

### Guards

Les garde-route protegent l'acces aux pages selon le statut et le role.

| Nom | Description |
| --- | --- |
| PrivateRoute | Protege l'acces aux utilisateurs authentifies |
| PublicRoute | Redirection pour utilisateurs authentifies |
| RoleGuard | Protection basee sur le role utilisateur |

## Utilisation des composants

### Import depuis une categorie

```typescript
import { Button, Input, Card } from '@/components/atoms';
import { FormField, Modal, SearchBar } from '@/components/molecules';
import { Header, Sidebar, DataTable } from '@/components/organisms';
import { ErrorBoundary, LoadingScreen } from '@/components/common';
```

### Import global

```typescript
import { Button, Header, ErrorBoundary } from '@/components';
```

### Exemple d'utilisation

```typescript
import { Button } from '@/components/atoms';

const MyComponent = () => (
  <Button variant="primary" onClick={() => console.log('clicked')}>
    Valider
  </Button>
);
```

## Organisation des fichiers

Chaque composant suit la structure suivante :

```text
ComponentName/
├── ComponentName.tsx
└── index.ts
```

Le fichier `index.ts` exporte le composant pour simplifier les imports.
