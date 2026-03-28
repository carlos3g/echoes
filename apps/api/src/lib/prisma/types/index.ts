import type { Prisma, PrismaClient } from '@generated/prisma/client';

// see: https://github.com/prisma/prisma/issues/6980
export type ModelDelegates = {
  [K in Prisma.ModelName]: PrismaClient[Uncapitalize<K>];
};

export interface BatchOutput {
  count: number;
}
