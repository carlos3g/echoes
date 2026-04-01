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
}

export { InsightRepositoryContract };
