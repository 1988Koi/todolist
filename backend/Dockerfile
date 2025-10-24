# Dockerfile (backend)
FROM node:20

WORKDIR /app

# Copia package.json e package-lock.json do backend
COPY package*.json ./
RUN npm install --production

# Copia todo o backend
COPY . .

# Build do frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Volta para o backend
WORKDIR /app

# Expõe porta
EXPOSE 3001

CMD ["node", "dist/index.js"]
