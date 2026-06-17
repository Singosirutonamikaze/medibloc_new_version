# MediBloc - Guide de l'Application Frontend

Ce répertoire contient le code source de l'interface utilisateur de la plateforme MediBloc, une solution web complète de gestion médicale et de suivi clinique.

## Présentation générale et objectifs

L'application client MediBloc offre une interface sécurisée, performante et adaptative (responsive) permettant de gérer les relations entre patients, praticiens de santé et administrateurs. Ses principaux objectifs sont :

- Faciliter la prise de rendez-vous médicaux en temps réel.
- Permettre un suivi précis des antécédents médicaux et des dossiers cliniques.
- Assurer un système de messagerie sécurisé et direct entre patients et médecins.
- Permettre l'accès aux ordonnances et la gestion des traitements prescrits.
- Gérer la facturation et les règlements en ligne.
- Assurer un système de veille épidémiologique et d'alerte sanitaire (épi-surveillance).

## Liens vers la documentation technique détaillée

Pour aller plus loin dans la compréhension technique du projet, vous devez consulter les documents internes suivants :

### Guides de Conception et Composants UI

- [Architecture Frontend (Détaillée)](src/docs/architectures/ARCHITECTURE.md) — Explications approfondies sur les choix d'architecture, le flux de données, la pureté des composants React et la gestion d'état.
- [Catalogue des composants](src/docs/readme/COMPONENTS.md) — Référence complète de tous les composants UI de l'application (Atoms, Molecules, Organisms).
- [Architecture Générale Client](docs/architecture.md) — Vue d'ensemble conceptuelle de l'application client.

### Normes de Développement et de Contribution

- [Conventions de Codage](docs/convention.md) — Guide complet des normes de style de code, de typage TypeScript et d'accessibilité (a11y).
- [Guide des Messages de Commit](docs/commit.md) — Normes à suivre pour rédiger des commits sémantiques et structurés sans émojis.
- [Processus de Revue de Code](docs/revue.md) — Checklist pour les relectures de code et la validation des contributions.
- [Guide de Contribution](docs/conribution.md) — Étapes et règles pour soumettre des modifications sur le projet.
- [Historique et Gestion des Versions](docs/historique.md) — Information sur le cycle de vie des versions de la plateforme.

## Installation et configuration locale

### Prérequis requis

- Node.js version 22.x ou supérieure (recommandé : 22.x LTS)
- npm version 9.x ou supérieure

### Procédure d'installation et de lancement

1. **Cloner le projet et naviguer dans le dossier frontend** :

   ```bash
   cd medibloc
   ```

2. **Installer les dépendances du projet** :

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Copiez le fichier de template d'environnement :

   ```bash
   cp .env.example .env.local
   ```

   Ouvrez le fichier `.env.local` nouvellement créé et configurez l'URL cible de votre API backend :
  
   ```env
   VITE_API_URL="http://localhost:3000/api/v1"
   ```

4. **Lancer le serveur de développement local** :

   ```bash
   npm run dev
   ```

   Le terminal affichera l'adresse locale du serveur de développement. Par défaut, l'application est accessible à l'adresse : [http://localhost:5173](http://localhost:5173).

## Commandes et scripts disponibles

Voici la liste des commandes exécutables dans le répertoire frontend :

| Script npm | Commande sous-jacente | Description |
| --- | --- | --- |
| `npm run dev` | `vite` | Démarre le serveur local avec rechargement automatique en temps réel (HMR). |
| `npm run build` | `tsc && vite build` | Vérifie les types TypeScript et compile le projet pour la production dans le répertoire `dist/`. |
| `npm run preview` | `vite preview` | Lance un serveur web local pour tester le build de production généré dans `dist/`. |
| `npm run test` | `vitest` | Lance les tests unitaires et d'intégration via Vitest en mode interactif. |
| `npm run lint` | `eslint . --ext ts,tsx` | Analyse le code source pour détecter les erreurs de syntaxe, de style ou d'architecture. |

## Rôles utilisateurs et fonctionnalités de l'interface

L'application s'articule autour de trois rôles principaux, disposant chacun de pages spécifiques situées sous le répertoire [src/pages/](src/pages) :

### 1. Espace Administrateur (`[admin]`)

- **Dashboard** : Rendu global de l'activité, incluant des widgets dynamiques pour les indicateurs clés (nombre total de patients, médecins inscrits, rendez-vous du jour, pharmacies actives, alertes d'épidémies en cours).
- **Gestion des utilisateurs** : Tableau d'administration permettant la création de comptes, la réinitialisation de mots de passe, et la modification des rôles ou de l'état d'activation des comptes.
- **Gestion médicale** : Création et modification globale des fiches de maladies, de symptômes et de leur degré de gravité, ainsi que de leur répartition géographique (épi-surveillance).
- **Gestion des ressources** : Suivi des pharmacies partenaires, mise à jour du catalogue général de médicaments et gestion des stocks déclarés.
- **Statistiques avancées** : Tableaux de bord analytiques complexes utilisant des graphiques pour représenter l'activité sur la plateforme.

