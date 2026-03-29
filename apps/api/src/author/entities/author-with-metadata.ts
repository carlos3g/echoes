import type { Author } from '@app/author/entities/author.entity';

export type AuthorWithMetadata = Author & {
  metadata: {
    totalQuotes: number;
    totalFavorites: number;
    favoritedByUser: boolean;
  };
};
