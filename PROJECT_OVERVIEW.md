# Echoes - Project Overview

Echoes é uma plataforma para descobrir e compartilhar citações, construída como um monorepo Turborepo com uma API NestJS e um aplicativo mobile React Native (Expo).

## Estrutura do Monorepo

```
echoes/
├── apps/
│   ├── api/          # @echoes/api - Backend NestJS REST API
│   └── app/          # @echoes/app - Mobile React Native com Expo
├── packages/         # Pacotes compartilhados (reservado)
├── infrastructure/   # Configurações de infraestrutura
├── docker-compose.yaml
├── turbo.json
└── package.json
```

## Stack Tecnológica

### Backend (API)
- **Framework:** NestJS
- **Database:** PostgreSQL com Prisma ORM
- **Storage:** MinIO (S3-compatible)
- **Auth:** JWT (access + refresh tokens)
- **Email:** Nodemailer com Mailpit (dev)
- **Docs:** Swagger/OpenAPI

### Mobile App
- **Framework:** React Native 0.81.5 + Expo SDK 54
- **Navigation:** Expo Router (file-based)
- **State Management:** React Query (server) + Zustand (client)
- **Styling:** NativeWind (Tailwind CSS)
- **Forms:** React Hook Form + Zod
- **Storage:** MMKV (secure)

### DevOps
- **Monorepo:** Turborepo com Yarn v4
- **Containers:** Docker Compose
- **Quality:** ESLint, Prettier, TypeScript
- **Commits:** Conventional Commits (Husky + Commitlint)

---

## Features do Sistema

### 1. Autenticação (`/v1/auth`)

| Feature | Descrição |
|---------|-----------|
| Sign Up | Cadastro de usuário com upload opcional de avatar |
| Sign In | Login com email/senha retornando JWT tokens |
| Refresh Token | Renovação de access token expirado |
| Forgot Password | Envio de email para recuperação (rate limited) |
| Reset Password | Redefinição de senha via token |
| Change Password | Alteração de senha (autenticado) |
| Email Confirmation | Verificação de email com token |
| Get/Update Profile | Visualização e edição de perfil |
| Update Avatar | Upload de nova foto de perfil |

**Segurança:**
- Tokens JWT com refresh
- Rate limiting em endpoints sensíveis (3 req/2min)
- Validação de imagem (tipo, tamanho, dimensões)
- Fallback de avatar com Jdenticon

### 2. Citações (`/v1/quotes`)

| Feature | Descrição |
|---------|-----------|
| Listar Citações | Paginação infinita com filtros |
| Filtrar por Tag | Filtrar citações por tags do usuário |
| Filtrar por Autor | Filtrar citações por autor |
| Ver Citação | Detalhes com metadados (favoritos, tags) |
| Favoritar | Adicionar/remover dos favoritos |
| Taggear | Associar tags pessoais às citações |
| Compartilhar | Share nativo no mobile |

**Metadados inclusos:**
- Contagem de favoritos
- Contagem de tags
- Se o usuário atual favoritou
- Autor da citação

### 3. Autores (`/v1/authors`)

| Feature | Descrição |
|---------|-----------|
| Listar Autores | Paginação com busca |
| Ver Autor | Detalhes com bio e datas |
| Favoritar | Adicionar/remover autores favoritos |
| Taggear | Associar tags pessoais aos autores |

### 4. Tags (`/v1/tags`)

| Feature | Descrição |
|---------|-----------|
| Listar Tags | Tags do usuário com contagem de quotes |
| Criar Tag | Nova tag pessoal |
| Aplicar em Quotes | Organizar citações por tags |
| Aplicar em Authors | Organizar autores por tags |

**Características:**
- Tags são privadas por usuário
- Contagem de citações por tag
- Usado para filtrar na listagem

### 5. Categorias (`/v1/categories`)

| Feature | Descrição |
|---------|-----------|
| Listar Categorias | Categorias pré-definidas do sistema |

### 6. Usuários (`/v1/users`)

| Feature | Descrição |
|---------|-----------|
| Avatar Público | `GET /users/:uuid.webp` retorna avatar |

---

## Modelo de Dados

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │      Quote      │     │     Author      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ uuid            │     │ uuid            │     │ uuid            │
│ name            │     │ body            │     │ name            │
│ email           │     │ authorId ───────│─────│ birthDate       │
│ username        │     │ createdAt       │     │ deathDate       │
│ password        │     │ updatedAt       │     │ bio             │
│ emailVerifiedAt │     └─────────────────┘     │ createdAt       │
│ avatarId        │              │              │ updatedAt       │
│ createdAt       │              │              └─────────────────┘
│ updatedAt       │              │                       │
└─────────────────┘              │                       │
        │                        │                       │
        │    ┌───────────────────┼───────────────────────┤
        │    │                   │                       │
        ▼    ▼                   ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ UserFavoriteQuote│     │    TagQuote     │     │   TagAuthor     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ userId          │     │ tagId           │     │ tagId           │
