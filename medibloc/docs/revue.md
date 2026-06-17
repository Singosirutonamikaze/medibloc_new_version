# Guide et Liste de Contrôle pour la Revue de Code

Ce document sert de guide de référence pour les développeurs chargés de relire et de valider les propositions de modification (Pull Requests) du code frontend de MediBloc.

## Checklist de Revue de Code

### 1. Validation Fonctionnelle et Métier

- Les exigences fonctionnelles du ticket sont-elles pleinement remplies ?
- L'interface utilisateur est-elle fluide et réactive sur les différents formats d'écran (téléphone, tablette, ordinateur) ?
- Les cas d'erreur de l'API (ex: perte de connexion, jeton expiré, serveur indisponible) sont-ils correctement interceptés et signalés à l'utilisateur via le système d'alertes ?

### 2. Architecture et Structure

- Le composant ou service est-il placé dans le bon répertoire selon l'organisation par domaines fonctionnels ou le pattern Atomic Design ?
- Les importations respectent-elles le pattern des Barrels en utilisant les fichiers `index.ts` des répertoires intermédiaires ?
- Aucun import de fichier profond ou croisé non autorisé n'est introduit.

### 3. Pureté et Normes React 19

- Les propriétés du composant (`Props`) sont-elles déclarées en lecture seule (`readonly`) ?
- Les phases de rendu sont-elles exemptes d'effets secondaires et de fonctions impures ?
- Les appels d'états synchrone (`setState`) au sein de `useEffect` ont-ils été évités pour prévenir les rendus en cascade ?
- Les composants complexes utilisent-ils des sélecteurs stables pour les clés (`key`) plutôt que des index de tableaux aléatoires ?

### 4. Typage Strict TypeScript

- Aucun type `any` ou `unknown` n'est utilisé. Tous les éléments doivent être typés de manière précise.
- L'opérateur d'assertion non-nulle `!` a-t-il été écarté au profit de structures conditionnelles sécurisées ?
- Les assertions de types inutiles (ex: `value as MyType`) ont-elles été éliminées pour laisser le compilateur inférer les types ?

### 5. Accessibilité (a11y)

- Les étiquettes de formulaires possèdent-elles l'attribut `htmlFor` relié à l'identifiant `id` du champ correspondant ?
- Les boutons ont-ils un type explicite (`type="button"` ou `type="submit"`) pour éviter la soumission de formulaires accidentelle ?
- Les icônes interactives possèdent-elles des attributs `aria-label` clairs pour les lecteurs d'écran.

### 6. Couverture de Tests

- Les nouveaux composants interactifs possèdent-ils des tests unitaires (`.test.tsx`) associés et complets ?
- Tous les tests de l'application s'exécutent-ils avec succès via `npm run test -- --run` ?
