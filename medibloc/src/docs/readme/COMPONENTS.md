# Catalogue des Composants - MediBloc Frontend

Ce document répertorie et décrit les différents composants de l'interface utilisateur de MediBloc. Les composants sont organisés selon la méthodologie Atomic Design.

## Liens de navigation

- [Retour au README de l'application](../../../README.md)
- [Retour au README principal du projet](../../../../README.md)
- [Consulter l'Architecture Frontend](../architectures/ARCHITECTURE.md)

## Structure générale

Le projet utilise une organisation basée sur le pattern Atomic Design. La structure regroupe les composants par catégorie et par domaine.

## Catégories de composants

### Atoms

Les atomes constituent les éléments les plus petits et réutilisables. Ils ne contiennent pas de logique métier et sont configurables via des propriétés simples.

| Nom | Description |
| --- | --- |
| Alert | Affichage de messages d'alerte ou de statut (info, success, warning, error) |
| Avatar | Photo de profil de l'utilisateur avec fallback sur les initiales |
| Badge | Étiquettes colorées pour indiquer des états, statuts ou catégories |
| Button | Boutons interactifs personnalisables (variantes, états de chargement) |
| Card | Conteneur avec bordure et ombre pour structurer le contenu |
| Checkbox | Cases à cocher pour les formulaires |
| Divider | Séparateurs visuels horizontaux ou verticaux |
| Icon | Wrapper pour l'affichage unifié d'icônes |
| Input | Champs de saisie de texte, mot de passe, email, etc. |
| Label | Étiquettes de formulaire associées à des champs |
| Link | Liens de navigation internes ou externes |
| Radio | Boutons radio pour les choix uniques |
| Select | Listes déroulantes pour la sélection d'options |
| Spinner | Indicateurs visuels de chargement et d'attente |
| TextArea | Zones de saisie de texte multiligne |

### Molecules

Les molécules combinent plusieurs atomes pour créer des composants plus complexes, mais restent largement génériques.

| Nom | Description |
| --- | --- |
| Breadcrumb | Fil d'Ariane pour indiquer la position dans la navigation |
| DatePicker | Sélecteur de date avec calendrier de sélection |
| Dropdown | Menu contextuel déroulant pour les actions rapides |
| FileUpload | Zone de glisser-déposer pour le téléchargement de pièces jointes |
| FormField | Champ de formulaire complet associant Label, Input et message d'erreur |
| Modal | Fenêtre superposée bloquante avec fond flouté et bouton de fermeture |
| Pagination | Contrôle de navigation pour les listes de données paginées |
| SearchBar | Barre de recherche avec champ de saisie et bouton d'action |
| Tabs | Système d'onglets pour basculer entre différentes vues |
| Tooltip | Bulle d'aide contextuelle s'affichant au survol |

### Organisms

Les organismes forment des sections complètes, autonomes et potentiellement connectées à la logique métier ou à des services API.

| Nom | Description | Propriétés Clés / Rôles |
| --- | --- | --- |
| AppointmentForm | Formulaire complet de prise de rendez-vous médical | Prise en charge des disponibilités des médecins |
| DashboardStats | Affichage des indicateurs de performance clés (KPI) | Données agrégées sous forme de grille de cartes |
| DataTable | Tableau de données générique avec filtres, tri et pagination | Gestion des volumes importants de données |
| DoctorForm | Formulaire d'édition et de création de profil de médecin | Gestion des spécialités et des informations de contact |
| Footer | Pied de page de l'application contenant les liens légaux | Rendu uniforme sur tout le site |
| Header | En-tête de page affichant le profil de l'utilisateur et les notifications | Accès rapide aux réglages et déconnexion |
| MedicalRecordCard | Carte affichant un résumé d'un dossier médical | Affichage des informations clés et des liens de fichiers |
| MedicalRecordDetailsModal | Modal d'affichage complet et détaillé d'un dossier médical | Reçoit un `record` en `readonly` |
| MedicalRecordFormModal | Modal de création et modification de dossier clinique | Formulaire de saisie avec validation et gestion du chargement |
| PatientForm | Formulaire de création et d'édition de profil de patient | Coordonnées, date de naissance, informations médicales de base |
| PrescriptionCard | Carte présentant les ordonnances prescrites au patient | Liste des médicaments, doses, fréquences et durées |
| Sidebar | Barre de navigation latérale dynamique selon le rôle de l'utilisateur | Redirection vers les différents espaces (Admin, Docteur, Patient) |
| UserForm | Formulaire de gestion d'un compte utilisateur global | Création de compte, attribution de rôles et réinitialisation |

### Common

Les composants communs offrent des fonctionnalités partagées de support applicatif.

| Nom | Description |
| --- | --- |
| EmptyState | Message visuel affiché lorsqu'aucune donnée n'est disponible |
| ErrorBoundary | Composant de sécurité React capturant les erreurs d'affichage |
| LoadingScreen | Écran d'attente plein écran utilisé pendant le chargement initial |

### Layout

Les layouts définissent la grille de structure générale des pages.

| Nom | Description |
| --- | --- |
| AuthLayout | Structure pour les pages d'authentification (centré, fond sombre) |
| DashboardLayout | Structure avec Sidebar latérale et Header supérieur pour les espaces connectés |
| MainLayout | Structure générale pour la partie publique du site |

### Guards

Les gardes de routes protègent l'accès aux pages selon les autorisations et le statut de connexion.

| Nom | Description |
| --- | --- |
| PrivateRoute | Bloque l'accès aux pages si l'utilisateur n'est pas authentifié |
| PublicRoute | Redirige les utilisateurs connectés hors des pages d'authentification |
| RoleGuard | Filtre l'accès aux pages en fonction des rôles autorisés (Admin, Médecin, Patient) |

## Utilisation des composants

### Import depuis une catégorie

Pour optimiser les performances et la structure du code, vous pouvez importer les composants depuis leurs répertoires de catégories respectifs :

```typescript
import { Button, Input, Card } from '@/components/atoms';
import { FormField, Modal, SearchBar } from '@/components/molecules';
import { Header, Sidebar, DataTable } from '@/components/organisms';
import { ErrorBoundary, LoadingScreen } from '@/components/common';
```

### Import global

Tous les composants sont également ré-exportés au niveau racine de `components` pour simplifier les imports dans les cas complexes :

```typescript
import { Button, Header, ErrorBoundary } from '@/components';
```

### Exemple d'utilisation

```typescript
import { Button } from '@/components/atoms';

const MyComponent = () => (
  <Button variant="primary" onClick={() => console.log('Action validée')}>
    Valider
  </Button>
);
```

## Organisation des fichiers

Chaque composant respecte une structure de fichiers stricte pour l'encapsulation :

```text
ComponentName/
├── ComponentName.tsx       # Code React du composant
├── ComponentName.test.tsx  # Fichier de tests unitaires (si applicable)
└── index.ts                # Exportation du composant
```

Le fichier `index.ts` permet d'importer le composant proprement en faisant référence uniquement à son dossier parent.
