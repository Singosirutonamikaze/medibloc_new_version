# Guide de Contribution - Backend MediBloc

Ce document presente les directives de developpement et les standards techniques specifiques au sous-projet `backend/`.

---

## 1. Regles de Codage et Architecture Backend

Toute contribution au backend doit respecter les principes architecturaux suivants :

- **Clean Architecture & Feature-Driven** : Chaque domaine clinique (`patient`, `doctor`, `appointment`, `disease`, `medicine`, `pharmacy`, `prescription`, `medicalRecord`, `user`, etc.) est isole dans `src/features/<nom>/`.
- **0 `if` / `else`** : Remplacer imperativement les conditions par des expressions ternaires ou des tables de recherche indexees (`Record<Key, Value>`).
- **0 `switch` / `case`**.
- **0 boucle imperative** (`for`, `while`, `do..while`) : Privilegier `map`, `filter`, `reduce`, `find`.
- **0 `any` / 0 `unknown`** : Typage TypeScript strict pour chaque variable, DTO, parametre et retour de fonction.
- **0 `?.` et 0 `??`** : Valider les objets et leurs champs via Zod et des gardes explicites.
- **Commentaires JSDoc en francais** avec balises obligatoires `@author SINGO Yao Dieu Donne` et `@since AAAA-MM-JJ`.
- **0 emoji** dans le code, les tests et la documentation.

---

## 2. Organisation des Tests Vitest

Les tests sont organises sous `backend/test/` de facon structuree :
- `test/controllers/` : Tests unitaires et mocks des controleurs Express.
- `test/services/` : Tests unitaires des services metier et transactions Prisma.
- `test/routes/` : Tests d'integration HTTP avec Supertest.
- `test/data/` : Jeux de donnees et fixtures TypeScript centralises (`mock-data.ts`, `index.ts`).
- `test/setup/` : Configuration globale Vitest, mocks Prisma et Express test app.

---

## 3. Commandes Makefile Utiles pour le Backend

```bash
# Afficher l'aide des commandes backend
make help

# Installer les dependances et generer Prisma
make install

# Demarrer en mode developpement avec nodemon
make dev

# Verifier la conformite du typage TypeScript
make typecheck

# Executer tous les tests Vitest
make test

# Executer uniquement une categorie de tests
make test-services
make test-controllers
make test-routes

# Generer le rapport de couverture LCOV
make test-coverage

# Audit complet (typage + tests)
make audit
```
