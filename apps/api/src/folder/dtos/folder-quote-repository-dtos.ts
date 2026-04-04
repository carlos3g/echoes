import type { Paginate } from '@app/shared/dtos/paginate';

export interface FolderQuoteRepositoryCreateInput {
  folderId: number;
  quoteId: number;
  addedById: number;
  position?: number;
}

export interface FolderQuoteRepositoryDeleteInput {
  where: {
    folderId: number;
    quoteId: number;
  };
}

export interface FolderQuoteRepositoryFindInput {
  where: {
    folderId: number;
    quoteId: number;
  };
}

export interface FolderQuoteRepositoryFindManyPaginatedInput {
  where: {
    folderId: number;
  };
  options?: Paginate;
}

export interface FolderQuoteRepositoryCountInput {
  folderId: number;
}

export interface FolderQuoteRepositoryUpdatePositionsInput {
  folderId: number;
  orderedQuoteIds: number[];
}
