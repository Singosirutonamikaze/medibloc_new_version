# Guide des Messages de Commit

Pour maintenir un historique Git propre, compréhensible et facile à parcourir, le projet MediBloc impose l'utilisation des conventions de commits conventionnels (Conventional Commits).

## Format Général du Message

Le message doit respecter la structure suivante :

```text
<type>(<scope>): <description>

[corps optionnel décrivant les détails du changement]

[pied de page optionnel indiquant les tickets associés]
```

Exemple :
`feat(medical-records): ajouter la modal de consultation des dossiers cliniques`

## Les Types de Commit Autorisés

| Type | Description |
| --- | --- |
| `feat` | Ajout d'une nouvelle fonctionnalité de l'application. |
| `fix` | Correction d'un bug ou d'un comportement inattendu. |
| `docs` | Modifications apportées uniquement aux fichiers de documentation (Markdown). |
| `style` | Changements de mise en page ou de style sans incidence sur la logique (Tailwind, CSS). |
| `refactor` | Modification du code qui n'ajoute pas de fonctionnalité et ne corrige pas de bug. |
| `perf` | Changement de code destiné à améliorer les performances de rendu ou d'exécution. |
| `test` | Ajout de nouveaux tests unitaires ou d'intégration ou modification de tests existants. |
| `build` | Changements affectant le système de build, les scripts npm ou les dépendances. |
| `ci` | Modifications des fichiers de configuration d'intégration continue (GitHub Actions). |
| `chore` | Tâches de maintenance courantes, configuration d'outils, etc. |

## Règles Importantes

1. **Pas d'émoji** : N'utilisez aucun émoji dans les messages de commit, y compris dans le titre et le corps du texte.
2. **Clarté du Scope** : Précisez le scope (le module ou composant concerné) entre parenthèses pour cibler la modification (ex: `auth`, `invoices`, `appointments`).
3. **Description concise** : Rédigez le titre à l'infinitif ou au présent de l'indicatif en minuscules, sans point final.
4. **Corps explicatif** : Pour les modifications complexes ou impactantes, utilisez le corps du message pour expliquer le "pourquoi" et non le "comment".

## Modèle de Fichier de Commit (.gitmessage)

Vous pouvez configurer Git pour charger automatiquement ce modèle lors de chaque commit. Créez un fichier `.gitmessage` à la racine de votre projet avec le contenu suivant, puis configurez-le avec `git config commit.template .gitmessage` :

```text
# <type>(<scope>): <description courte en minuscules et sans point>
#
# Exemples de types : feat, fix, docs, style, refactor, test, chore
# Exemples de scopes : auth, medical-records, discussions, invoices, navigation
#
# ----------------------------------------------------------------------
# Corps du message (Optionnel, séparez par une ligne vide) :
# - Pourquoi ce changement est nécessaire
# - Comment il résout le problème
# - Différences avec le comportement précédent
#
# ----------------------------------------------------------------------
# Pied de page (Optionnel, séparez par une ligne vide) :
# - Référence du ticket ou de la Pull Request (ex: Closes #123)
```
