#!/bin/bash

# Script d'installation pour configurer les tests automatiques
# Ce script aide à configurer cron ou systemd selon votre environnement

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Obtenir le répertoire du projet
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Installation des tests automatiques${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "Répertoire du projet: ${GREEN}$PROJECT_DIR${NC}"
echo ""

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}ERREUR: npm n'est pas installé${NC}"
    exit 1
fi

# Rendre les scripts exécutables
echo -e "${YELLOW}Configuration des permissions...${NC}"
chmod +x "$SCRIPT_DIR"/*.sh
echo -e "${GREEN}[OK] Permissions configurées${NC}"
echo ""

# Proposer les options d'installation
echo -e "${BLUE}Choisissez votre méthode d'installation:${NC}"
echo -e "  ${GREEN}1${NC}) Cron (recommandé pour Linux/Mac)"
echo -e "  ${GREEN}2${NC}) Systemd Timer (pour serveurs Linux)"
echo -e "  ${GREEN}3${NC}) Script manuel (tester maintenant)"
echo -e "  ${GREEN}4${NC}) Mode watch (développement)"
echo -e "  ${GREEN}5${NC}) GitHub Actions uniquement (cloud)"
echo -e "  ${GREEN}6${NC}) Annuler"
echo ""
read -p "Votre choix [1-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}[CRON] Installation Cron${NC}"
        echo ""
        echo "Ajoutez cette ligne à votre crontab (crontab -e):"
        echo ""
        echo -e "${GREEN}0 */2 * * * cd $PROJECT_DIR && ./scripts/run-tests-periodic.sh${NC}"
        echo ""
        read -p "Voulez-vous ouvrir crontab maintenant? [y/N]: " open_cron
        if [[ $open_cron =~ ^[Yy]$ ]]; then
            crontab -e
        fi
        ;;
    
    2)
        echo ""
        echo -e "${YELLOW}[SYSTEMD] Installation Systemd${NC}"
        echo ""
        
        # Créer les fichiers temporaires avec les bons chemins
        SERVICE_FILE="/tmp/medibloc-test.service"
        TIMER_FILE="/tmp/medibloc-test.timer"
        
        cat > "$SERVICE_FILE" << EOF
[Unit]
Description=MediBloc Backend Tests
After=network.target

[Service]
Type=oneshot
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/bin/bash $PROJECT_DIR/scripts/run-tests-periodic.sh
StandardOutput=append:$PROJECT_DIR/logs/systemd-test.log
StandardError=append:$PROJECT_DIR/logs/systemd-test-error.log

[Install]
WantedBy=multi-user.target
EOF
        
        cp "$SCRIPT_DIR/templates/medibloc-test.timer" "$TIMER_FILE"
        
        echo "Fichiers générés dans /tmp/"
        echo ""
        echo "Exécutez ces commandes:"
        echo ""
        echo -e "${GREEN}sudo cp $SERVICE_FILE /etc/systemd/system/${NC}"
        echo -e "${GREEN}sudo cp $TIMER_FILE /etc/systemd/system/${NC}"
        echo -e "${GREEN}sudo systemctl daemon-reload${NC}"
        echo -e "${GREEN}sudo systemctl enable medibloc-test.timer${NC}"
        echo -e "${GREEN}sudo systemctl start medibloc-test.timer${NC}"
        echo ""
        ;;
    
    3)
        echo ""
        echo -e "${YELLOW}[TEST] Exécution des tests...${NC}"
        echo ""
        cd "$PROJECT_DIR"
        ./scripts/run-tests-periodic.sh
        echo ""
        echo -e "${GREEN}[OK] Tests terminés${NC}"
        echo -e "Logs disponibles dans: ${BLUE}$PROJECT_DIR/logs/latest-test.log${NC}"
        ;;
    
    4)
        echo ""
        echo -e "${YELLOW}[WATCH] Démarrage du mode watch...${NC}"
        echo ""
        cd "$PROJECT_DIR"
        ./scripts/watch-and-test.sh
        ;;
    
    5)
        echo ""
        echo -e "${YELLOW}[GITHUB] GitHub Actions${NC}"
        echo ""
        if [ -f "$PROJECT_DIR/../.github/workflows/test.yml" ]; then
            echo -e "${GREEN}[OK] Workflow GitHub Actions déjà configuré${NC}"
            echo ""
            echo "Le workflow exécutera les tests:"
            echo "  - À chaque push sur main/develop"
            echo "  - À chaque pull request"
            echo "  - Toutes les 2 heures automatiquement"
            echo ""
            echo "Committez et poussez les changements pour activer le workflow."
        else
            echo -e "${RED}[ERREUR] Fichier workflow non trouvé${NC}"
            echo "Le workflow devrait être dans: .github/workflows/test.yml"
        fi
        ;;
    
    6)
        echo ""
        echo -e "${YELLOW}Installation annulée${NC}"
        exit 0
        ;;
    
    *)
        echo ""
        echo -e "${RED}[ERREUR] Choix invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}[OK] Installation terminée${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "Commandes utiles:"
echo -e "  - ${GREEN}npm run test${NC} - Lancer les tests"
echo -e "  - ${GREEN}npm run test:watch${NC} - Mode surveillance"
echo -e "  - ${GREEN}npm run test:log${NC} - Tests avec logs"
echo -e "  - ${GREEN}tail -f logs/latest-test.log${NC} - Voir les logs"
echo ""
