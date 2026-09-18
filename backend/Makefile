# ------------------------------------------------------------------------------
# MediBloc Backend - Automatisation et Commandes de Developpement
# Auteur : SINGO Yao Dieu Donne
# Date   : 2026-09-17
# ------------------------------------------------------------------------------

.PHONY: help install dev build start test test-controllers test-routes test-services test-watch test-coverage test-ui test-log prisma-generate prisma-migrate prisma-studio prisma-seed typecheck lint lint-fix clean audit docker-build docker-up docker-down docker-logs

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

help: ## cette commande [make help] permet d'afficher l'aide interactive et la liste de toutes les commandes disponibles
	@printf "\n$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n"
	@printf "$(BOLD)$(CYAN)  MediBloc Backend - Guide des Commandes$(RESET)\n"
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

install: ## cette commande [make install] permet d'installer les dependances npm et generer le client Prisma
	@printf "$(CYAN)Installation des dependances du backend...$(RESET)\n"
	npm install

# --- Developpement ---

dev: ## cette commande [make dev] permet de demarrer le serveur backend en mode developpement avec rechargement a chaud
	@printf "$(GREEN)Demarrage du serveur de developpement...$(RESET)\n"
	npm run dev

# --- Compilation et Production ---

build: ## cette commande [make build] permet de compiler le code TypeScript et generer le client Prisma pour la production
	@printf "$(BLUE)Compilation du backend en cours...$(RESET)\n"
	npm run build

start: ## cette commande [make start] permet de demarrer le serveur en mode production a partir des fichiers compiles dist
	@printf "$(GREEN)Lancement du serveur de production...$(RESET)\n"
	npm run start

# --- Qualite et Typage ---

typecheck: ## cette commande [make typecheck] permet de verifier la conformite des types TypeScript sans emission de fichiers JS
	@printf "$(BLUE)Verification des types TypeScript...$(RESET)\n"
	npx tsc --noEmit

lint: ## cette commande [make lint] permet d'analyser le code avec ESLint selon les regles strictes du projet
	@printf "$(BLUE)Verification du code avec ESLint...$(RESET)\n"
	npm run lint

lint-fix: ## cette commande [make lint-fix] permet de corriger automatiquement les erreurs et avertissements ESLint
	@printf "$(BLUE)Correction automatique ESLint...$(RESET)\n"
	npm run lint:fix

# --- Tests et Couverture ---

test: ## cette commande [make test] permet d'executer l'integralite de la suite de tests Vitest
	@printf "$(CYAN)Execution de tous les tests Vitest...$(RESET)\n"
	npm run test:run

test-controllers: ## cette commande [make test-controllers] permet d'executer uniquement les tests unitaires des controleurs HTTP
	@printf "$(CYAN)Execution des tests de controleurs...$(RESET)\n"
	npm run test:controllers

test-routes: ## cette commande [make test-routes] permet d'executer uniquement les tests d'integration des routes de l'API
	@printf "$(CYAN)Execution des tests de routes...$(RESET)\n"
	npm run test:routes

test-services: ## cette commande [make test-services] permet d'executer uniquement les tests unitaires des services metier
	@printf "$(CYAN)Execution des tests de services...$(RESET)\n"
	npm run test:services

test-watch: ## cette commande [make test-watch] permet d'executer les tests en continu et reagir aux modifications de fichiers
	@printf "$(CYAN)Lancement des tests en mode surveillance...$(RESET)\n"
	npm run test:watch

test-coverage: ## cette commande [make test-coverage] permet de generer le rapport detaille de couverture de code (LCOV, HTML, JSON)
	@printf "$(CYAN)Generation du rapport de couverture...$(RESET)\n"
	npm run test:coverage

test-ui: ## cette commande [make test-ui] permet d'ouvrir l'interface graphique interactive Vitest UI dans le navigateur
	@printf "$(CYAN)Ouverture de Vitest UI...$(RESET)\n"
	npm run test:ui

test-log: ## cette commande [make test-log] permet d'executer les tests et archiver les resultats detailles dans logs/
	@printf "$(CYAN)Execution des tests avec archivage des logs...$(RESET)\n"
	npm run test:log

# --- Base de Donnees et Prisma ---

prisma-generate: ## cette commande [make prisma-generate] permet de generer le client d'acces aux donnees Prisma type
	@printf "$(BLUE)Generation du client Prisma...$(RESET)\n"
	npm run prisma:generate

prisma-migrate: ## cette commande [make prisma-migrate] permet d'appliquer les migrations Prisma sur la base de donnees
	@printf "$(YELLOW)Application des migrations Prisma...$(RESET)\n"
	npm run prisma:migrate

prisma-studio: ## cette commande [make prisma-studio] permet d'ouvrir l'explorateur visuel de donnees Prisma Studio
	@printf "$(GREEN)Ouverture de Prisma Studio...$(RESET)\n"
	npm run prisma:studio

prisma-seed: ## cette commande [make prisma-seed] permet d'inserer le jeu initial de donnees cliniques de demonstration
	@printf "$(YELLOW)Alimentation initiale de la base de donnees...$(RESET)\n"
	npm run prisma:seed

# --- Docker Conteneurs ---

docker-build: ## cette commande [make docker-build] permet de construire l'image Docker de production du backend
	@printf "$(BLUE)Construction de l'image Docker backend...$(RESET)\n"
	docker build -t medibloc-backend:latest -f docker/Dockerfile .

docker-up: ## cette commande [make docker-up] permet de demarrer le backend et sa base PostgreSQL via docker/docker-compose.yml
	@printf "$(GREEN)Lancement du conteneur backend et postgres...$(RESET)\n"
	cd docker && docker compose up -d

docker-down: ## cette commande [make docker-down] permet d'arreter les conteneurs backend et postgres
	@printf "$(YELLOW)Arret des conteneurs backend...$(RESET)\n"
	cd docker && docker compose down

docker-logs: ## cette commande [make docker-logs] permet d'afficher les logs des conteneurs backend en direct
	@printf "$(CYAN)Affichage des logs Docker backend...$(RESET)\n"
	cd docker && docker compose logs -f

# --- Nettoyage et Maintenance ---

clean: ## cette commande [make clean] permet de supprimer les artefacts de compilation dist, logs et couverture
	@printf "$(YELLOW)Nettoyage des artefacts dist, logs et coverage...$(RESET)\n"
	rm -rf dist coverage logs/*.log logs/*.json .nyc_output

audit: typecheck test ## cette commande [make audit] permet d'effectuer un controle qualite complet combinant typage TypeScript et tests Vitest
	@printf "$(GREEN)Audit complet du backend valide avec succes !$(RESET)\n"