│ quoteId         │     │ quoteId         │     │ authorId        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                       │
        │                        │                       │
        │                        ▼                       │
        │               ┌─────────────────┐              │
        │               │       Tag       │◄─────────────┘
        │               ├─────────────────┤
        │               │ uuid            │
        └───────────────│ title           │
                        │ userId          │
                        │ createdAt       │
                        │ updatedAt       │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    Category     │     │     Source      │
├─────────────────┤     ├─────────────────┤
│ uuid            │     │ uuid            │
│ title           │     │ title           │
│ createdAt       │     │ quoteId         │
│ updatedAt       │     │ createdAt       │
└─────────────────┘     │ updatedAt       │
        │               └─────────────────┘
        │
   Many-to-Many
   with Quote
```

**Relacionamentos:**
- User → Tags (1:N)
- User → FavoriteQuotes (N:M via UserFavoriteQuote)
- User → FavoriteAuthors (N:M via UserFavoriteAuthor)
- Quote → Author (N:1)
- Quote → Categories (N:M)
- Quote → Sources (1:N)
- Quote → Tags (N:M via TagQuote)
- Author → Tags (N:M via TagAuthor)

---

## Telas do App Mobile

### Fluxo de Autenticação
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign In   │────►│   Sign Up   │     │   Forgot    │
│             │◄────│             │     │  Password   │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                        │
       │                                        ▼
       │                                ┌─────────────┐
       │                                │    Reset    │
       │                                │  Password   │
       ▼                                └─────────────┘
┌─────────────────────────────────────────────────────┐
│                   App Autenticado                    │
└─────────────────────────────────────────────────────┘
```

### Navegação Principal (Tabs)
```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │              Quote Feed (Index)              │    │
│  │  • Lista infinita de citações               │    │
│  │  • Pull-to-refresh                          │    │
│  │  • Badge de filtro por tag                  │    │
│  │  • Cards com: favoritar, taggear, share     │    │
│  └─────────────────────────────────────────────┘    │
│                        │                             │
│                        ▼                             │
│  ┌─────────────────────────────────────────────┐    │
│  │            Quote Detail [uuid]              │    │
│  │  • Citação completa                         │    │
│  │  • Ações: favoritar, taggear, share         │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
├──────────────────────┬──────────────────────────────┤
│                      │                               │
│  ┌─────────────┐     │     ┌─────────────────────┐  │
│  │    Tags     │     │     │      Settings       │  │
│  │             │     │     │                     │  │
│  │ • Lista de  │     │     │ • Profile header    │  │
│  │   tags      │     │     │ • Theme toggle      │  │
│  │ • FAB criar │     │     │ • Edit profile      │  │
│  │ • Navegação │     │     │ • Change password   │  │
│  │   p/ quotes │     │     │ • Logout            │  │
│  └─────────────┘     │     └──────────┬──────────┘  │
│                      │                │              │
│                      │                ▼              │
│                      │     ┌─────────────────────┐  │
│                      │     │  Change Password    │  │
│                      │     └─────────────────────┘  │
│                      │                               │
├──────────────────────┴──────────────────────────────┤
│         [Quotes]        [Tags]       [Settings]     │
└─────────────────────────────────────────────────────┘
```

### Componentes Interativos

**Bottom Sheets:**
- `CreateTagBottomSheet` - Criar nova tag
- `TagQuoteBottomSheet` - Selecionar tags para citação

**Interações por Citação:**
```
┌─────────────────────────────────────────┐
│ "A citação aparece aqui..."             │
│                                          │
│ - Autor                                  │
│                                          │
│ ♥ 42    🏷️ 5    📤                      │
│ [fav]  [tag]  [share]                   │
└─────────────────────────────────────────┘
```

---

## Padrões de Arquitetura

### API (Backend)

**Estrutura de Módulo:**
```
<domain>/
├── contracts/          # Interfaces de repositório
├── dtos/              # Request/Response DTOs
├── entities/          # Entidades de domínio
├── repositories/      # Implementações Prisma
├── services/          # Lógica de negócio
├── use-cases/         # Casos de uso (1 por feature)
├── <domain>.controller.ts
└── <domain>.module.ts
```

