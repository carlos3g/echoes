import { PrismaClient } from '@prisma/client';
import { UsersSeeder } from './seeders/users.seed';
import { QuotesSeeder } from './seeders/quotes.seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await QuotesSeeder.run(tx);
    await UsersSeeder.run(tx);
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
