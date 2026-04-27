import { calcSkip, getMeta } from '@app/lib/prisma/helpers/pagination';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaUserToUserAdapter } from '@app/user/adapters';
import type { User } from '@app/user/entities/user.entity';
import type {
  AdminListUsersPaginatedInput,
  AdminRepositoryContract,
  AnalyticsOverview,
  QuoteActivityPoint,
  UserGrowthPoint,
} from '@app/admin/contracts/admin-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAdminRepository implements AdminRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const client = this.prismaManager.getClient();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [userStats, otherCounts] = await Promise.all([
      client.$queryRaw<[{ total: bigint; today: bigint; week: bigint; month: bigint }]>`
        SELECT
          COUNT(*)::bigint AS total,
          COUNT(*) FILTER (WHERE created_at >= ${startOfToday})::bigint AS today,
          COUNT(*) FILTER (WHERE created_at >= ${startOfWeek})::bigint AS week,
          COUNT(*) FILTER (WHERE created_at >= ${startOfMonth})::bigint AS month
        FROM users
      `,
      Promise.all([
        client.quote.count(),
        client.author.count(),
        client.folder.count(),
        client.quoteView.count({ where: { createdAt: { gte: startOfToday } } }),
      ]),
    ]);

    const stats = userStats[0];

    return {
      totalUsers: Number(stats.total),
      totalQuotes: otherCounts[0],
      totalAuthors: otherCounts[1],
      totalFolders: otherCounts[2],
      newUsersToday: Number(stats.today),
      newUsersThisWeek: Number(stats.week),
      newUsersThisMonth: Number(stats.month),
      quotesViewedToday: otherCounts[3],
    };
  }

  public async getUserGrowth(days: number): Promise<UserGrowthPoint[]> {
    const client = this.prismaManager.getClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const results: { date: Date; count: bigint }[] = await client.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*)::bigint as count
      FROM users
      WHERE created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return this.fillDateRange(days, results);
  }

  public async getQuoteActivity(days: number): Promise<QuoteActivityPoint[]> {
    const client = this.prismaManager.getClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [viewRows, shareRows, favRows] = await Promise.all([
      client.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*)::bigint as count
        FROM quote_views WHERE created_at >= ${since} GROUP BY DATE(created_at)
      `,
      client.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*)::bigint as count
        FROM quote_shares WHERE created_at >= ${since} GROUP BY DATE(created_at)
      `,
      client.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*)::bigint as count
        FROM user_favorite_quotes WHERE created_at >= ${since} GROUP BY DATE(created_at)
      `,
    ]);

    const viewMap = this.rowsToMap(viewRows);
    const shareMap = this.rowsToMap(shareRows);
    const favMap = this.rowsToMap(favRows);

    const points: QuoteActivityPoint[] = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      points.push({
        date: key,
        views: viewMap.get(key) ?? 0,
        shares: shareMap.get(key) ?? 0,
        favorites: favMap.get(key) ?? 0,
      });
    }

    return points;
  }

  public async listUsersPaginated(input: AdminListUsersPaginatedInput): Promise<PaginatedResult<User>> {
    const page = input.options?.page ?? 1;
    const perPage = input.options?.perPage ?? 20;

    const where = input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { username: { contains: input.search, mode: 'insensitive' as const } },
            { email: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      this.prismaManager.getClient().user.count({ where }),
      this.prismaManager.getClient().user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: calcSkip(page, perPage),
      }),
    ]);

    return {
      data: users.map(prismaUserToUserAdapter),
      meta: getMeta(total, page, perPage),
    };
  }

  private rowsToMap(rows: { date: Date; count: bigint }[]): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of rows) m.set(new Date(r.date).toISOString().split('T')[0], Number(r.count));
    return m;
  }

  private fillDateRange(days: number, rows: { date: Date; count: bigint }[]): UserGrowthPoint[] {
    const map = this.rowsToMap(rows);
    const points: UserGrowthPoint[] = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      points.push({ date: key, users: map.get(key) ?? 0 });
    }
    return points;
  }
}
