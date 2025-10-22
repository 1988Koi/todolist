# Imagem base
FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila TypeScript (opcional se usar ts-node-dev)
RUN npm run build

# Expõe porta
EXPOSE 3001

# Comando para rodar
CMD ["npm", "run", "start"]
