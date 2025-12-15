import { Category } from '@app/category/entities/category.entity';
import type { Category as PrismaCategory } from '@prisma/client';

export const prismaCategoryToCategoryAdapter = (input: PrismaCategory) =>
  new Category({
    ...input,
    id: Number(input.id),
  });
