# Guide des Tests et Assurance Qualite - MediBloc Backend

## 1. Vue d'Ensemble

La qualite logicielle du backend MediBloc est assuree par une suite de tests unitaires et d'integration utilisant **Vitest** et **Supertest**. Chaque fonctionnalite metier est testee a travers sa couche de service et ses points d'entree d'API.

---

## 2. Commandes Disponibles

```bash
# Lancement de tous les tests en execution unique (Mode CI)
npm run test:run

# Lancement en mode surveillance continue (Developpement)
npm run test:watch

# Generation du rapport complet de couverture de code
npm run test:coverage

# Ouverture de l'interface graphique Vitest UI
npm run test:ui

# Execution avec enregistrement horodate des resultats dans logs/
npm run test:log
```

---

## 3. Regles pour les Nouveaux Tests

Tout nouveau test redige doit respecter les criteres suivants :

1. **Isolation stricte** : Aucun test ne doit dependre de l'ordre d'execution ni de donnees residuelles d'un autre test.
2. **Couverture des cas nominaux et d'erreur** : Chaque service et controleur doit valider les reponses de succes (200 / 201), les refus de validation (400) et les ressources introuvables (404).
3. **Respect des regles de code** : Aucun usage de `any`, `unknown`, `if`, `switch` ou boucle imperative dans le code des tests.
4. **Langue francaise** : Les descriptions de suites (`describe`) et de cas de test (`it`) doivent etre formulees clairement en francais.

---

## 4. Integration Continue (CI)

Le pipeline GitHub Actions valide a chaque soumission :
1. L'absence d'erreurs de typage statique (`npx tsc --noEmit`).
2. L'absence de failles de dependances (`npm audit`).
3. Le succes de 100% des tests de la suite (`npm run test:run`).
