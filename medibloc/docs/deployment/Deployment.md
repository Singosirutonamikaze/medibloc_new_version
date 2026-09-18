# Guide de Deploiement et Conteneurisation - MediBloc Web

## 1. Vue d'Ensemble du Deploiement

Le frontend MediBloc est encapsule dans une image Docker multi-stage optimisee et servi par un serveur **Nginx Alpine** haute performance.

---

## 2. Deploiement avec Docker

### Lancement via Docker Compose (Projet Frontend)
```bash
cd medibloc/docker
docker-compose up -d --build
```

### Lancement via le Makefile Racine
```bash
make docker-frontend-up
```

---

## 3. Configuration Nginx et En-tetes de Securite

Le conteneur Nginx prend en charge :
- Le routage Single Page Application (`try_files $uri $uri/ /index.html;`)
- Le proxy automatique vers l'API Backend (`/api/`)
- La compression gzip des ressources statiques
- Les en-tetes HTTP de durcissement de la securite (`X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`, `Referrer-Policy`)
- Le cache long terme immuable pour les assets statiques compiles (`max-age=31536000, immutable`).
