import { Tag } from '@app/tag/entities/tag.entity';
import type { Tag as PrismaTag } from '@prisma/client';

export const prismaTagToTagAdapter = (input: PrismaTag) =>
  new Tag({
    ...input,
    id: Number(input.id),
    userId: input.userId === null ? null : Number(input.userId),
  });
