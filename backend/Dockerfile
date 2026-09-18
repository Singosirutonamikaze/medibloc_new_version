# ------------------------------------------------------------------------------
# MediBloc Backend - Dockerfile Multi-Stage de Production
# Auteur : SINGO Yao Dieu Donne
# Date   : 2026-09-17
# ------------------------------------------------------------------------------

# Étape 1 : Image de base avec les dépendances système
FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat dumb-init
WORKDIR /app

# Étape 2 : Installation des dépendances complètes
FROM base AS dependencies
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# Étape 3 : Compilation du code source TypeScript
FROM dependencies AS builder
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build
RUN npx prisma generate

# Étape 4 : Image d'exécution finale légère et sécurisée
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

# Création des répertoires de persistance et permissions utilisateur non-root
RUN mkdir -p /app/logs /app/uploads && chown -R node:node /app

WORKDIR /app

# Copie des modules de production et des binaires compilés
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node package.json ./

# Basculer vers l'utilisateur non-root pour des raisons de sécurité
USER node

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
