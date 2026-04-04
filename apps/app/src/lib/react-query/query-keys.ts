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
    annual: (year: string) => ['insights', 'annual', year] as const,
    compare: (monthA: string, monthB: string) => ['insights', 'compare', monthA, monthB] as const,
  },
  activity: {
    all: ['activity'] as const,
  },
  folders: {
    all: ['folders'] as const,
    detail: (uuid: string) => ['folders', uuid] as const,
    quotes: (uuid: string) => ['folders', uuid, 'quotes'] as const,
    members: (uuid: string) => ['folders', uuid, 'members'] as const,
    followers: (uuid: string) => ['folders', uuid, 'followers'] as const,
    search: (q: string) => ['folders', 'search', q] as const,
    popular: ['folders', 'popular'] as const,
    userPublic: (username: string) => ['folders', 'user', username] as const,
  },
  feed: {
    all: ['feed'] as const,
  },
  users: {
    profile: (username: string) => ['users', username, 'profile'] as const,
    followers: (username: string) => ['users', username, 'followers'] as const,
    following: (username: string) => ['users', username, 'following'] as const,
    search: (q: string) => ['users', 'search', q] as const,
    suggested: ['users', 'suggested'] as const,
  },
} as const;
