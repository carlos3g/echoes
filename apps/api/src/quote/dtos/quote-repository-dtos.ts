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

export interface QuoteRepositoryFindManyFavoritedByUserInput {
  where: {
    userId: number;
  };
}

export interface QuoteRepositoryFindManyByTagInput {
  where: {
    tagId: number;
  };
}

export interface QuoteRepositoryFindManyPaginatedInput {
  where?: {
    authorId?: number;
    tagIds?: number[];
    categoryId?: number;
    search?: string;
    favoritedByUserId?: number;
  };
  options?: Paginate;
}

export interface QuoteRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}

export interface QuoteRepositoryFavoriteInput {
  data: {
    userId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryUnfavoriteInput {
  data: {
    userId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryIsFavoritedInput {
  where: {
    userId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryTagInput {
  data: {
    tagId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryUntagInput {
  data: {
    tagId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryIsTaggedInput {
  where: {
    tagId: number;
    quoteId: number;
  };
}

export interface QuoteRepositoryFindTagsByQuoteAndUserInput {
  quoteId: number;
  userId: number;
}
