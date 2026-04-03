export type InsightRepositoryDateRange = { start: Date; end: Date };

abstract class InsightRepositoryContract {
  public abstract countQuoteViews(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract countQuoteFavorites(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract countAuthorFavorites(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract countShares(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract countTagsCreated(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract countUniqueAuthorsRead(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract getDailyActivity(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ date: string; reads: number; favorites: number; shares: number }>>;

  public abstract getTopCategories(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ title: string; count: number }>>;

  public abstract getTopAuthors(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ name: string; quotesRead: number; uuid: string }>>;

  public abstract getSharesByPlatform(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ platform: string; count: number }>>;

  public abstract getRereadCount(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract getAvgQuotesPerAuthor(userId: number, range: InsightRepositoryDateRange): Promise<number>;

  public abstract getCurrentStreak(userId: number): Promise<number>;
  public abstract getLongestStreak(userId: number): Promise<number>;
  public abstract updateLongestStreak(userId: number, streak: number): Promise<void>;

  public abstract getHourlyHeatmap(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ dayOfWeek: number; hour: number; count: number }>>;

  public abstract getSessionMetrics(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<{
    avgDuration: number;
    avgQuotes: number;
    total: number;
    distribution: { under1: number; from1to5: number; from5to15: number; over15: number };
  }>;

  public abstract getTopRereads(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ quoteUuid: string; content: string; author: string; count: number }>>;

  public abstract getAuthorBubbles(
    userId: number,
    range: InsightRepositoryDateRange,
    minReads: number
  ): Promise<Array<{ uuid: string; name: string; quotesRead: number; engagementRate: number }>>;

  public abstract getDiversityScore(userId: number, range: InsightRepositoryDateRange): Promise<number>;
}

export { InsightRepositoryContract };
