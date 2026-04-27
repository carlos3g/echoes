import type {
  ActivityItem,
  ActivityRepositoryContract,
  ListActivityPaginatedResult,
} from '@app/activity/contracts/activity-repository.contract';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaActivityRepository implements ActivityRepositoryContract {
  private readonly userFavoriteQuotes: string;
  private readonly userFavoriteAuthors: string;
  private readonly quoteShares: string;
  private readonly tags: string;
  private readonly quotes: string;
  private readonly authors: string;

  public constructor(
    private readonly prismaManager: PrismaManagerService,
    configService: ConfigService
  ) {
    const s = configService.get<string>('DB_SCHEMA') || 'public';
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) {
      throw new Error(`Invalid DB_SCHEMA: ${s}`);
    }
    this.userFavoriteQuotes = `"${s}"."user_favorite_quotes"`;
    this.userFavoriteAuthors = `"${s}"."user_favorite_authors"`;
    this.quoteShares = `"${s}"."quote_shares"`;
    this.tags = `"${s}"."tags"`;
    this.quotes = `"${s}"."quotes"`;
    this.authors = `"${s}"."authors"`;
  }

  public async listPaginated(userId: number, page: number, perPage: number): Promise<ListActivityPaginatedResult> {
    const uid = BigInt(userId);
    const offset = (page - 1) * perPage;
    const limit = perPage + 1;

    type Row = {
      type: string;
      timestamp: Date;
      quoteUuid: string | null;
      quoteContent: string | null;
      authorName: string | null;
      authorUuid: string | null;
      tagUuid: string | null;
      tagTitle: string | null;
      platform: string | null;
    };

    const rows = await this.prismaManager.getClient().$queryRawUnsafe<Row[]>(
      `SELECT * FROM (
        SELECT 'favorite_quote' as type, ufq.created_at as timestamp,
               q.uuid as "quoteUuid", q.body as "quoteContent", a.name as "authorName",
               NULL::text as "authorUuid", NULL::text as "tagUuid", NULL::text as "tagTitle", NULL::text as platform
        FROM ${this.userFavoriteQuotes} ufq
        JOIN ${this.quotes} q ON q.id = ufq."quoteId"
        LEFT JOIN ${this.authors} a ON a.id = q."authorId"
        WHERE ufq."userId" = $1

        UNION ALL

        SELECT 'favorite_author', ufa.created_at,
               NULL, NULL, a.name,
               a.uuid, NULL, NULL, NULL
        FROM ${this.userFavoriteAuthors} ufa
        JOIN ${this.authors} a ON a.id = ufa."authorId"
        WHERE ufa."userId" = $1

        UNION ALL

        SELECT 'share', qs.created_at,
               q.uuid, q.body, a.name,
               NULL, NULL, NULL, qs.platform
        FROM ${this.quoteShares} qs
        JOIN ${this.quotes} q ON q.id = qs."quoteId"
        LEFT JOIN ${this.authors} a ON a.id = q."authorId"
        WHERE qs."userId" = $1

        UNION ALL

        SELECT 'tag_created', t.created_at,
               NULL, NULL, NULL,
               NULL, t.uuid, t.title, NULL
        FROM ${this.tags} t
        WHERE t."userId" = $1
      ) activity
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3`,
      uid,
      limit,
      offset
    );

    const hasMore = rows.length > perPage;
    const data: ActivityItem[] = rows.slice(0, perPage).map((row) => ({
      type: row.type as ActivityItem['type'],
      timestamp: row.timestamp,
      quoteUuid: row.quoteUuid,
      quoteContent: row.quoteContent,
      authorName: row.authorName,
      authorUuid: row.authorUuid,
      tagUuid: row.tagUuid,
      tagTitle: row.tagTitle,
      platform: row.platform,
    }));

    return { data, hasMore };
  }
}
