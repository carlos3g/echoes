import type {
  InsightRepositoryContract,
  InsightRepositoryDateRange,
} from '@app/insight/contracts/insight-repository.contract';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaInsightRepository implements InsightRepositoryContract {
  private readonly quoteViews: string;
  private readonly quotes: string;
  private readonly authors: string;
  private readonly categories: string;
  private readonly userFavoriteQuotes: string;
  private readonly userFavoriteAuthors: string;
  private readonly quoteShares: string;
  private readonly tags: string;
  private readonly categoryToQuote: string;
  private readonly userSessions: string;

  public constructor(
    private readonly prismaManager: PrismaManagerService,
    configService: ConfigService
  ) {
    const s = configService.get<string>('DB_SCHEMA') || 'public';
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) {
      throw new Error(`Invalid DB_SCHEMA: ${s}`);
    }
    this.quoteViews = `"${s}"."quote_views"`;
    this.quotes = `"${s}"."quotes"`;
    this.authors = `"${s}"."authors"`;
    this.categories = `"${s}"."categories"`;
    this.userFavoriteQuotes = `"${s}"."user_favorite_quotes"`;
    this.userFavoriteAuthors = `"${s}"."user_favorite_authors"`;
    this.quoteShares = `"${s}"."quote_shares"`;
    this.tags = `"${s}"."tags"`;
    this.categoryToQuote = `"${s}"."_CategoryToQuote"`;
    this.userSessions = `"${s}"."user_sessions"`;
  }

  public async countQuoteViews(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    return this.prismaManager.getClient().quoteView.count({
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
    });
  }

  public async countQuoteFavorites(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    return this.prismaManager.getClient().userFavoriteQuote.count({
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
    });
  }

  public async countAuthorFavorites(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    return this.prismaManager.getClient().userFavoriteAuthor.count({
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
    });
  }

  public async countShares(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    return this.prismaManager.getClient().quoteShare.count({
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
    });
  }

  public async countTagsCreated(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    return this.prismaManager.getClient().tag.count({
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
    });
  }

  public async countUniqueAuthorsRead(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    type Row = { count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT COUNT(DISTINCT q."authorId") as count
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       WHERE qv."userId" = $1
         AND qv.created_at >= $2
         AND qv.created_at < $3
         AND q."authorId" IS NOT NULL`,
      uid,
      range.start,
      range.end
    );

    return Number(rows[0]?.count ?? 0);
  }

  public async getDailyActivity(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ date: string; reads: number; favorites: number; shares: number }>> {
    const uid = BigInt(userId);

    const [readsMap, favoritesMap, sharesMap] = await Promise.all([
      this.countByDay(this.quoteViews, uid, range),
      this.countByDay(this.userFavoriteQuotes, uid, range),
      this.countByDay(this.quoteShares, uid, range),
    ]);

    const allDates = new Set([...readsMap.keys(), ...favoritesMap.keys(), ...sharesMap.keys()]);

    return Array.from(allDates)
      .sort()
      .map((date) => ({
        date,
        reads: readsMap.get(date) ?? 0,
        favorites: favoritesMap.get(date) ?? 0,
        shares: sharesMap.get(date) ?? 0,
      }));
  }

  private async countByDay(
    table: string,
    uid: bigint,
    range: InsightRepositoryDateRange
  ): Promise<Map<string, number>> {
    type DayRow = { date: string; count: bigint };
    // Use UTC explicitly so date bucketing doesn't shift with DB session timezone.
    const rows = await this.prismaManager.getClient().$queryRawUnsafe<DayRow[]>(
      `SELECT to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') as date, COUNT(*) as count
       FROM ${table}
       WHERE "userId" = $1 AND created_at >= $2 AND created_at < $3
       GROUP BY to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
      uid,
      range.start,
      range.end
    );
    return new Map(rows.map((r) => [r.date, Number(r.count)]));
  }

  public async getTopCategories(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ title: string; count: number }>> {
    type Row = { title: string; count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT c.title, COUNT(*) as count
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       JOIN ${this.categoryToQuote} cq ON cq."B" = q.id
       JOIN ${this.categories} c ON c.id = cq."A"
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
       GROUP BY c.title
       ORDER BY count DESC
       LIMIT $4`,
      uid,
      range.start,
      range.end,
      limit
    );

    return rows.map((r) => ({ title: r.title, count: Number(r.count) }));
  }

  public async getTopAuthors(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ name: string; quotesRead: number; uuid: string }>> {
    type Row = { name: string; quotesRead: bigint; uuid: string };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT a.name, a.uuid, COUNT(*) as "quotesRead"
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       JOIN ${this.authors} a ON a.id = q."authorId"
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
         AND q."authorId" IS NOT NULL
       GROUP BY a.id, a.name, a.uuid
       ORDER BY "quotesRead" DESC
       LIMIT $4`,
      uid,
      range.start,
      range.end,
      limit
    );

    return rows.map((r) => ({ name: r.name, quotesRead: Number(r.quotesRead), uuid: r.uuid }));
  }

  public async getSharesByPlatform(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ platform: string; count: number }>> {
    const groups = await this.prismaManager.getClient().quoteShare.groupBy({
      by: ['platform'],
      where: {
        userId: BigInt(userId),
        createdAt: { gte: range.start, lt: range.end },
      },
      _count: { platform: true },
      orderBy: { _count: { platform: 'desc' } },
    });

    return groups.map((g) => ({
      platform: g.platform ?? 'unknown',
      count: g._count.platform,
    }));
  }

  public async getRereadCount(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    type Row = { rereadCount: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT COALESCE(SUM(view_count - 1), 0) as "rereadCount"
       FROM (
         SELECT COUNT(*) as view_count
         FROM ${this.quoteViews}
         WHERE "userId" = $1 AND created_at >= $2 AND created_at < $3
         GROUP BY "quoteId"
         HAVING COUNT(*) > 1
       ) sub`,
      uid,
      range.start,
      range.end
    );

    return Number(rows[0]?.rereadCount ?? 0);
  }

  public async getAvgQuotesPerAuthor(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    type Row = { avgQuotes: number };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT COALESCE(AVG(quote_count), 0) as "avgQuotes"
       FROM (
         SELECT q."authorId", COUNT(DISTINCT qv."quoteId") as quote_count
         FROM ${this.quoteViews} qv
         JOIN ${this.quotes} q ON q.id = qv."quoteId"
         WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
           AND q."authorId" IS NOT NULL
         GROUP BY q."authorId"
       ) sub`,
      uid,
      range.start,
      range.end
    );

    return Number(rows[0]?.avgQuotes ?? 0);
  }

  public async getCurrentStreak(userId: number): Promise<number> {
    type Row = { viewDate: Date };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT DISTINCT DATE(created_at) as "viewDate"
       FROM ${this.quoteViews}
       WHERE "userId" = $1
       ORDER BY "viewDate" DESC
       LIMIT 365`,
      uid
    );

    if (rows.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecent = new Date(rows[0].viewDate);
    mostRecent.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    let streak = 1;
    for (let i = 1; i < rows.length; i++) {
      const current = new Date(rows[i - 1].viewDate);
      const previous = new Date(rows[i].viewDate);
      current.setHours(0, 0, 0, 0);
      previous.setHours(0, 0, 0, 0);

      const gap = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      if (gap === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  public async getLongestStreak(userId: number): Promise<number> {
    const user = await this.prismaManager.getClient().user.findUnique({
      where: { id: BigInt(userId) },
      select: { longestStreak: true },
    });

    return user?.longestStreak ?? 0;
  }

  public async updateLongestStreak(userId: number, streak: number): Promise<void> {
    await this.prismaManager.getClient().user.update({
      where: { id: BigInt(userId) },
      data: { longestStreak: streak },
    });
  }

  public async getHourlyHeatmap(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<Array<{ dayOfWeek: number; hour: number; count: number }>> {
    type Row = { dayOfWeek: number; hour: number; count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT EXTRACT(DOW FROM created_at)::int as "dayOfWeek",
              EXTRACT(HOUR FROM created_at)::int as hour,
              COUNT(*) as count
       FROM ${this.quoteViews}
       WHERE "userId" = $1 AND created_at >= $2 AND created_at < $3
       GROUP BY "dayOfWeek", hour`,
      uid,
      range.start,
      range.end
    );

    return rows.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      hour: r.hour,
      count: Number(r.count),
    }));
  }

  public async getSessionMetrics(
    userId: number,
    range: InsightRepositoryDateRange
  ): Promise<{
    avgDuration: number;
    avgQuotes: number;
    total: number;
    distribution: { under1: number; from1to5: number; from5to15: number; over15: number };
  }> {
    type Row = {
      total: bigint;
      avgDuration: number;
      avgQuotes: number;
      under1: bigint;
      from1to5: bigint;
      from5to15: bigint;
      over15: bigint;
    };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT
         COUNT(*) as total,
         COALESCE(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))), 0) as "avgDuration",
         COALESCE(AVG(quotes_viewed), 0) as "avgQuotes",
         COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ended_at - started_at)) < 60) as under1,
         COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ended_at - started_at)) >= 60 AND EXTRACT(EPOCH FROM (ended_at - started_at)) < 300) as from1to5,
         COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ended_at - started_at)) >= 300 AND EXTRACT(EPOCH FROM (ended_at - started_at)) < 900) as from5to15,
         COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ended_at - started_at)) >= 900) as over15
       FROM ${this.userSessions}
       WHERE "userId" = $1 AND started_at >= $2 AND started_at < $3`,
      uid,
      range.start,
      range.end
    );

    const row = rows[0];
    return {
      avgDuration: Number(row?.avgDuration ?? 0),
      avgQuotes: Number(row?.avgQuotes ?? 0),
      total: Number(row?.total ?? 0),
      distribution: {
        under1: Number(row?.under1 ?? 0),
        from1to5: Number(row?.from1to5 ?? 0),
        from5to15: Number(row?.from5to15 ?? 0),
        over15: Number(row?.over15 ?? 0),
      },
    };
  }

  public async getTopRereads(
    userId: number,
    range: InsightRepositoryDateRange,
    limit: number
  ): Promise<Array<{ quoteUuid: string; content: string; author: string; count: number }>> {
    type Row = { uuid: string; body: string; authorName: string; count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT q.uuid, q.body, COALESCE(a.name, 'Unknown') as "authorName", COUNT(*) as count
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       LEFT JOIN ${this.authors} a ON a.id = q."authorId"
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
       GROUP BY q.id, q.uuid, q.body, a.name
       HAVING COUNT(*) > 1
       ORDER BY "count" DESC
       LIMIT $4`,
      uid,
      range.start,
      range.end,
      limit
    );

    return rows.map((r) => ({
      quoteUuid: r.uuid,
      content: r.body,
      author: r.authorName,
      count: Number(r.count),
    }));
  }

  public async getAuthorBubbles(
    userId: number,
    range: InsightRepositoryDateRange,
    minReads: number
  ): Promise<Array<{ uuid: string; name: string; quotesRead: number; engagementRate: number }>> {
    type Row = { uuid: string; name: string; quotesRead: bigint; engagementRate: number };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT
         a.uuid,
         a.name,
         COUNT(qv.id) as "quotesRead",
         COALESCE(
           (COUNT(DISTINCT ufq.id) + COUNT(DISTINCT qs.id))::float / NULLIF(COUNT(qv.id), 0),
           0
         ) as "engagementRate"
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       JOIN ${this.authors} a ON a.id = q."authorId"
       LEFT JOIN ${this.userFavoriteQuotes} ufq ON ufq."quoteId" = q.id AND ufq."userId" = $1
       LEFT JOIN ${this.quoteShares} qs ON qs."quoteId" = q.id AND qs."userId" = $1
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
         AND q."authorId" IS NOT NULL
       GROUP BY a.id, a.uuid, a.name
       HAVING COUNT(qv.id) >= $4
       ORDER BY "quotesRead" DESC
       LIMIT 20`,
      uid,
      range.start,
      range.end,
      minReads
    );

    return rows.map((r) => ({
      uuid: r.uuid,
      name: r.name,
      quotesRead: Number(r.quotesRead),
      engagementRate: Number(r.engagementRate),
    }));
  }

  public async getDiversityScore(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    type Row = { categoryId: bigint; count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT cq."A" as "categoryId", COUNT(*) as count
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       JOIN ${this.categoryToQuote} cq ON cq."B" = q.id
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
       GROUP BY cq."A"`,
      uid,
      range.start,
      range.end
    );

    if (rows.length === 0) return 0;

    const totalCategories = await this.prismaManager.getClient().category.count();
    if (totalCategories <= 1) return 100;

    const totalReads = rows.reduce((sum, r) => sum + Number(r.count), 0);
    let entropy = 0;

    for (const row of rows) {
      const p = Number(row.count) / totalReads;
      if (p > 0) {
        entropy -= p * Math.log(p);
      }
    }

    const maxEntropy = Math.log(totalCategories);
    const normalizedScore = (entropy / maxEntropy) * 100;

    return Math.round(normalizedScore * 100) / 100;
  }
}
