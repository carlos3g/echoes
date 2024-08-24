import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface QuoteRepositoryCreateInput {
  authorId?: number;
  body: string;
  uuid: string;
}

export interface QuoteRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{ authorId: number; body: string }>;
}

export interface QuoteRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface QuoteRepositoryFindManyInput {
  where?: {
    authorId: number;
  };
}

export interface QuoteRepositoryFindManyPaginatedInput {
  where?: {
    authorId: number;
  };
  options: Required<Paginate>;
}

export interface QuoteRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}
