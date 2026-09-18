# Guide des Tests et Qualite - MediBloc Web

## 1. Outils de Test

Le frontend MediBloc utilise **Vitest** et **React Testing Library** pour ses suites de tests unitaires et d'integration de composants.

---

## 2. Commandes de Test

```bash
# Executer tous les tests en mode unitaire unique
npm run test -- --run

# Executer les tests avec interface de surveillance (watch)
npm run test

# Executer les tests avec rapport de couverture
npm run test:coverage
```

---

## 3. Bonnes Pratiques de Redaction des Tests

- Placer les fichiers de test directement a cote du composant concerne (`Composant.test.tsx`).
- Simuler les interactions utilisateur en utilisant les roles semantiques (`screen.getByRole('button', ...)`).
- Mocker systematiquement les modules d'effets reseau (`axios`) et les contextes globaux (`AuthContext`).
- Valider le comportement aux limites (etats de chargement, affichage des messages d'erreur).
