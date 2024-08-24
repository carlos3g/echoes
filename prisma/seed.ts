import { PrismaClient } from '@prisma/client';
import { QuotesSeeder } from './seeders/quotes.seed';

const prisma = new PrismaClient();

async function main() {
  await QuotesSeeder.run(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e;
  });
