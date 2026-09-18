# Guide de Deploiement - MediBloc Backend

## 1. Environnement Requis

Pour deployer le backend MediBloc en environnement de production :
- Environnement d'execution : Node.js version 20 LTS
- Base de donnees : PostgreSQL version 14 ou superieure
- Gestionnaire de processus : PM2 ou Systemd
- Serveur mandataire inverse (Reverse Proxy) : Nginx avec support HTTP/2 et terminaison SSL/TLS
- Certificat SSL : Let's Encrypt / Certbot

---

## 2. Configuration des Variables d'Environnement

Le fichier `.env` de production doit etre configure sans cle manquante :

```env
# Connexion base PostgreSQL
DATABASE_URL="postgresql://utilisateur:motdepasse@hote:5432/medibloc_production?schema=public"

# Chiffrement JWT (chaine securisee de 64 caracteres minimum)
JWT_SECRET="cle_cryptographique_forte_obligatoire"
JWT_EXPIRES_IN="7d"

# Configuration serveur
PORT=3000
NODE_ENV="production"

# Politique CORS
CORS_ORIGIN="https://app.medibloc.com,https://admin.medibloc.com"
CORS_CREDENTIALS="false"
```

---

## 3. Sequence de Deploiement

### Etape 1 : Recuperation et installation
```bash
git pull origin main
cd backend
npm ci --only=production
```

### Etape 2 : Generation Prisma et mise a jour de la base
```bash
npx prisma generate
npx prisma migrate deploy
```

### Etape 3 : Compilation du projet
```bash
npm run build
```

### Etape 4 : Demarrage de l'instance
```bash
pm2 start dist/app/index.js --name "medibloc-backend" --instances max --exec-mode cluster
pm2 save
```

---

## 4. Verification Post-Deploiement

- **Verification de sante** : `GET /api/v1/health` (doit retourner HTTP 200 avec status OK).
- **Interface Swagger** : `GET /api-docs`.
- **Surveillance des logs** : `pm2 logs medibloc-backend`.
