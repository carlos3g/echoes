import { InsightRepositoryContract } from '@app/insight/contracts/insight-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export type GetMonthlyInsightsInput = {
  month: string;
  user: User;
};

export type GetMonthlyInsightsOutput = {
  month: string;
  previousMonth: string;
  summary: {
    quotesRead: { current: number; previous: number };
    quotesFavorited: { current: number; previous: number };
    quotesShared: { current: number; previous: number };
    authorsFavorited: { current: number; previous: number };
    tagsCreated: { current: number; previous: number };
    uniqueAuthors: { current: number; previous: number };
  };
  dailyActivity: Array<{ date: string; reads: number; favorites: number; shares: number }>;
  weeklyActivity: Array<{ week: number; reads: number; favorites: number; shares: number }>;
  topCategories: Array<{ title: string; count: number; percentage: number }>;
  heatmap: Array<{ date: string; count: number; intensity: number }>;
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
};

@Injectable()
export class GetMonthlyInsightsUseCase implements UseCaseHandler {
  public constructor(private readonly insightRepository: InsightRepositoryContract) {}

  public async handle(input: GetMonthlyInsightsInput): Promise<GetMonthlyInsightsOutput> {
    const { month, user } = input;

    const [year, monthNum] = month.split('-').map(Number) as [number, number];

    const currentStart = new Date(year, monthNum - 1, 1);
    const currentEnd = new Date(year, monthNum, 1);

    const previousStart = new Date(year, monthNum - 2, 1);
    const previousEnd = new Date(year, monthNum - 1, 1);

    const previousMonth = `${String(previousStart.getFullYear())}-${String(previousStart.getMonth() + 1).padStart(2, '0')}`;

    const currentRange = { start: currentStart, end: currentEnd };
    const previousRange = { start: previousStart, end: previousEnd };

    const [
      currentReads,
      previousReads,
      currentFavorites,
      previousFavorites,
      currentShares,
      previousShares,
      currentAuthorFavorites,
      previousAuthorFavorites,
      currentTagsCreated,
      previousTagsCreated,
      currentUniqueAuthors,
      previousUniqueAuthors,
      dailyActivity,
      topCategoriesRaw,
      topAuthors,
      sharesByPlatform,
      rereadCount,
      avgQuotesPerAuthor,
      hourlyHeatmap,
      sessionMetrics,
      topRereads,
      authorBubbles,
      currentStreak,
      longestStreak,
    ] = await Promise.all([
      this.insightRepository.countQuoteViews(user.id, currentRange),
      this.insightRepository.countQuoteViews(user.id, previousRange),
      this.insightRepository.countQuoteFavorites(user.id, currentRange),
      this.insightRepository.countQuoteFavorites(user.id, previousRange),
      this.insightRepository.countShares(user.id, currentRange),
      this.insightRepository.countShares(user.id, previousRange),
      this.insightRepository.countAuthorFavorites(user.id, currentRange),
      this.insightRepository.countAuthorFavorites(user.id, previousRange),
      this.insightRepository.countTagsCreated(user.id, currentRange),
      this.insightRepository.countTagsCreated(user.id, previousRange),
      this.insightRepository.countUniqueAuthorsRead(user.id, currentRange),
      this.insightRepository.countUniqueAuthorsRead(user.id, previousRange),
      this.insightRepository.getDailyActivity(user.id, currentRange),
      this.insightRepository.getTopCategories(user.id, currentRange, 3),
      this.insightRepository.getTopAuthors(user.id, currentRange, 5),
      this.insightRepository.getSharesByPlatform(user.id, currentRange),
      this.insightRepository.getRereadCount(user.id, currentRange),
      this.insightRepository.getAvgQuotesPerAuthor(user.id, currentRange),
      this.insightRepository.getHourlyHeatmap(user.id, currentRange),
      this.insightRepository.getSessionMetrics(user.id, currentRange),
      this.insightRepository.getTopRereads(user.id, currentRange, 5),
      this.insightRepository.getAuthorBubbles(user.id, currentRange, 3),
      this.insightRepository.getCurrentStreak(user.id),
      this.insightRepository.getLongestStreak(user.id),
    ]);

    if (currentStreak > longestStreak) {
      await this.insightRepository.updateLongestStreak(user.id, currentStreak);
    }

    const summary = {
      quotesRead: { current: currentReads, previous: previousReads },
      quotesFavorited: { current: currentFavorites, previous: previousFavorites },
      quotesShared: { current: currentShares, previous: previousShares },
      authorsFavorited: { current: currentAuthorFavorites, previous: previousAuthorFavorites },
      tagsCreated: { current: currentTagsCreated, previous: previousTagsCreated },
      uniqueAuthors: { current: currentUniqueAuthors, previous: previousUniqueAuthors },
    };

    // Weekly activity: group daily activity by week (ceil(dayOfMonth/7))
    const weeklyMap = new Map<number, { reads: number; favorites: number; shares: number }>();

    for (const day of dailyActivity) {
      const dayOfMonth = new Date(day.date).getUTCDate();
      const week = Math.ceil(dayOfMonth / 7);

      const existing = weeklyMap.get(week) ?? { reads: 0, favorites: 0, shares: 0 };
      weeklyMap.set(week, {
        reads: existing.reads + day.reads,
        favorites: existing.favorites + day.favorites,
        shares: existing.shares + day.shares,
      });
    }

    const weeklyActivity = Array.from(weeklyMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([week, data]) => ({ week, ...data }));

    // Heatmap derived from dailyActivity reads
    const heatmapRaw = dailyActivity.map((d) => ({ date: d.date, count: d.reads }));

    const heatmap = heatmapRaw.map((h) => {
      let intensity: number;

      if (h.count === 0) {
        intensity = 0;
      } else if (h.count <= 2) {
        intensity = 1;
      } else if (h.count <= 5) {
        intensity = 2;
      } else {
        intensity = 3;
      }

      return { ...h, intensity };
    });

    // Top categories with percentage and "Outros" bucket
    const totalCategoryCount = topCategoriesRaw.reduce((sum, c) => sum + c.count, 0);
    const othersCount = currentReads - topCategoriesRaw.reduce((sum, c) => sum + c.count, 0);

    const topCategories = topCategoriesRaw.map((c) => ({
      title: c.title,
      count: c.count,
      percentage: totalCategoryCount > 0 ? Math.round((c.count / totalCategoryCount) * 100) : 0,
    }));

    if (othersCount > 0) {
      topCategories.push({
        title: 'Outros',
        count: othersCount,
        percentage: totalCategoryCount > 0 ? Math.round((othersCount / totalCategoryCount) * 100) : 0,
      });
    }

    // Reading profile
    const totalReads = currentReads;
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const daysActive = new Set(dailyActivity.map((d) => d.date)).size;

    let readingProfile: {
      exploration: number;
      collection: number;
      sharing: number;
      consistency: number;
      depth: number;
    };

    if (totalReads === 0) {
      readingProfile = { exploration: 0, collection: 0, sharing: 0, consistency: 0, depth: 0 };
    } else {
      readingProfile = {
        exploration: Math.min(100, Math.round((currentUniqueAuthors / totalReads) * 200)),
        collection: Math.min(100, Math.round(((currentFavorites + currentTagsCreated) / totalReads) * 150)),
        sharing: Math.min(100, Math.round((currentShares / totalReads) * 300)),
        consistency: Math.round((daysActive / daysInMonth) * 100),
        depth: Math.min(100, Math.round((rereadCount / totalReads) * 200 + avgQuotesPerAuthor * 10)),
      };
    }

    const rereadPercentage = currentReads > 0 ? Math.round((rereadCount / currentReads) * 100) : 0;

    return {
      month,
      previousMonth,
      summary,
      dailyActivity,
      weeklyActivity,
      topCategories,
      heatmap,
      readingProfile,
      topAuthors,
      sharesByPlatform,
      streak: { current: currentStreak, record: Math.max(currentStreak, longestStreak) },
      hourlyHeatmap,
      sessions: sessionMetrics,
      rereadRate: {
        percentage: rereadPercentage,
        topRereads,
      },
      authorBubbles,
    };
  }
}
