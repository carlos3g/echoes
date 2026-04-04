import 'dotenv-expand/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { UsersSeeder } from './seeders/users.seed';
import { QuotesSeeder } from './seeders/quotes.seed';
import { InsightsSeeder } from './seeders/insights.seed';
import { FoldersSeeder } from './seeders/folders.seed';
import { SocialSeeder } from './seeders/social.seed';

const connectionString = process.env.DB_URL!;
const schema = new URL(connectionString).searchParams.get('schema') || undefined;
const adapter = new PrismaPg(connectionString, { schema });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(async (tx) => {
    await QuotesSeeder.run(tx);
    await UsersSeeder.run(tx);
    await InsightsSeeder.run(tx);
    await FoldersSeeder.run(tx);
    await SocialSeeder.run(tx);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e;
  });
