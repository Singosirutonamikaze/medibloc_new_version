# ------------------------------------------------------------------------------
# MediBloc Projet - Automatisation Globale Backend & Frontend
# Auteur : SINGO Yao Dieu Donne
# Date   : 2026-09-17
# ------------------------------------------------------------------------------

.PHONY: help install install-backend install-frontend dev dev-backend dev-frontend build build-backend build-frontend test test-backend test-frontend test-controllers test-routes test-services audit clean prisma-generate prisma-migrate prisma-studio prisma-seed docker-backend-up docker-backend-down docker-frontend-up docker-frontend-down

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

help: ## cette commande [make help] permet d'afficher l'aide interactive et la liste de toutes les commandes du projet
	@printf "\n$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n"
	@printf "$(BOLD)$(CYAN)  MediBloc Monorepo - Guide des Commandes$(RESET)\n"
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
			printf "    \033[1;32m%-22s\033[0m \033[0;37m%s\033[0m\n", $$1, desc; \
		} \
	' $(MAKEFILE_LIST)
	@printf "\n$(BLUE)-----------------------------------------------------------------------------------------$(RESET)\n\n"

# --- Installation ---

install: install-backend install-frontend ## cette commande [make install] permet d'installer toutes les dependances du backend et du frontend

install-backend: ## cette commande [make install-backend] permet d'installer les modules npm du backend et generer le client Prisma
	@printf "$(CYAN)Installation des dependances du backend...$(RESET)\n"
	cd backend && npm install

install-frontend: ## cette commande [make install-frontend] permet d'installer les modules npm de l'application frontend React
	@printf "$(CYAN)Installation des dependances du frontend...$(RESET)\n"
	cd medibloc && npm install

# --- Developpement ---

dev-backend: ## cette commande [make dev-backend] permet de demarrer le serveur backend en mode developpement avec rechargement a chaud
	@printf "$(GREEN)Demarrage du backend de developpement...$(RESET)\n"
	cd backend && npm run dev

dev-frontend: ## cette commande [make dev-frontend] permet de demarrer l'application frontend en mode developpement avec Vite
	@printf "$(GREEN)Demarrage du frontend de developpement...$(RESET)\n"
	cd medibloc && npm run dev

# --- Compilation et Production ---

build: build-backend build-frontend ## cette commande [make build] permet de compiler a la fois le backend et le frontend pour la production

build-backend: ## cette commande [make build-backend] permet de compiler le code TypeScript du backend en fichiers JavaScript de production
	@printf "$(BLUE)Compilation du backend...$(RESET)\n"
	cd backend && npm run build

build-frontend: ## cette commande [make build-frontend] permet de compiler et minifier l'application React pour la production
	@printf "$(BLUE)Compilation du frontend...$(RESET)\n"
	cd medibloc && npm run build

# --- Tests et Validation ---

test: test-backend test-frontend ## cette commande [make test] permet d'executer toutes les suites de tests du backend et du frontend

test-backend: ## cette commande [make test-backend] permet d'executer la totalite des tests unitaires et d'integration du backend
	@printf "$(CYAN)Execution des tests du backend...$(RESET)\n"
	cd backend && npm run test:run

test-controllers: ## cette commande [make test-controllers] permet d'executer uniquement les tests des controleurs du backend
	@printf "$(CYAN)Execution des tests de controleurs...$(RESET)\n"
	cd backend && npm run test:controllers

test-routes: ## cette commande [make test-routes] permet d'executer uniquement les tests d'integration des routes du backend
	@printf "$(CYAN)Execution des tests de routes...$(RESET)\n"
	cd backend && npm run test:routes

test-services: ## cette commande [make test-services] permet d'executer uniquement les tests unitaires des services metier du backend
	@printf "$(CYAN)Execution des tests de services...$(RESET)\n"
	cd backend && npm run test:services

test-frontend: ## cette commande [make test-frontend] permet d'executer l'ensemble des tests du frontend React
	@printf "$(CYAN)Execution des tests du frontend...$(RESET)\n"
	cd medibloc && npm test -- --run

audit: ## cette commande [make audit] permet d'effectuer un audit complet du backend validant les types TypeScript et les tests
	@printf "$(BLUE)Audit de conformite du backend...$(RESET)\n"
	cd backend && npx tsc --noEmit && npm run test:run
	@printf "$(GREEN)Audit valide avec succes !$(RESET)\n"

# --- Base de Donnees et Prisma ---

prisma-generate: ## cette commande [make prisma-generate] permet de regenerer les types du client Prisma pour le backend
	cd backend && npm run prisma:generate

prisma-migrate: ## cette commande [make prisma-migrate] permet d'appliquer les migrations de la base de donnees du backend
	cd backend && npm run prisma:migrate

prisma-studio: ## cette commande [make prisma-studio] permet d'ouvrir l'explorateur de base de donnees Prisma Studio
	cd backend && npm run prisma:studio

prisma-seed: ## cette commande [make prisma-seed] permet d'alimenter la base de donnees avec les donnees cliniques initiales
	cd backend && npm run prisma:seed

# --- Docker Conteneurs ---

docker-backend-up: ## cette commande [make docker-backend-up] permet de demarrer le backend et postgres via backend/docker
	@printf "$(GREEN)Lancement des conteneurs backend...$(RESET)\n"
	cd backend/docker && docker compose up -d

docker-backend-down: ## cette commande [make docker-backend-down] permet d'arreter les conteneurs backend et postgres
	@printf "$(YELLOW)Arret des conteneurs backend...$(RESET)\n"
	cd backend/docker && docker compose down

docker-frontend-up: ## cette commande [make docker-frontend-up] permet de demarrer le conteneur frontend via medibloc/docker
	@printf "$(GREEN)Lancement du conteneur frontend...$(RESET)\n"
	cd medibloc/docker && docker compose up -d

docker-frontend-down: ## cette commande [make docker-frontend-down] permet d'arreter le conteneur frontend
	@printf "$(YELLOW)Arret du conteneur frontend...$(RESET)\n"
	cd medibloc/docker && docker compose down

# --- Qualite et Typage Frontend ---

typecheck-frontend: ## cette commande [make typecheck-frontend] permet de verifier les types TypeScript du frontend
	@printf "$(BLUE)Verification des types TypeScript du frontend...$(RESET)\n"
	cd medibloc && npx tsc -b --noEmit

lint-frontend: ## cette commande [make lint-frontend] permet d'analyser le code source frontend avec ESLint
	@printf "$(BLUE)Verification du code frontend avec ESLint...$(RESET)\n"
	cd medibloc && npm run lint

# --- Nettoyage et Maintenance ---

clean: ## cette commande [make clean] permet de supprimer l'ensemble des fichiers compiles, logs et rapports de couverture
	@printf "$(YELLOW)Nettoyage global des artefacts...$(RESET)\n"
	rm -rf backend/dist backend/coverage backend/logs/*.log backend/logs/*.json medibloc/dist medibloc/coverage

