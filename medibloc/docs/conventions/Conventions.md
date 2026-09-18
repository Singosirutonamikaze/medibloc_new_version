# Conventions de Code et Normes de Developpement - MediBloc Web

## 1. Normes TypeScript Strictes

- **Interdiction de `any` et `unknown`** : Chaque fonction, composant et variable doit disposer d'un typage exact.
- **Interdiction de l'assertion non-nulle `!`** : Utiliser des replis securises (`??`, valeurs par defaut) ou des verifications explicites.
- **Immutabilite des Props** : Utilisation systematique du modificateur `readonly` sur toutes les interfaces de proprietes.

---

## 2. Bonnes Pratiques React 19

- **Purete de la Phase de Rendu** : Pas d'appels a des fonctions impures (`Date.now()`, generation d'identifiants aleatoires) pendant le rendu d'un composant.
- **Evitement des Rendus en Cascade** : Ne pas appeler `setState` de maniere synchrone a l'interieur de `useEffect`.
- **Atomic Design** : Respecter les paliers de granularite (`atoms/`, `molecules/`, `organisms/`, `layout/`).
- **Accessibilite (a11y)** :
  - Chaque champ `<input>` doit avoir un identifiant `id` et un `<label htmlFor="...">`.
  - Chaque `<button>` doit specifier explicitement `type="button"` ou `type="submit"`.
  - Toutes les balises `<img>` doivent comporter un attribut `alt`.

---

## 3. Style et Design System

- Utilisation exclusive des classes utilitaires **Tailwind CSS v4**.
- Aucun style en ligne arbitraire (`style={{ ... }}`).
- Palette de couleurs unifiee basee sur le design system (tons `slate`, `blue`, etc.).
