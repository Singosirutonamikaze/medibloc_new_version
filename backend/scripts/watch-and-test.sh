#!/bin/bash

# Script pour surveiller les changements et exécuter build + tests automatiquement
# Ce script utilise le mode watch de vitest

# Obtenir le répertoire du script et remonter au répertoire backend
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

# Nom du fichier de log pour le mode watch
LOG_FILE="logs/watch-mode-$(date +%Y%m%d).log"

echo "===========================================" | tee -a "$LOG_FILE"
echo "Mode surveillance démarré - $(date)" | tee -a "$LOG_FILE"
echo "Les tests s'exécuteront automatiquement à chaque changement" | tee -a "$LOG_FILE"
echo "Logs enregistrés dans: $LOG_FILE" | tee -a "$LOG_FILE"
echo "===========================================" | tee -a "$LOG_FILE"

# Lancer vitest en mode watch avec logging
npm run test:watch 2>&1 | tee -a "$LOG_FILE"
