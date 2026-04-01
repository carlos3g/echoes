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
    const rows = await this.prismaManager.getClient().$queryRawUnsafe<DayRow[]>(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM ${table}
       WHERE "userId" = $1 AND created_at >= $2 AND created_at < $3
       GROUP BY DATE(created_at)`,
      uid,
      range.start,
      range.end
    );
    return new Map(rows.map((r) => [String(r.date), Number(r.count)]));
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
    type Row = { name: string; quotes_read: bigint; uuid: string };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT a.name, a.uuid, COUNT(*) as quotes_read
       FROM ${this.quoteViews} qv
       JOIN ${this.quotes} q ON q.id = qv."quoteId"
       JOIN ${this.authors} a ON a.id = q."authorId"
       WHERE qv."userId" = $1 AND qv.created_at >= $2 AND qv.created_at < $3
         AND q."authorId" IS NOT NULL
       GROUP BY a.id, a.name, a.uuid
       ORDER BY quotes_read DESC
       LIMIT $4`,
      uid,
      range.start,
      range.end,
      limit
    );

    return rows.map((r) => ({ name: r.name, quotesRead: Number(r.quotes_read), uuid: r.uuid }));
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
    type Row = { reread_count: bigint };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT COALESCE(SUM(view_count - 1), 0) as reread_count
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

    return Number(rows[0]?.reread_count ?? 0);
  }

  public async getAvgQuotesPerAuthor(userId: number, range: InsightRepositoryDateRange): Promise<number> {
    type Row = { avg_quotes: number };
    const uid = BigInt(userId);

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT COALESCE(AVG(quote_count), 0) as avg_quotes
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

    return Number(rows[0]?.avg_quotes ?? 0);
  }
}
