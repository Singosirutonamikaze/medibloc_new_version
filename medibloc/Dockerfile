# ------------------------------------------------------------------------------
# MediBloc Frontend - Dockerfile Multi-Stage de Production (Vite + Nginx)
# Auteur : SINGO Yao Dieu Donne
# Date   : 2026-09-17
# ------------------------------------------------------------------------------

# Étape 1 : Installation des dépendances
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Étape 2 : Compilation des assets React avec Vite
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Étape 3 : Serveur Nginx léger pour servir les fichiers statiques compilés
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
