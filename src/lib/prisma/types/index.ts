import type { Prisma, PrismaClient } from '@prisma/client';

// see: https://github.com/prisma/prisma/issues/6980
export type ModelDelegates = {
  [K in Prisma.ModelName]: PrismaClient[Uncapitalize<K>];
};