### 2. Espace Médecin (`[docteur]`)

- **Dashboard** : Calendrier des rendez-vous à venir, vue d'ensemble des dossiers médicaux récemment modifiés et accès rapide aux fiches patients.
- **Gestion des consultations** : Interface de gestion des rendez-vous avec possibilité d'accepter, de reporter ou de marquer comme complétée une consultation.
- **Dossiers Cliniques** : Consultation approfondie des antécédents médicaux des patients. Création, édition ou archivage des dossiers cliniques (utilisation des composants `MedicalRecordDetailsModal` et `MedicalRecordFormModal`).
- **Ordonnances (Prescriptions)** : Rédaction sécurisée d'ordonnances électroniques détaillant les médicaments requis, la posologie, les fréquences d'utilisation et la durée du traitement.
- **Profil Praticien** : Gestion des informations professionnelles (spécialité médicale, tarifs de consultation, coordonnées, biographie et définition des plages horaires de disponibilité).

### 3. Espace Patient (`[patient]`)

- **Dashboard** : Prochains rendez-vous confirmés, ordonnances en cours de validité à présenter en pharmacie, notifications récentes et résumé de l'état clinique.
- **Prise de Rendez-vous** : Recherche de médecins par nom ou spécialité, sélection des plages horaires disponibles et réservation immédiate.
- **Dossiers Médicaux personnels** : Consultation sécurisée en lecture seule des dossiers médicaux partagés par les médecins traitants.
- **Mes Ordonnances** : Historique et consultation en ligne des prescriptions médicales en vue de leur retrait dans les pharmacies partenaires.
- **Carnet de Santé** : Déclaration et suivi des symptômes ressentis pour préparer les futures consultations médicales.

## Organisation des répertoires du projet

La structure du code source est conçue pour séparer strictement les préoccupations techniques et fonctionnelles :

- **`src/components/`** : Composants d'interface utilisateur organisés selon le pattern Atomic Design (Atoms, Molecules, Organisms).
- **`src/contexts/`** : Fournisseurs d'états globaux (gestionnaire d'authentification JWT, gestionnaire de thème sombre/clair, système d'alertes).
- **`src/hooks/`** : Hooks personnalisés React encapsulant la logique de chargement et de mutation des données par domaine.
- **`src/pages/`** : Vues de l'application regroupées selon le profil de l'utilisateur connecté ou l'authentification.
- **`src/routes/`** : Définition des chemins d'accès et application des gardes de sécurité (vérification de rôle et de token).
- **`src/services/`** : Couche d'intégration API chargée de communiquer avec le serveur Node.js via des requêtes HTTP typées.
- **`src/types/`** : Interfaces et types TypeScript décrivant les modèles de données échangés.
- **`src/utils/`** : Utilitaires système (helpers de formatage de date, calculs transversaux, configuration globale de l'API).

## Gestion de l'état global et contextes

L'application s'appuie sur trois contextes majeurs pour piloter les fonctions globales :

- **`AuthContext`** : Gère l'authentification, la persistance du jeton JWT dans le stockage local, le chargement du profil utilisateur actuel et le contrôle des droits d'accès.
- **`ThemeContext`** : Permet de basculer dynamiquement entre le mode sombre et le mode clair en injectant des variables CSS adaptées à la racine de l'application.
- **`NotificationContext`** : Fournit un système unifié d'alertes à l'écran (toast notifications) utilisable dans toute l'application pour informer l'utilisateur de la réussite ou de l'échec des requêtes API.

## Suite de Tests Unitaires et Intégration

Les composants critiques font l'objet de tests automatisés rigoureux pour prévenir toute régression.

### Technologies utilisées

Les tests sont écrits avec **Vitest** comme moteur d'exécution et **React Testing Library** pour l'interaction avec le rendu virtuel du DOM.

### Exécuter la suite de tests

- Pour exécuter tous les tests dans le terminal :

  ```bash
  npm run test -- --run
  ```

- Pour lancer l'outil interactif de surveillance (watch mode) :

  ```bash
  npm run test
  ```

### Exemple de couverture de test : Les Modals Cliniques

Les tests unitaires situés dans les répertoires `MedicalRecordDetailsModal` et `MedicalRecordFormModal` valident les comportements suivants :

1. **Rendu initial** : Vérification que toutes les données (nom du patient, titre du dossier, contenu clinique, pièces jointes) s'affichent correctement.
2. **Accessibilité** : Validation de la présence des labels reliés aux champs de formulaires et de la navigation au clavier.
3. **Soumission et interaction** : Simulation d'événements de clic et de saisie, et validation que la fonction de rappel de soumission (`onSubmit`) reçoit les données formatées attendues.
4. **Gestion du statut** : Désactivation des boutons et affichage de l'état d'attente (ex: message "Enregistrement...") lorsque le statut `loading` est actif.
