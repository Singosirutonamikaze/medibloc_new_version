# ------------------------------------------------------------------------------
# MediBloc Frontend - Automatisation et Commandes de Developpement
# Auteur : SINGO Yao Dieu Donne
# Date   : 2026-09-17
# ------------------------------------------------------------------------------

.PHONY: help install dev build preview test test-run test-watch test-coverage test-ui lint typecheck clean docker-build docker-up docker-down docker-logs

# Couleurs ANSI
BLUE    := \033[1;34m
CYAN    := \033[1;36m
GREEN   := \033[1;32m
YELLOW  := \033[1;33m
MAGENTA := \033[1;35m
WHITE   := \033[0;37m
BOLD    := \033[1m
RESET   := \033[0m

# --- General ---

help: ## cette commande [make help] permet d'afficher l'aide interactive et la liste des commandes frontend
	@printf "\n$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n"
	@printf "$(BOLD)$(CYAN)  MediBloc Frontend - Guide des Commandes$(RESET)\n"
	@printf "$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n"
	@awk ' \
		BEGIN {FS = ":.*?## "} \
		/^# --- (.*) ---/ { \
			section = substr($$0, 7, length($$0) - 10); \
			printf "\n\033[1;36m  [ " toupper(section) " ]\033[0m\n\n"; \
		} \
		/^[a-zA-Z_-]+:.*?## / { \
			desc = $$2; \
			gsub(/\[make [^]]+\]/, "\033[1;33m&\033[0;37m", desc); \
			printf "    \033[1;32m%-20s\033[0m \033[0;37m%s\033[0m\n", $$1, desc; \
		} \
	' $(MAKEFILE_LIST)
	@printf "\n$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n\n"

# --- Installation ---

install: ## cette commande [make install] permet d'installer les dependances npm du frontend
	@printf "$(CYAN)Installation des dependances du frontend...$(RESET)\n"
	npm install

# --- Developpement ---

dev: ## cette commande [make dev] permet de demarrer le serveur de developpement local avec Vite (HMR)
	@printf "$(GREEN)Demarrage du serveur frontend Vite...$(RESET)\n"
	npm run dev

preview: ## cette commande [make preview] permet de previsualiser en local le build de production
	@printf "$(CYAN)Lancement du serveur de previsualisation Vite...$(RESET)\n"
	npm run preview

# --- Compilation et Production ---

build: ## cette commande [make build] permet de compiler l'application React et minifier les assets pour la production
	@printf "$(BLUE)Compilation du frontend en cours...$(RESET)\n"
	npm run build

# --- Qualite et Typage ---

typecheck: ## cette commande [make typecheck] permet de verifier les types TypeScript avec le compilateur tsc
	@printf "$(BLUE)Verification des types TypeScript du frontend...$(RESET)\n"
	npx tsc -b --noEmit

lint: ## cette commande [make lint] permet d'analyser le code source avec ESLint
	@printf "$(BLUE)Verification du code frontend avec ESLint...$(RESET)\n"
	npm run lint

# --- Tests et Couverture ---

test: ## cette commande [make test] permet d'executer la suite de tests unitaires Vitest une seule fois
	@printf "$(CYAN)Execution des tests frontend...$(RESET)\n"
	npm run test -- --run

test-watch: ## cette commande [make test-watch] permet d'executer les tests en continu avec rechargement automatique
	@printf "$(CYAN)Lancement des tests frontend en mode surveillance...$(RESET)\n"
	npm run test

test-coverage: ## cette commande [make test-coverage] permet de generer le rapport de couverture de code
	@printf "$(CYAN)Generation du rapport de couverture frontend...$(RESET)\n"
	npm run test:coverage

test-ui: ## cette commande [make test-ui] permet d'ouvrir l'interface graphique interactive Vitest UI
	@printf "$(CYAN)Ouverture de Vitest UI pour le frontend...$(RESET)\n"
	npm run test:ui

# --- Docker Conteneurs ---

docker-build: ## cette commande [make docker-build] permet de construire l'image Docker de production Nginx du frontend
	@printf "$(BLUE)Construction de l'image Docker frontend...$(RESET)\n"
	docker build -t medibloc-frontend:latest -f docker/Dockerfile .

docker-up: ## cette commande [make docker-up] permet de demarrer le conteneur frontend via docker/docker-compose.yml
	@printf "$(GREEN)Lancement du conteneur frontend Nginx...$(RESET)\n"
	cd docker && docker compose up -d

docker-down: ## cette commande [make docker-down] permet d'arreter le conteneur frontend
	@printf "$(YELLOW)Arret du conteneur frontend...$(RESET)\n"
	cd docker && docker compose down

docker-logs: ## cette commande [make docker-logs] permet d'afficher les logs du conteneur frontend en direct
	@printf "$(CYAN)Affichage des logs Docker frontend...$(RESET)\n"
	cd docker && docker compose logs -f

# --- Nettoyage et Maintenance ---

clean: ## cette commande [make clean] permet de supprimer les artefacts de compilation dist et coverage
	@printf "$(YELLOW)Nettoyage des artefacts dist et coverage du frontend...$(RESET)\n"
	rm -rf dist coverage
