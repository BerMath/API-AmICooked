FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet
COPY . .

# Vérifier que les fichiers sont bien là (debug)
RUN ls -la /app
RUN ls -la /app/routes || echo "Routes folder missing!"
RUN ls -la /app/controllers || echo "Controllers folder missing!"
RUN ls -la /app/config || echo "Config folder missing!"

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]