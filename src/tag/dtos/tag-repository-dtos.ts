import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface TagRepositoryCreateInput {
  userId: number;
  title: string;
  uuid: string;
}

export interface TagRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{ userId: number; title: string }>;
}

export interface TagRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface TagRepositoryFindManyInput {
  where?: {
    userId: number;
  };
}

export interface TagRepositoryFindManyPaginatedInput {
  where?: {
    userId: number;
  };
  options?: Paginate;
}

export interface TagRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}
