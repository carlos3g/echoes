export const queryKeys = {
  quotes: {
    all: ['quotes'] as const,
    list: (filters?: {
      tagUuids?: string[];
      authorUuid?: string;
      categoryUuid?: string;
      favoritesOnly?: boolean;
      search?: string;
    }) => ['quotes', filters] as const,
    detail: (uuid: string) => ['quotes', uuid] as const,
    isTagged: (quoteUuid: string, tagUuid: string) => ['quotes', 'is-tagged', quoteUuid, tagUuid] as const,
    tags: (quoteUuid: string) => ['quotes', quoteUuid, 'tags'] as const,
  },
  authors: {
    all: ['authors'] as const,
    list: (filters?: { search?: string }) => ['authors', filters] as const,
    detail: (uuid: string) => ['authors', uuid] as const,
    daily: ['authors', 'daily'] as const,
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
  insights: {
    monthly: (month: string) => ['insights', month] as const,
  },
  activity: {
    all: ['activity'] as const,
  },
} as const;
