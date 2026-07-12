# ── Étape 1 : BUILD (compile le React) ───────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json d'abord (cache Docker)
COPY package*.json ./
RUN npm install

# Copier le reste et builder
COPY . .
RUN npm run build

# ── Étape 2 : SERVE (nginx sert les fichiers statiques) ──────
FROM nginx:alpine AS runtime
# Copier le build React dans le dossier servi par nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copier notre config nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]