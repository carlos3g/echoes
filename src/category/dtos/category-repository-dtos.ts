import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface CategoryRepositoryCreateInput {
  title: string;
  uuid: string;
}

export interface CategoryRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{ title: string }>;
}

export interface CategoryRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface CategoryRepositoryFindManyInput {
  where?: { title: string };
}

export interface CategoryRepositoryFindManyPaginatedInput {
  where?: { title: string };
  options: Required<Paginate>;
}

export interface CategoryRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}
