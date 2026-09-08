# Stage 1: Build l'application Vite React PWA
FROM node:22-alpine AS builder

WORKDIR /app

# Optimisation du cache des dépendances
COPY package*.json ./
RUN npm ci

# Copie des sources et build de production
COPY . .
RUN npm run build

# Stage 2: Serveur Nginx Alpine ultra-léger et sécurisé
FROM nginx:alpine

# Copie de la configuration Nginx optimisée SPA / PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers statiques compilés depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
