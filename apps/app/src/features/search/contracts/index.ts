export interface QuoteSearchResult {
  uuid: string;
  body: string;
  author: { uuid: string; name: string } | null;
  metadata: {
    favorites: number;
    tags: number;
    favoritedByUser: boolean;
  };
  relevance: number;
}

export interface AuthorSearchResult {
  uuid: string;
  name: string;
  bio: string;
  relevance: number;
}

export interface CategorySearchResult {
  uuid: string;
  title: string;
  relevance: number;
}

export interface SearchResult {
  quotes: QuoteSearchResult[];
  authors: AuthorSearchResult[];
  categories: CategorySearchResult[];
}
