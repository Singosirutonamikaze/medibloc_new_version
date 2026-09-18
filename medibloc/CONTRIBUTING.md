# Guide de Contribution - Frontend MediBloc

Ce document presente les directives de developpement et les standards techniques specifiques a l'application frontend React `medibloc/`.

---

## 1. Stack Technique et Architecture Frontend

- **Framework** : React 19 avec TypeScript et Vite.
- **Styling** : Tailwind CSS et Styled Components.
- **Routing** : React Router DOM 7.
- **Tests** : Vitest avec Testing Library React.

---

## 2. Regles de Codage et Qualite

Toute contribution a l'application frontend doit respecter les regles suivantes :

- **Composants Fonctionnels Purs** : Utiliser des composants fonctionnels React avec des hooks standards (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Typage Strict des Props** : Toutes les interfaces de props doivent etre explicitement definies dans `src/types/` ou au sommet du fichier de composant.
- **0 `any` / 0 `unknown`** : Aucune omission de typage.
- **0 `if` / `else`** : Remplacer par des rendus conditionnels ternaires ou des dictionnaires de composants.
- **Commentaires JSDoc en francais** avec balises obligatoires `@author SINGO Yao Dieu Donne` et `@since AAAA-MM-JJ`.
- **0 emoji** dans le code source et les commentaires techniques.

---

## 3. Commandes Utiles pour le Frontend

```bash
# Installer les dependances npm
npm install

# Demarrer le serveur de developpement Vite
npm run dev

# Compiler l'application pour la production
npm run build

# Executer les tests unitaires et de composants
npm test -- --run

# Verifier la qualite avec ESLint
npm run lint
```
