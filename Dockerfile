# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Necessário para o Prisma Client
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar as dependências
RUN npm ci

# Copiar os arquivos do Prisma e os arquivos de configuração
COPY prisma ./prisma/
COPY nest-cli.json tsconfig*.json ./
COPY src ./src/

# Gerar o cliente do Prisma
RUN npx prisma generate

# Fazer o build do NestJS
RUN npm run build

# Stage 2: Dependencies
FROM node:22-alpine AS deps

WORKDIR /app

# Necessário para o Prisma Client
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Copiar os arquivos do Prisma e gerar o cliente novamente (apenas para prod)
COPY prisma ./prisma/
RUN npx prisma generate

# Stage 3: Production
FROM node:22-alpine AS production

WORKDIR /app

# Necessário para o Prisma Client
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copiar dependências e o cliente do Prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copiar a aplicação construída, os esquemas do Prisma e a pasta gerada
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Porta da aplicação
EXPOSE 3000

# Executar a aplicação
CMD ["npm", "run", "start:prod"]
