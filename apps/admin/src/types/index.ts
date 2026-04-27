export interface User {
  uuid: string;
  name: string;
  email: string;
  username: string;
  bio: string | null;
  emailVerifiedAt: string | null;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  uuid: string;
  body: string;
  author?: Author | null;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  uuid: string;
  name: string;
  birthDate: string;
  deathDate: string | null;
  bio: string;
  nationality: string | null;
  wikipediaUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  uuid: string;
  name: string;
  description: string | null;
  color: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AnalyticsOverview {
  totalUsers: number;
  totalQuotes: number;
  totalAuthors: number;
  totalFolders: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  quotesViewedToday: number;
}

export interface UserGrowthPoint {
  date: string;
  users: number;
}

export interface QuoteActivityPoint {
  date: string;
  views: number;
  shares: number;
  favorites: number;
}
