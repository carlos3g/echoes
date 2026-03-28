import 'dotenv-expand/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DB_URL'),
  },
  migrations: {
    seed: 'ts-node -r tsconfig-paths/register --transpile-only -P ./tsconfig.json prisma/seed.ts',
  },
});
