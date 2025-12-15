# Echoes

> A platform for discovering and sharing meaningful quotes

**Echoes** is a quote discovery and sharing platform inspired by [Pensador](https://www.pensador.com/). Explore quotes by author, source, category, or keyword through a modern mobile experience.

## Features

- 📖 **Explore Quotes** - Search by author, category, source, or keyword
- ⭐ **Favorite & Tag** - Save and organize your favorite quotes
- 📱 **Mobile First** - Native mobile experience with React Native
- 🔐 **User Accounts** - Authentication and personalized collections
- 🎨 **Modern Interface** - Clean, intuitive design

## Tech Stack

This monorepo consists of:

- **[API](packages/api)** - NestJS REST API with PostgreSQL/Prisma
- **[Mobile App](packages/app)** - React Native app built with Expo

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en) (v18 or higher recommended)
- [Yarn](https://yarnpkg.com/) v4 (Berry)
- [Docker](https://www.docker.com) & Docker Compose

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/carlos3g/echoes.git
cd echoes
yarn install
```

### 2. Environment Setup

Copy the example environment files and configure as needed:

```bash
cp .env.example .env
cp packages/api/.env.example packages/api/.env
cp packages/app/.env.example packages/app/.env
```

**Required environment variables:**
- `.env` - Docker Compose configuration (MinIO credentials, service ports)
- `packages/api/.env` - Database connection, JWT secret, AWS/MinIO credentials
- `packages/app/.env` - API URL (defaults to `http://localhost:3000`)

### 3. Start Docker Services

Start PostgreSQL, MinIO (S3-compatible storage), and Mailpit (email testing):

```bash
docker-compose up -d
```

**Services started:**
- PostgreSQL: `localhost:5432`
- MinIO: `localhost:9000` (Console: `localhost:8900`)
- Mailpit: `localhost:1025` (Web UI: `localhost:8025`)
- Nginx (MinIO proxy): `localhost:8080`

### 4. Initialize Database

Generate Prisma client, run migrations, and seed the database:

```bash
yarn db
```

### 5. Start Development Servers

```bash
# Start both API and mobile app
yarn dev

# Or run individually:
yarn dev:api   # API only
yarn dev:app   # Mobile app only
```

**Access the application:**
- **REST API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (Swagger)
- **Mobile App**: Expo DevTools in terminal

## Development

### Running Tests

```bash
# Setup test database
yarn db:test

# Run all tests
yarn test

# Run E2E tests
yarn test:e2e

# API-specific (from packages/api):
yarn test              # Unit tests (watch mode)
yarn test:cov          # With coverage
yarn test:e2e          # E2E tests
```

### Code Quality

```bash
# Format, lint, and type-check all packages
yarn style

# Individual packages:
yarn format            # Prettier
yarn lint              # ESLint
yarn check             # TypeScript
```

### Database Management

```bash
# From packages/api:
yarn db:generate       # Generate Prisma client
yarn db:migrate        # Push schema changes
yarn db:seed          # Seed database
yarn db:fresh         # Fresh database (generate + migrate + seed)
```

## Project Structure

```
echoes/
├── packages/
│   ├── api/          # NestJS REST API
│   │   ├── src/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── quote/      # Quotes management
│   │   │   ├── author/     # Authors
│   │   │   ├── category/   # Categories
│   │   │   ├── tag/        # User tags
│   │   │   └── ...
│   │   ├── prisma/         # Database schema & seeds
│   │   └── test/           # E2E tests
│   │
│   └── app/          # React Native mobile app
│       ├── src/
│       │   ├── features/   # Feature modules (auth, quote, tag)
│       │   ├── screens/    # Screen components
│       │   ├── navigation/ # React Navigation
│       │   ├── shared/     # Shared components & utils
│       │   └── lib/        # Third-party configs
│       └── ...
└── ...
```

## Architecture

- **API**: NestJS with module-based architecture, repository pattern, and use cases
- **Mobile**: Feature-based React Native with React Query for state management
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: MinIO (S3-compatible) for file uploads
- **Styling**: NativeWind (Tailwind CSS for React Native)

## Contributing

This project uses:
- **Conventional Commits** - Enforced via commitlint
- **Husky** - Git hooks for pre-commit linting
- **Turborepo** - High-performance monorepo build system with smart caching

## Notes

- The `docker-compose.yaml` has not been fully tested on ARM architecture
- Package manager must be Yarn v4 (Berry) - do not use npm
- MinIO is used as S3-compatible storage for local development

## License

MIT
