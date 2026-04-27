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
  streak: { current: number; record: number };
  hourlyHeatmap: Array<{ dayOfWeek: number; hour: number; count: number }>;
  sessions: {
    avgDuration: number;
    avgQuotes: number;
    total: number;
    distribution: { under1: number; from1to5: number; from5to15: number; over15: number };
  };
  rereadRate: {
    percentage: number;
    topRereads: Array<{ quoteUuid: string; content: string; author: string; count: number }>;
  };
  authorBubbles: Array<{ uuid: string; name: string; quotesRead: number; engagementRate: number }>;
}

export interface GetInsightsPayload {
  month: string;
}

export interface GetAnnualInsightsPayload {
  year: string;
}

export interface AnnualInsightsResponse {
  year: number;
  months: Array<{
    month: string;
    reads: number;
    favorites: number;
    shares: number;
    diversityScore: number;
  }>;
}

export interface CompareMonthsPayload {
  monthA: string;
  monthB: string;
}

export interface MonthSummary {
  month: string;
  quotesRead: number;
  quotesFavorited: number;
  quotesShared: number;
  authorsFavorited: number;
  tagsCreated: number;
  uniqueAuthors: number;
}

export interface CompareMonthsResponse {
  monthA: MonthSummary;
  monthB: MonthSummary;
  deltas: Record<string, number>;
}

export abstract class InsightsServiceContract {
  public abstract get(payload: GetInsightsPayload): Promise<InsightsResponse>;

  public abstract getAnnual(payload: GetAnnualInsightsPayload): Promise<AnnualInsightsResponse>;

  public abstract compare(payload: CompareMonthsPayload): Promise<CompareMonthsResponse>;
}
