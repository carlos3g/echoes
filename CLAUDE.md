# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Echoes is a platform for discovering and sharing quotes, built as a Lerna monorepo with a NestJS API and React Native mobile app (Expo).

**Packages:**
- `@echoes/api` - NestJS REST API backend
- `@echoes/app` - React Native mobile app with Expo

## Development Commands

### Initial Setup

```bash
# Setup environment files
cp packages/api/.env.example packages/api/.env && cp packages/app/.env.example packages/app/.env

# Start database services (PostgreSQL, MailHog)
cd packages/api && docker-compose up -d && cd ../..

# Install dependencies
yarn install

# Setup database (generate Prisma client, run migrations, seed data)
yarn db
```

### Running the Application

```bash
# Run both API and app in development
yarn dev

# Run API only
yarn dev:api

# Run mobile app only
yarn dev:app
```

API runs on `http://localhost:3000`, Swagger docs at `http://localhost:3000/api`

### Testing

```bash
# Setup test database
yarn db:test

# Run all tests
yarn lerna run test

# Run E2E tests
yarn lerna run test:e2e

# API-specific test commands (from packages/api):
yarn test              # Unit tests in watch mode
yarn test:e2e          # E2E tests
yarn test:cov          # Coverage report
yarn test:debug        # Debug tests
```

### Code Quality

```bash
# Format, lint, and type-check all packages
yarn style

# Individual packages (from package directory):
yarn format            # Prettier
yarn lint              # ESLint
yarn check             # TypeScript type-checking
```

### Database Management

```bash
# Generate Prisma client
yarn lerna run db:generate

# Push schema changes to database
yarn lerna run db:migrate

# Seed database
yarn lerna run db:seed

# Fresh database (from packages/api)
yarn db:fresh
```

## Architecture

### API Architecture (`packages/api`)

**Module-based NestJS architecture** - Each domain (quote, author, category, source, tag, user, auth) is a self-contained module.

**Standard module structure:**
```
<domain>/
├── contracts/          # Repository interfaces
├── dtos/              # Request/response DTOs
├── entities/          # Domain entities
├── repositories/      # Prisma repository implementations
├── services/          # Business logic services
├── use-cases/         # Application use cases (one per feature)
├── <domain>.controller.ts
└── <domain>.module.ts
```

**Key patterns:**
- **Repository pattern**: All database access goes through repository contracts (interfaces) with Prisma implementations
- **Use case pattern**: Each feature is a separate use case class (e.g., `FavoriteQuoteUseCase`, `ListQuotePaginatedUseCase`)
- **Dependency injection**: Modules provide repositories via contracts, allowing easy mocking/testing
- **Path aliases**: Use `@app/*` for src imports, `@test/*` for test imports

**Shared code** (`src/shared/`): Common DTOs, types, validators, and utilities used across modules.

**Database**: PostgreSQL with Prisma ORM. Schema in `prisma/schema.prisma`. Seeders in `prisma/seeders/`, factories in `prisma/factories/`.

**Testing**: E2E tests live alongside controllers (`*.e2e-spec.ts`). Test utilities in `test/` directory including test server setup, auth helpers, and factories.

### Mobile App Architecture (`packages/app`)

**Expo + React Native** with React Navigation for routing.

**Directory structure:**
```
src/
├── features/          # Feature modules (auth, quote, tag)
│   └── <feature>/
│       ├── components/
│       ├── contracts/  # Type definitions/interfaces
│       ├── hooks/      # React Query hooks
│       ├── services/   # API client services
│       └── utils/
├── screens/           # Top-level screen components (app, auth)
├── navigation/        # React Navigation configuration
├── shared/            # Shared components, hooks, services, utils
├── lib/              # Third-party library configurations
│   ├── react-query/
│   ├── axios/
│   ├── i18n/
│   └── ...
└── types/            # Global TypeScript types
```

**Key patterns:**
- **Feature-based organization**: Each feature (auth, quote, tag) contains its own components, hooks, and services
- **React Query**: All API calls use React Query hooks defined in `features/<feature>/hooks/`
- **Shared services**: API client setup in `shared/services/`, common components in `shared/components/`
- **Path aliases**: Use `@/*` for src imports
- **Styling**: NativeWind (Tailwind for React Native) with custom theme configuration

**State management:**
- React Query for server state
- Zustand for client state (stores in `lib/zustand/`)
- MMKV for persistent storage

**Navigation**: React Navigation with drawer, bottom tabs, and stack navigators.

## Important Notes

- **Monorepo**: Use Lerna commands to run scripts across packages (`lerna run <script>`)
- **Package Manager**: Yarn v4 (Berry) - do not use npm
- **Commits**: Conventional commits enforced via commitlint and husky pre-commit hooks
- **Docker**: docker-compose.yaml in `packages/api/` sets up PostgreSQL and MailHog for local development
- **Environment**: API requires database connection and JWT secret; check `.env.example` files for required variables
