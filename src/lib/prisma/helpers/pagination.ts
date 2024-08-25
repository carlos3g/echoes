/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Prisma, PrismaClient } from '@prisma/client';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

// see: https://github.com/prisma/prisma/issues/6980
type ModelDelegates = {
  [K in Prisma.ModelName]: PrismaClient[Uncapitalize<K>];
};

export type PaginateOptions = { page?: number; perPage?: number };
export type PaginateFunction = <T, K extends Prisma.ModelName>(
  model: ModelDelegates[K],
  args?: Parameters<ModelDelegates[K]['findMany']>[0],
  options?: PaginateOptions
) => Promise<PaginatedResult<T>>;

export const calcSkip = (page: number, perPage: number): number => {
  return page > 0 ? perPage * (page - 1) : 0;
};

export const getMeta = (total: number, page: number, perPage: number) => {
  const lastPage = Math.ceil(total / perPage);

  return {
    total,
    lastPage,
    currentPage: page,
    perPage,
    prev: page > 1 ? page - 1 : null,
    next: page < lastPage ? page + 1 : null,
  };
};

export const paginate: PaginateFunction = async (model, args, options) => {
  const { page = 1, perPage = 20 } = options || {};

  const [total, data] = await Promise.all([
    // @ts-expect-error
    model.count({ where: args?.where }),
    // @ts-expect-error
    model.findMany({
      ...args,
      take: perPage,
      skip: calcSkip(page, perPage),
    }),
  ]);

  return { data, meta: getMeta(total as number, page, perPage) };
};
