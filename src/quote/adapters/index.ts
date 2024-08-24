import { Quote } from '@app/quote/entities/quote.entity';
import type { Quote as PrismaQuote } from '@prisma/client';

export const prismaQuoteToQuoteAdapter = (input: PrismaQuote) =>
  new Quote({
    ...input,
    id: Number(input.id),
    authorId: input.authorId && Number(input.authorId),
  });
