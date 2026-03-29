export const queryKeys = {
  quotes: {
    all: ['quotes'] as const,
    list: (filters?: {
      tagUuid?: string;
      authorUuid?: string;
      categoryUuid?: string;
      favoritesOnly?: boolean;
      search?: string;
    }) => ['quotes', filters] as const,
    detail: (uuid: string) => ['quotes', uuid] as const,
    isTagged: (quoteUuid: string, tagUuid: string) => ['quotes', 'is-tagged', quoteUuid, tagUuid] as const,
  },
  authors: {
    all: ['authors'] as const,
    list: (filters?: { search?: string }) => ['authors', filters] as const,
    detail: (uuid: string) => ['authors', uuid] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  search: {
    query: (q: string) => ['search', q],
  },
} as const;