**Padrões:**
- Repository Pattern com contratos abstratos
- Use Case Pattern (1 classe por feature)
- Dependency Injection via NestJS
- URI Versioning (`/v1/...`)

### App Mobile

**Estrutura de Feature:**
```
features/<feature>/
├── components/        # Componentes da feature
├── contracts/         # Tipos e interfaces
├── hooks/             # React Query hooks
├── services/          # Chamadas de API
├── utils/             # Utilitários
└── validations/       # Schemas Zod
```

**Padrões:**
- Feature-based organization
- React Query para server state
- Zustand para client state
- Custom hooks para lógica reutilizável
- Optimistic updates nas mutations

---

## Endpoints da API

### Auth
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/sign-up` | - | Cadastro |
| POST | `/auth/sign-in` | - | Login |
| POST | `/auth/refresh` | - | Refresh token |
| POST | `/auth/forgot-password` | - | Solicitar reset |
| POST | `/auth/reset-password/:token` | - | Resetar senha |
| GET | `/auth/me` | ✓ | Perfil atual |
| PATCH | `/auth/me` | ✓ | Atualizar perfil |
| PATCH | `/auth/me/avatar` | ✓ | Atualizar avatar |
| PATCH | `/auth/change-password` | ✓ | Alterar senha |
| POST | `/auth/email/confirm/:token` | ✓ | Confirmar email |
| POST | `/auth/email/resend` | ✓ | Reenviar confirmação |

### Quotes
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/quotes` | - | Listar (paginado) |
| GET | `/quotes/:uuid` | - | Detalhes |
| POST | `/quotes/:uuid/favorite` | ✓ | Favoritar |
| POST | `/quotes/:uuid/unfavorite` | ✓ | Desfavoritar |
| POST | `/quotes/:uuid/tag` | ✓ | Adicionar tag |
| POST | `/quotes/:uuid/untag` | ✓ | Remover tag |
| GET | `/quotes/:uuid/tags/:tagUuid/exists` | ✓ | Verificar tag |

### Authors
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/authors` | - | Listar (paginado) |
| GET | `/authors/:uuid` | - | Detalhes |
| POST | `/authors/:uuid/favorite` | ✓ | Favoritar |
| POST | `/authors/:uuid/unfavorite` | ✓ | Desfavoritar |
| POST | `/authors/:uuid/tag` | ✓ | Adicionar tag |
| POST | `/authors/:uuid/untag` | ✓ | Remover tag |

### Tags
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/tags` | ✓ | Listar (paginado) |
| POST | `/tags` | ✓ | Criar tag |

### Categories
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/categories` | - | Listar (paginado) |

### Users
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/users/:uuid.webp` | - | Avatar do usuário |

### Health
| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/health` | - | Health check |

---

## Serviços Docker

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| PostgreSQL | 5432 | Banco de dados |
| Mailpit SMTP | 1025 | Servidor de email (dev) |
| Mailpit UI | 8025 | Interface web de emails |
| MinIO S3 | 9000 | Object storage |
| MinIO Console | 8900 | Interface web MinIO |
| Nginx | 8080 | Proxy para CloudFront |

---

## Como Rodar

```bash
# Setup inicial
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env
docker-compose up -d
yarn install
yarn db

# Desenvolvimento
yarn dev          # API + App
yarn dev:api      # Apenas API
yarn dev:app      # Apenas App

# Testes
yarn db:test      # Setup DB de teste
yarn test         # Unit tests
yarn test:e2e     # E2E tests

# Code quality
yarn style        # Format + Lint + Type check
```

---

## Variáveis de Ambiente

### API (`apps/api/.env`)
```env
NODE_ENV=development
API_PORT=3000
API_DNS=http://localhost:3000
JWT_SECRET=<seu-secret>

# Database
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=echoes
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}

# Email
MAIL_HOST=localhost
MAIL_PORT=1025

# Storage (MinIO)
AWS_ACCESS_KEY_ID=minio
AWS_SECRET_ACCESS_KEY=password
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_BUCKET=avatars
AWS_CLOUDFRONT_DNS=http://localhost:8080/cloudfront
```

### App (`apps/app/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/v1
```

---

## Conclusão

Echoes é um sistema completo de gerenciamento de citações com:

- **Backend robusto** com autenticação JWT, upload de arquivos, e APIs RESTful bem documentadas
- **App mobile moderno** com React Native, navegação fluida, e UI consistente
- **Features principais**: descobrir citações, favoritar, organizar com tags pessoais, compartilhar
- **Arquitetura limpa** com separação de responsabilidades e padrões bem definidos
- **DevOps completo** com Docker, testes, linting, e conventional commits
