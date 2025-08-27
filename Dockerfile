# Dockerfile

# Estágio 1: Builder - Instala dependências e compila o projeto
FROM node:20-slim AS builder

# Instala o pnpm
RUN npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de manifesto do pnpm e o schema do Prisma
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Instala as dependências (usando --frozen-lockfile para garantir consistência)
RUN pnpm install --frozen-lockfile

# Copia o restante do código-fonte
COPY . .

# Gera o Prisma Client
RUN pnpm prisma generate

# Constrói a aplicação Next.js
RUN pnpm build

# Estágio 2: Runner - Cria a imagem final de produção
FROM node:20-slim AS runner

WORKDIR /app

# Copia os artefatos da build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Define o comando para iniciar a aplicação em produção
CMD ["pnpm", "start"]
