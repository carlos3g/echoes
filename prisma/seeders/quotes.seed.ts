import type { PrismaClient } from '@prisma/client';
import { AuthorFactory } from '../factories/author.factory';
import { QuoteFactory } from '../factories/quote.factory';

const authorFactory = new AuthorFactory();
const quoteFactory = new QuoteFactory();

export class QuotesSeeder {
  public static async run(prisma: PrismaClient): Promise<void> {
    const authors = await prisma.author.createManyAndReturn({
      data: authorFactory.makeMany(10),
    });

    const promises = authors.map(async (author) => {
      const data = quoteFactory.makeMany(10, { authorId: author.id });

      await prisma.quote.createMany({ data });
    });

    await Promise.all(promises);
  }
}
