# Echoes

## Description

**Echoes** is a platform for discovering and sharing quotes, inspired by websites like [Pensador](https://www.pensador.com/). It allows users to explore quotes by author, source, category, or keyword. With a simple and intuitive interface, **Echoes** offers a delightful experience for anyone seeking inspiration or literary references.

## Features

- **Explore Quotes**: Search by author, category, source, or keyword.
- **Share Your Favorite Quotes**: Easily share meaningful quotes with others.
- **Modern Interface**: Clean, responsive design that prioritizes usability.

## Requirements

To run the project locally, ensure you have the following installed:

- [Docker](https://www.docker.com)
- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/) (Package Manager)

## Packages

This monorepo consists of the following main packages:

- **[API](https://github.com/carlos3g/echoes/tree/main/packages/api)**:
  A RESTful API built with NestJS.

- **[Web App](https://github.com/carlos3g/echoes/tree/main/packages/webapp)**:
  A web application built with Next.js.

## How to Run

To run the project locally, follow these steps:

1. Setup .env:

   ```bash
   cp packages/api/.env.example packages/api/.env && cp packages/app/.env.example packages/app/.env && cp packages/webapp/.env.example packages/webapp/.env

   # adjust for yours needs
   ```

2. Start the services using Docker:

   ```bash
   cd packages/api && docker-compose up -d && cd ../..
   ```

3. Install dependencies and start the development environment:

   ```bash
   yarn install
   yarn db
   yarn dev
   ```

4. Access the application:
   - **REST API**: `http://localhost:3000`
   - **Web App**: `http://localhost:3333`

## Testing

To run the tests, use the following commands:

```bash
yarn db:test

yarn lerna run test
yarn lerna run test:e2e
```

## Notes

- The `docker-compose.yaml` file has not been tested on ARM architecture.
