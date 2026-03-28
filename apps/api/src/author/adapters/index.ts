import { Author } from '@app/author/entities/author.entity';
import type { Author as PrismaAuthor } from '@generated/prisma/client';

export const prismaAuthorToAuthorAdapter = (input: PrismaAuthor) =>
  new Author({
    ...input,
    id: Number(input.id),
  });
