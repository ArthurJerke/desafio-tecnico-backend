# Desafio Técnico - API de Notícias

Bem-vindo ao repositório do backend do Desafio Técnico. Este projeto foi desenvolvido em **NestJS**, utilizando **Prisma ORM** e banco de dados **PostgreSQL**. A documentação abaixo visa guiá-lo no processo de configuração, execução e testes, tanto no ambiente Docker quanto localmente.

---

## 📋 1. Pré-requisitos

Para rodar o projeto de qualquer uma das formas, garanta que seu ambiente possui:
- [Git](https://git-scm.com/) (para clonagem do repositório)
- [Node.js](https://nodejs.org/en/) (Versão 22+ recomendada)
- [Docker](https://www.docker.com/products/docker-desktop/) e [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🐳 2. Executando com Docker (Recomendado)

O projeto está totalmente configurado para rodar os serviços (Banco de Dados, Backend e Frontend) integrados.

### Passos:
1. Navegue até a pasta `backend` onde o `docker-compose.yml` está localizado.
2. Construa e suba os contêineres executando o comando:
   ```bash
   docker-compose up -d --build
   ```
3. O `docker-compose` irá inicializar 3 serviços:
   - **Postgres**: na porta `5432`
   - **Backend**: na porta `3000` (Acesso via http://localhost:3000)
   - **Frontend**: na porta `5173` (Acesso via http://localhost:5173)

> **Importante:** Como o banco de dados sobe vazio na primeira vez, os contêineres cuidarão da execução e o *Prisma Client* já é gerado dentro do contêiner da API.

### Para parar a execução:
```bash
docker-compose down
```

---

## 💻 3. Executando Localmente (Desenvolvimento)

Caso você deseje desenvolver ou rodar a aplicação nativamente sem colocar o código do backend no Docker:

### Passo 3.1: Subir apenas o Banco de Dados
O backend precisará do PostgreSQL ativo. Você pode utilizar o Docker apenas para subir o banco:
```bash
docker-compose up -d postgres
```

### Passo 3.2: Variáveis de Ambiente
O projeto lê variáveis de ambiente diretamente do arquivo `.env` localizado na raiz do `/backend`. Por padrão, ele está configurado como:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/noticias?schema=public"
```

### Passo 3.3: Instalação das dependências
Na raiz da pasta `/backend`, instale as bibliotecas necessárias utilizando o NPM:
```bash
npm install
```

### Passo 3.4: Sincronização e geração do Prisma
Sincronize o esquema com o banco de dados (o comando abaixo irá criar as tabelas ausentes e gerar o `Prisma Client` tipado):
```bash
npx prisma db push
```

### Passo 3.5: Rodar a aplicação
Por fim, inicie o servidor da API NestJS em modo observador (watch):
```bash
npm run start:dev
```
A API iniciará no endereço http://localhost:3000.

---

## 🧪 4. Testes Automatizados

A suíte de testes da aplicação foi estruturada usando **Jest**. Certifique-se de ter rodado o `npm install` localmente para que o framework de testes esteja disponível.

Abra um terminal na pasta do `backend` e utilize os comandos abaixo conforme a necessidade:

- **Rodar todos os testes unitários:**
  ```bash
  npm run test
  ```

- **Rodar testes no modo watch (Observação contínua):**
  Excelente para TDD. Ele irá re-executar os testes assim que você salvar uma alteração no código.
  ```bash
  npm run test:watch
  ```

- **Verificar a Cobertura de Código (Coverage):**
  O comando gera um relatório completo mostrando as porcentagens de linhas e funções testadas no projeto.
  ```bash
  npm run test:cov
  ```

- **Rodar testes de Integração / E2E (End-to-End):**
  ```bash
  npm run test:e2e
  ```
