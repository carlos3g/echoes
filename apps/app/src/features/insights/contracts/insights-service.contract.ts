export interface InsightsSummaryItem {
  current: number;
  previous: number;
}

export interface InsightsResponse {
  month: string;
  previousMonth: string;
  summary: {
    quotesRead: InsightsSummaryItem;
    quotesFavorited: InsightsSummaryItem;
    authorsFavorited: InsightsSummaryItem;
    quotesShared: InsightsSummaryItem;
    tagsCreated: InsightsSummaryItem;
    uniqueAuthors: InsightsSummaryItem;
  };
  dailyActivity: Array<{ date: string; reads: number; favorites: number; shares: number }>;
  weeklyActivity: Array<{ week: number; reads: number; favorites: number; shares: number }>;
  topCategories: Array<{ title: string; count: number; percentage: number }>;
  heatmap: Array<{ date: string; intensity: number }>;
  readingProfile: {
    exploration: number;
    collection: number;
    sharing: number;
    consistency: number;
    depth: number;
  };
  topAuthors: Array<{ name: string; quotesRead: number; uuid: string }>;
  sharesByPlatform: Array<{ platform: string; count: number }>;
}

export interface GetInsightsPayload {
  month: string;
}

export abstract class InsightsServiceContract {
  public abstract get(payload: GetInsightsPayload): Promise<InsightsResponse>;
}
