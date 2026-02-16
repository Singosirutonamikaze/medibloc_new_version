#!/bin/bash

# Script pour exécuter les tests périodiquement avec logging
# Ce script est conçu pour être exécuté par cron ou systemd timer

# Obtenir le répertoire du script et remonter au répertoire backend
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

# Générer un nom de fichier avec timestamp
LOG_FILE="logs/test-$(date +%Y%m%d-%H%M%S).log"

# Message de début
echo "===========================================" >> "$LOG_FILE"
echo "Tests automatiques - $(date)" >> "$LOG_FILE"
echo "===========================================" >> "$LOG_FILE"

# Exécuter les tests et capturer la sortie
npm run test:run >> "$LOG_FILE" 2>&1
TEST_EXIT_CODE=$?

# Message de fin
echo "" >> "$LOG_FILE"
echo "===========================================" >> "$LOG_FILE"
echo "Tests terminés - $(date)" >> "$LOG_FILE"
echo "Code de sortie: $TEST_EXIT_CODE" >> "$LOG_FILE"
echo "===========================================" >> "$LOG_FILE"

# Nettoyer les anciens logs (garder les 30 derniers jours)
find logs/ -name "test-*.log" -mtime +30 -delete

# Créer un lien symbolique vers le dernier log
ln -sf "$(basename "$LOG_FILE")" logs/latest-test.log

exit $TEST_EXIT_CODE
