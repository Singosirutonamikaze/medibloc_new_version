# Guide de Contribution - MediBloc Backend

## 1. Principes Generaux et Regles de Code Obligatoires

Toute contribution au backend MediBloc doit satisfaire a l'ensemble des regles de developpement fonctionnel et declaratif pur :

- **Interdiction formelle des structures conditionnelles** : Aucun mot-cle `if` ou `switch` dans le code. Utiliser des tables de routage, des dictionnaires et des compositions de fonctions pures.
- **Interdiction formelle des boucles imperatives** : Aucun `for` ou `while`. Utiliser les operateurs fonctionnels de tableau (`map`, `filter`, `reduce`, `flatMap`, `find`).
- **Typage statique integral** : Proscription absolue de `any` et `unknown`. Tous les types doivent etre explicites.
- **Garantie de non-nullite** : Proscription des operateurs `?.` et `??`. Les donnees sont validees et garanties conformes des l'entree du flux applicatif.
- **Architecture par fonctionnalite** : Tout nouveau fichier doit etre place dans le sous-dossier correspondant a sa responsabilite au sein de sa feature (`controllers/`, `services/`, `routes/`, `validations/`, `interfaces/`, `types/`, `dtos/`, `graphql/`).
- **Zero emoji** : Les emojis sont strictement interdits dans le code, les logs et la documentation.
- **Langue francaise** : Toute la documentation, les messages d'erreurs metier et les commentaires doivent etre rediges en francais.

---

## 2. Processus de Developpement

### 2.1 Cloner et preparer l'environnement
```bash
# Cloner le repertoire
git clone https://github.com/votre-orga/medibloc.git
cd medibloc/backend

# Installer les dependances
npm ci

# Generer le client Prisma
npx prisma generate

# Copier et renseigner les variables d'environnement
cp .env.example .env

# Executer les migrations
npx prisma migrate dev
```

### 2.2 Strategie de Branches Git
Toute nouvelle contribution s'effectue sur une branche thematique :

- `feature/nom-de-la-fonctionnalite` : Nouvelle fonctionnalite
- `fix/nom-du-correctif` : Correction de bug
- `refactor/nom-du-refactoring` : Restructuration sans impact fonctionnel
- `test/nom-du-test` : Ajout de tests automatisés
- `docs/nom-de-la-documentation` : Mise a jour documentaire

---

## 3. Format des Messages de Commit (Conventional Commits)

Format obligatoire :
```txt
<type>(<portee>): <description concise en francais>
```

Types autorises :
- `feat` : Ajout d'une fonctionnalite
- `fix` : Correction d'un bug
- `docs` : Modification de la documentation
- `refactor` : Modification du code sans ajout ni correction
- `test` : Ajout ou correction de tests
- `chore` : Taches d'infrastructure, dependances ou configuration

Exemples :
```bash
feat(auth): ajout du service d'authentification sans conditionnelle
fix(appointment): correction de la validation des plages horaires
test(patient): ajout des tests unitaires de creation de profil
```

---

## 4. Checklist Avant Toute Soumission de Pull Request

Avant de soumettre une modification pour revue :

1. **Verification de la compilation et du typage strict** :
   ```bash
   npx tsc --noEmit
   ```
2. **Execution de la suite de tests** :
   ```bash
   npm run test:run
   ```
3. **Controle de conformite** :
   - Aucun `any` ni `unknown` dans les fichiers ajoutes ou modifies.
   - Aucun `if` ni `switch` ni boucle imperatrice.
   - Aucun `?.` ni `??`.
   - Aucun emoji.
   - Fichiers ranges dans leurs sous-dossiers respectifs.
   - Aucun secret ou fichier d'environnement commite.
