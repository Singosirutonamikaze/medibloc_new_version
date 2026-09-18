# Guide de Contribution et Revue de Code - MediBloc Web

## 1. Flux de Developpement Git

- Creer une branche thematique a partir de `main` : `feature/nom-fonctionnalite`, `fix/nom-correctif`, `refactor/nom-refactoring`, `test/nom-test`, `docs/nom-docs`.
- Respecter scrupuleusement la convention des **Conventional Commits** : `feat(scope): description`, `fix(scope): description`, `docs(scope): description`, etc.
- **Zero emoji** dans les messages de commit, titres de PR et code source.

---

## 2. Modele de Message de Commit (.gitmessage)

```text
<type>(<portee>): <description concise en francais>

[corps optionnel explicatif : pourquoi le changement est necessaire]

[pied de page optionnel : references tickets ou PR, ex: Closes #123]
```

### Types autorises :
- `feat` : Ajout d'une fonctionnalite utilisateur.
- `fix` : Correction d'une anomalie.
- `docs` : Documentation uniquement.
- `style` : Changement de formatage/style sans modification de logique.
- `refactor` : Restructuration sans ajout ni correction.
- `perf` : Optimisation de performance.
- `test` : Ajout ou retouche de tests.
- `build` / `ci` : Modifications de build ou d'actions GitHub.
- `chore` : Taches d'infrastructure et dependances.

---

## 3. Validation Locale Prealable

Avant d'ouvrir une Pull Request, executez :

```bash
# 1. Verification lint et typage strict
npm run lint

# 2. Execution de tous les tests unitaires
npm run test -- --run

# 3. Compilation des assets de production
npm run build
```

---

## 4. Checklist de Revue de Code (Code Review)

Avant de valider ou de soumettre une Pull Request :

1. **Validation Fonctionnelle et Metier** :
   - Les besoins du ticket sont-ils integralement couverts ?
   - L'interface s'adapte-t-elle correctement sur mobile, tablette et ecran large ?
   - Les reponses d'erreur API (`401`, `403`, `500`) sont-elles convenablement interceptees et notifiees ?

2. **Architecture et Structure** :
   - Respect de l'organisation Atomic Design (`atoms/`, `molecules/`, `organisms/`, `layout/`).
   - Importations conformes via les fichiers barrels (`index.ts`).

3. **Purete React 19 et Typage** :
   - Proprietes (`Props`) declarees en `readonly`.
   - Phases de rendu pures sans effets secondaires (`Date.now()`, etc.).
   - Aucun appel d'etat synchrone (`setState`) au sein de `useEffect`.
   - Typage TypeScript exhaustif : aucun `any`, aucun `unknown`, aucune assertion `!`.

4. **Accessibilite (a11y)** :
   - Tous les champs de formulaire relient `<label htmlFor="...">` a `<input id="...">`.
   - Tous les `<button>` portent un `type="button"` ou `type="submit"` explicite.
   - Toutes les images disposent d'un attribut `alt`.

5. **Tracabilite et CI** :
   - La contribution est enregistree dans [`docs/historique.md`](../historique.md).
   - Les tests unitaires de composants (`.test.tsx`) sont ajoutes ou mis a jour.
   - Le pipeline d'integration continue GitHub Actions est valide.
