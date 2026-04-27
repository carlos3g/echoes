import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface SourceRepositoryCreateInput {
  quoteId: number;
  title: string;
  uuid: string;
}

export interface SourceRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{ quoteId: number; title: string }>;
}

export interface SourceRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface SourceRepositoryFindManyInput {
  where?: {
    quoteId: number;
  };
}

export interface SourceRepositoryFindManyPaginatedInput {
  where?: {
    quoteId: number;
  };
  options?: Paginate;
}

export interface SourceRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}
