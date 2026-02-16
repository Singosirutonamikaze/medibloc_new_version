# Guide d'automatisation des tests

Ce document explique comment configurer les tests automatiques pour le projet MediBloc.

## Démarrage rapide

```bash
# Donner les droits d'exécution au script et le lancer
chmod +x scripts/install.sh
./scripts/install.sh
```

Le programme d'installation vous guidera étape par étape pour choisir la meilleure solution selon votre cas.

---

## Qu'est-ce que vous pouvez utiliser ?

### Les programmes que vous pouvez lancer

| Programme | À quoi ça sert | Comment l'utiliser |
| --------- | -------------- | ------------------ |
| `install.sh` | Programme qui vous aide à tout installer | `./scripts/install.sh` |
| `run-tests-periodic.sh` | Lance les tests et enregistre les résultats | `./scripts/run-tests-periodic.sh` |
| `watch-and-test.sh` | Lance les tests automatiquement quand vous modifiez le code | `./scripts/watch-and-test.sh` |

### Les exemples de configuration (dans le dossier templates/)

| Fichier | À quoi ça sert | Pour quel système |
| ------- | -------------- | ----------------- |
| `templates/cron-example.txt` | Exemple pour programmer les tests avec cron | Linux ou Mac sur votre ordinateur |
| `templates/medibloc-test.service` | Exemple pour systemd (service) | Serveurs Linux |
| `templates/medibloc-test.timer` | Exemple pour systemd (programmation) | Serveurs Linux |

---

## Les 4 façons de lancer les tests automatiquement

### Solution 1 : Cron (Linux ou Mac) - LA PLUS SIMPLE

**Quand l'utiliser :** Sur votre ordinateur ou un petit serveur personnel

**Avantages :**

- Facile à installer
- Fonctionne sur tous les systèmes Linux et Mac
- Très fiable

**Comment faire :**

```bash
# Ouvrir l'éditeur de tâches programmées
crontab -e

# Ajouter cette ligne pour lancer les tests toutes les 2 heures
0 */2 * * * cd /chemin/vers/votre/projet/backend && ./scripts/run-tests-periodic.sh
```

### Solution 2 : Systemd (Serveurs Linux professionnels)

**Quand l'utiliser :** Sur un vrai serveur Linux en production

**Avantages :**

- Parfait pour les serveurs professionnels
- Redémarre automatiquement en cas de problème
- Vous pouvez voir les logs avec les outils système

**Comment faire :**

```bash
# Créer les fichiers de configuration avec le programme d'installation
# Puis copier ces fichiers dans le système
sudo cp /tmp/medibloc-test.service /etc/systemd/system/
sudo cp /tmp/medibloc-test.timer /etc/systemd/system/

# Recharger la configuration
sudo systemctl daemon-reload

# Activer et démarrer le système de tests
sudo systemctl enable medibloc-test.timer
sudo systemctl start medibloc-test.timer

# Voir si ça marche
systemctl status medibloc-test.timer
systemctl list-timers | grep medibloc
```

### Solution 3 : GitHub Actions (Sur Internet) - LA PLUS RECOMMANDÉE

**Quand l'utiliser :** Dans tous les cas, c'est la meilleure solution

**Avantages :**

- Complètement gratuit
- Fonctionne sur Internet, pas besoin de configuration sur votre ordinateur
- Marche avec tous les services d'hébergement (Render, Vercel, etc.)

**Ce qui est déjà configuré pour vous :**

Le fichier `.github/workflows/test.yml` fait déjà tout le travail :

- Lance les tests à chaque fois que vous envoyez du code
- Lance les tests toutes les 2 heures automatiquement
- Vous n'avez rien à configurer

### Solution 4 : Mode surveillance (Pendant que vous codez)

**Quand l'utiliser :** Quand vous êtes en train de développer

**Avantages :**

- Lance les tests instantanément quand vous sauvegardez un fichier
- Vous voyez tout de suite si votre code fonctionne

**Comment faire :**

```bash
# Avec npm
npm run test:watch

# Ou avec le script
./scripts/watch-and-test.sh
```

---

## Où sont enregistrés les résultats des tests ?

### Organisation des fichiers de logs

```txt
backend/logs/
├── latest-test.log              # Le dernier résultat (toujours à jour)
├── test-20260216-140522.log     # Résultat du test de 14h05
├── test-20260216-160530.log     # Résultat du test de 16h05
└── watch-mode-20260216.log      # Résultats du mode surveillance
```

### Comment voir les résultats

```bash
# Voir les résultats en direct (se met à jour automatiquement)
tail -f logs/latest-test.log

# Voir la liste des 10 derniers tests
ls -lht logs/test-*.log | head -10

# Chercher si il y a des erreurs
grep -i error logs/latest-test.log
```

### Nettoyage automatique

Les résultats de plus de 30 jours sont effacés automatiquement pour ne pas encombrer votre disque.

---

## Que faire si ça ne marche pas ?

### Les scripts ne se lancent pas

```bash
# Vérifier si les scripts ont les bonnes permissions
ls -la scripts/

# Donner les permissions d'exécution
chmod +x scripts/*.sh
```

### Cron ne lance pas les tests

```bash
# Regarder les logs de cron pour voir ce qui se passe
grep CRON /var/log/syslog

# Ou sur certains systèmes
tail -f /var/log/cron
```

### Systemd ne démarre pas

```bash
# Voir le statut du service
systemctl status medibloc-test.service

# Voir les 50 derniers messages d'erreur
journalctl -u medibloc-test.service -n 50

# Voir si le timer est bien programmé
systemctl list-timers --all | grep medibloc
```

### Les chemins de fichiers sont incorrects

```bash
# Relancer le programme d'installation
./scripts/install.sh
```

---

## Quelle solution choisir selon votre situation ?

| Où votre projet est hébergé | Quelle solution utiliser |
| ---------------------------- | ------------------------ |
| **Render / Vercel / Railway** | GitHub Actions (c'est la seule qui marche) |
| **VPS ou serveur dédié** | Systemd ou Cron (au choix) |
| **Sur votre ordinateur en développement** | Mode surveillance (watch) |
| **AWS / Google Cloud / Azure** | GitHub Actions + programmation dans le cloud |

---

## Informations importantes à savoir

- **Portabilité :** Les scripts fonctionnent chez tous les développeurs car ils utilisent des chemins relatifs
- **Pas de pollution Git :** Les logs ne sont jamais envoyés sur Git
- **Systèmes compatibles :** Linux, macOS, Windows (seulement avec WSL)
- **Services cloud :** Si vous êtes sur Render, Vercel ou similaire, utilisez uniquement GitHub Actions
- **Besoin de bash :** Les scripts ne marchent pas avec cmd.exe de Windows

---

## Besoin d'aide ?

Si vous avez un problème, suivez ces étapes dans l'ordre :

1. Vérifiez que Node.js et npm sont bien installés sur votre système
2. Vérifiez que les scripts ont les permissions d'exécution (voir plus haut)
3. Regardez les fichiers de logs dans le dossier `logs/`
4. Relancez le script d'installation avec `./scripts/install.sh`
