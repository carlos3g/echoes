import { Source } from '@app/source/entities/source.entity';
import type { Source as PrismaSource } from '@prisma/client';

export const prismaSourceToSourceAdapter = (input: PrismaSource) =>
  new Source({
    ...input,
    id: Number(input.id),
    quoteId: input.quoteId && Number(input.quoteId),
  });
