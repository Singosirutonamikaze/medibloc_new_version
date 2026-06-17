# Guide de Contribution au Frontend MediBloc

Ce document décrit le flux de travail et les étapes à suivre pour contribuer au code de l'application client MediBloc.

## Processus de Contribution

### 1. Préparation de la branche

- Créez toujours une nouvelle branche de fonctionnalité à partir de la branche la plus à jour (généralement `main`).
- Utilisez un nom de branche clair et concis décrivant le changement (ex: `feature/discussion-attachments` ou `fix/login-error-handling`).

### 2. Développement et Respect des Standards

- Écrivez votre code en respectant scrupuleusement la [Charte des Conventions](convention.md).
- Veillez à ce que vos composants restent des fonctions pures et soient hautement réutilisables.

### 3. Rédaction des Tests Unitaires

- Pour toute création de composant d'interface utilisateur interactif (comme des boutons, formulaires, modals), ou pour toute modification de logique métier, vous devez écrire ou mettre à jour le fichier de tests unitaires associé (`.test.tsx`).
- Les tests unitaires doivent couvrir les rendus initiaux, les interactions utilisateur (clics, saisies) et les comportements de chargement ou d'erreur.

### 4. Mise à jour de l'historique des contributions

- Avant d'ouvrir une proposition de changement (Pull Request), vous devez **obligatoirement** enregistrer votre contribution dans le fichier d'historique [historique.md](historique.md).
- Suivez rigoureusement le format du tableau en indiquant la date, votre nom et prénom, la nature exacte du travail effectué, ainsi que le hash du commit Git.

### 5. Validation Locale de la Qualité du Code

Avant d'envoyer vos modifications sur le dépôt distant ou d'ouvrir une Pull Request, vous devez impérativement exécuter les commandes suivantes en local :

- **Vérification syntaxique et typage** :

  ```bash
  npm run lint
  ```

  Aucun avertissement ou erreur ne doit subsister dans les répertoires modifiés.

- **Exécution des tests unitaires** :

  ```bash
  npm run test -- --run
  ```

  Tous les tests existants et nouveaux doivent réussir (100% de passage).

- **Vérification de la compilation de production** :

  ```bash
  npm run build
  ```

  Le projet doit compiler sans erreur pour garantir qu'aucune régression ou problème de configuration n'affecte le déploiement.

### 6. Soumission des modifications (Pull Request)

- Envoyez vos modifications sur votre branche distante.
- Ouvrez une Pull Request claire détaillant :
  - Le problème résolu ou la fonctionnalité ajoutée.
  - La liste des modifications de code majeures effectuées.
  - La mise à jour effectuée dans [historique.md](historique.md).
  - La manière dont la fonctionnalité a été testée.
- Assurez-vous que l'intégration continue (CI) s'exécute avec succès.
