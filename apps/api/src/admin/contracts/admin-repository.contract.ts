import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { User } from '@app/user/entities/user.entity';

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

export interface AdminListUsersPaginatedInput {
  search?: string;
  options?: { page?: number; perPage?: number };
}

abstract class AdminRepositoryContract {
  public abstract getAnalyticsOverview(): Promise<AnalyticsOverview>;

  public abstract getUserGrowth(days: number): Promise<UserGrowthPoint[]>;

  public abstract getQuoteActivity(days: number): Promise<QuoteActivityPoint[]>;

  public abstract listUsersPaginated(input: AdminListUsersPaginatedInput): Promise<PaginatedResult<User>>;
}

export { AdminRepositoryContract };
