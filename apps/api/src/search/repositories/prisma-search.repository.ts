import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { SearchRepositoryContract } from '@app/search/contracts/search-repository.contract';
import type { QuoteSearchResult, AuthorSearchResult, CategorySearchResult } from '@app/search/dtos/search-result.dto';

/* eslint-disable @typescript-eslint/naming-convention */
interface QuoteRow {
  uuid: string;
  body: string;
  author_uuid: string | null;
  author_name: string | null;
  relevance: number;
  favorites: bigint;
  tags: bigint;
  favorited_by_user: boolean;
}

interface AuthorRow {
  uuid: string;
  name: string;
  bio: string;
  relevance: number;
}

interface CategoryRow {
  uuid: string;
  title: string;
  relevance: number;
}
/* eslint-enable @typescript-eslint/naming-convention */

@Injectable()
export class PrismaSearchRepository extends SearchRepositoryContract {
  private readonly quotes: string;
  private readonly authors: string;
  private readonly categories: string;
  private readonly userFavoriteQuotes: string;
  private readonly tagQuotes: string;

  public constructor(
    private readonly prisma: PrismaManagerService,
    configService: ConfigService
  ) {
    super();
    const s = configService.get<string>('DB_SCHEMA') || 'public';
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) {
      throw new Error(`Invalid DB_SCHEMA: ${s}`);
    }
    this.quotes = `"${s}"."quotes"`;
    this.authors = `"${s}"."authors"`;
    this.categories = `"${s}"."categories"`;
    this.userFavoriteQuotes = `"${s}"."user_favorite_quotes"`;
    this.tagQuotes = `"${s}"."tag_quotes"`;
  }

  public async searchQuotes(term: string, limit: number, userId?: bigint): Promise<QuoteSearchResult[]> {
    const client = this.prisma.getClient();
    const rows = await client.$queryRawUnsafe<QuoteRow[]>(
      `
      SELECT q.uuid, q.body, a.uuid as author_uuid, a.name as author_name,
             GREATEST(
               ts_rank(to_tsvector('portuguese', f_unaccent(q.body)), plainto_tsquery('portuguese', f_unaccent($1))),
               COALESCE(ts_rank(to_tsvector('portuguese', f_unaccent(a.name)), plainto_tsquery('portuguese', f_unaccent($1))), 0)
             ) as relevance,
             COALESCE(fav.cnt, 0) as favorites,
             COALESCE(tg.cnt, 0) as tags,
             ${userId ? `COALESCE(ufav.is_fav, false)` : 'false'} as favorited_by_user
      FROM ${this.quotes} q
      LEFT JOIN ${this.authors} a ON q."authorId" = a.id
      LEFT JOIN (SELECT "quoteId", COUNT(*) as cnt FROM ${this.userFavoriteQuotes} GROUP BY "quoteId") fav ON fav."quoteId" = q.id
      LEFT JOIN (SELECT "quoteId", COUNT(*) as cnt FROM ${this.tagQuotes} GROUP BY "quoteId") tg ON tg."quoteId" = q.id
      ${userId ? `LEFT JOIN (SELECT "quoteId", true as is_fav FROM ${this.userFavoriteQuotes} WHERE "userId" = $3) ufav ON ufav."quoteId" = q.id` : ''}
      WHERE to_tsvector('portuguese', f_unaccent(q.body)) @@ plainto_tsquery('portuguese', f_unaccent($1))
         OR to_tsvector('portuguese', f_unaccent(COALESCE(a.name, ''))) @@ plainto_tsquery('portuguese', f_unaccent($1))
      ORDER BY relevance DESC
      LIMIT $2
      `,
      ...(userId ? [term, limit, userId] : [term, limit])
    );

    return rows.map((row) => this.mapQuoteRow(row));
  }

  public async fuzzySearchQuotes(term: string, limit: number, userId?: bigint): Promise<QuoteSearchResult[]> {
    const client = this.prisma.getClient();
    const rows = await client.$queryRawUnsafe<QuoteRow[]>(
      `
      SELECT q.uuid, q.body, a.uuid as author_uuid, a.name as author_name,
             GREATEST(
               similarity(f_unaccent(q.body), f_unaccent($1)),
               COALESCE(similarity(f_unaccent(a.name), f_unaccent($1)), 0)
             ) as relevance,
             COALESCE(fav.cnt, 0) as favorites,
             COALESCE(tg.cnt, 0) as tags,
             ${userId ? `COALESCE(ufav.is_fav, false)` : 'false'} as favorited_by_user
      FROM ${this.quotes} q
      LEFT JOIN ${this.authors} a ON q."authorId" = a.id
      LEFT JOIN (SELECT "quoteId", COUNT(*) as cnt FROM ${this.userFavoriteQuotes} GROUP BY "quoteId") fav ON fav."quoteId" = q.id
      LEFT JOIN (SELECT "quoteId", COUNT(*) as cnt FROM ${this.tagQuotes} GROUP BY "quoteId") tg ON tg."quoteId" = q.id
      ${userId ? `LEFT JOIN (SELECT "quoteId", true as is_fav FROM ${this.userFavoriteQuotes} WHERE "userId" = $3) ufav ON ufav."quoteId" = q.id` : ''}
      WHERE similarity(f_unaccent(q.body), f_unaccent($1)) > 0.3
         OR similarity(f_unaccent(COALESCE(a.name, '')), f_unaccent($1)) > 0.3
      ORDER BY relevance DESC
      LIMIT $2
      `,
      ...(userId ? [term, limit, userId] : [term, limit])
    );

    return rows.map((row) => this.mapQuoteRow(row));
  }

  public async searchAuthors(term: string, limit: number): Promise<AuthorSearchResult[]> {
    const client = this.prisma.getClient();
    const rows = await client.$queryRawUnsafe<AuthorRow[]>(
      `
      SELECT uuid, name, bio,
             ts_rank(to_tsvector('portuguese', f_unaccent(name)), plainto_tsquery('portuguese', f_unaccent($1))) as relevance
      FROM ${this.authors}
      WHERE to_tsvector('portuguese', f_unaccent(name)) @@ plainto_tsquery('portuguese', f_unaccent($1))
      ORDER BY relevance DESC
      LIMIT $2
      `,
      term,
      limit
    );

    return rows.map((row) => this.mapAuthorRow(row));
  }

  public async fuzzySearchAuthors(term: string, limit: number): Promise<AuthorSearchResult[]> {
    const client = this.prisma.getClient();
    const rows = await client.$queryRawUnsafe<AuthorRow[]>(
      `
      SELECT uuid, name, bio,
             similarity(f_unaccent(name), f_unaccent($1)) as relevance
      FROM ${this.authors}
      WHERE similarity(f_unaccent(name), f_unaccent($1)) > 0.3
      ORDER BY relevance DESC
      LIMIT $2
      `,
      term,
      limit
    );

    return rows.map((row) => this.mapAuthorRow(row));
  }

  public async searchCategories(term: string, limit: number): Promise<CategorySearchResult[]> {
    const client = this.prisma.getClient();
    const rows = await client.$queryRawUnsafe<CategoryRow[]>(
      `
      SELECT uuid, title,
             ts_rank(to_tsvector('portuguese', f_unaccent(title)), plainto_tsquery('portuguese', f_unaccent($1))) as relevance
      FROM ${this.categories}
      WHERE to_tsvector('portuguese', f_unaccent(title)) @@ plainto_tsquery('portuguese', f_unaccent($1))
      ORDER BY relevance DESC
      LIMIT $2
      `,
      term,
      limit
    );

    return rows.map((row) => this.mapCategoryRow(row));
  }

  private mapQuoteRow(row: QuoteRow): QuoteSearchResult {
    return {
      uuid: row.uuid,
      body: row.body,
      author: row.author_uuid ? { uuid: row.author_uuid, name: row.author_name! } : null,
      metadata: {
        favorites: Number(row.favorites),
        tags: Number(row.tags),
        favoritedByUser: row.favorited_by_user,
      },
      relevance: Number(row.relevance),
    };
  }

  private mapAuthorRow(row: AuthorRow): AuthorSearchResult {
    return {
      uuid: row.uuid,
      name: row.name,
      bio: row.bio,
      relevance: Number(row.relevance),
    };
  }

  private mapCategoryRow(row: CategoryRow): CategorySearchResult {
    return {
      uuid: row.uuid,
      title: row.title,
      relevance: Number(row.relevance),
    };
  }
}
