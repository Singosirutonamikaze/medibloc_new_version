# Conventions de Codage et Normes de Développement

Ce document définit les conventions de style, de structure de code et de qualité appliquées au projet frontend MediBloc.

## Style de Code et Langage

### 1. TypeScript Strict

- L'utilisation des types larges ou de contournement comme `any` et `unknown` est strictement interdite. Tous les paramètres de fonction, valeurs de retour, variables et propriétés doivent être explicitement et précisément typés avec des structures de données réelles ou des interfaces.
- Les assertions de type inutiles (ex: `value as string`) doivent être évitées. Si une assertion est nécessaire, assurez-vous qu'elle est justifiée et sécurisée.
- L'opérateur d'assertion non-nulle `!` ne doit pas être utilisé. Préférez des vérifications explicites d'existence ou des valeurs de repli (ex: `??` ou structure `if`).

### 2. Nommage des Fichiers et Répertoires

- **Composants** : Utiliser la casse PascalCase pour le répertoire et le fichier du composant (ex: `src/components/atoms/Button/Button.tsx`).
- **Hooks** : Utiliser le préfixe `use` suivi de la casse camelCase (ex: `src/hooks/useAppointments/useAppointments.ts`).
- **Types et Utilitaires** : Utiliser la casse kebab-case pour les fichiers généraux (ex: `src/types/medical-record/medical-record.types.ts`).
- **Fichiers de tests** : Placer le fichier de test dans le même répertoire que le code testé avec l'extension `.test.tsx` ou `.spec.ts` (ex: `Button.test.tsx`).

## Bonnes pratiques React 19

### 1. Immutabilité des Propriétés

Toutes les propriétés de composant (Props) doivent être déclarées en lecture seule (`readonly`) pour préserver le flux unilatéral des données.

### 2. Pureté de la phase de rendu

Le rendu d'un composant doit être totalement prédictible et exempt d'effets secondaires.

- Ne jamais appeler de fonctions dépendantes du temps ou de l'état système (ex: `Date.now()`, `Math.random()`) durant la phase de rendu.
- Extraire ces calculs dans des fonctions d'aide pures en dehors du composant, ou les exécuter dans des hooks d'effets (`useEffect`).

### 3. Évitement des rendus en cascade (Cascading Renders)

L'utilisation de `setState` de manière synchrone dans un `useEffect` doit être bannie. Elle engendre des rendus multiples inutiles.

- Privilégiez le calcul des valeurs dérivées directement pendant le rendu.
- Modifiez l'état au cours de l'événement déclencheur (ex: lors du clic sur le bouton).

## Normes d'Accessibilité (a11y)

- **Formulaires** : Chaque élément de saisie (`<input>`, `<select>`, `<textarea>`) doit posséder un identifiant `id` et être associé à un élément `<label>` via l'attribut `htmlFor`.
- **Éléments cliquables** : Tout élément déclenchant une action JavaScript sans lien de navigation doit être représenté par un composant `<button type="button">`. L'attribut `type` doit être explicitement renseigné pour éviter le comportement de soumission de formulaire par défaut.
- **Images** : Toutes les balises `<img>` doivent posséder un attribut `alt` décrivant textuellement l'image (ou vide pour les images purement décoratives).

## Charte de Style et Interface

- **Tailwind CSS v4** : Le projet utilise les classes utilitaires standard de Tailwind CSS v4. Aucun style en ligne (attribut `style={{...}}`) ne doit être utilisé pour de la mise en page générale.
- **Thème** : Les couleurs, marges et typographies doivent provenir exclusivement du design system configuré (utilisation des classes comme `bg-slate-900`, `text-slate-300`, `border-slate-750`).
