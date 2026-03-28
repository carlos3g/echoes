import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaQuoteToQuoteAdapter } from '@app/quote/adapters';
import type { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type {
  QuoteRepositoryCreateInput,
  QuoteRepositoryDeleteInput,
  QuoteRepositoryFavoriteInput,
  QuoteRepositoryFindManyByTagInput,
  QuoteRepositoryFindManyFavoritedByUserInput,
  QuoteRepositoryFindManyInput,
  QuoteRepositoryFindManyPaginatedInput,
  QuoteRepositoryFindUniqueOrThrowInput,
  QuoteRepositoryIsFavoritedInput,
  QuoteRepositoryIsTaggedInput,
  QuoteRepositoryTagInput,
  QuoteRepositoryUnfavoriteInput,
  QuoteRepositoryUntagInput,
  QuoteRepositoryUpdateInput,
} from '@app/quote/dtos/quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';
import { Injectable } from '@nestjs/common';
import type { Quote as PrismaQuote } from '@generated/prisma/client';

type FindManyReturn = PrismaQuote;

@Injectable()
export class PrismaQuoteRepository implements QuoteRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: QuoteRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().quote.findUniqueOrThrow({
      where: input.where,
      include: {
        author: true,
      },
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async findManyPaginated(input: QuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>> {
    const { tagId, categoryId, search, favoritedByUserId, ...where } = input.where || {};
    const { perPage = 20, page = 1 } = input.options || {};

    const searchFilter = search
      ? {
          OR: [
            { body: { contains: search, mode: 'insensitive' as const } },
            { author: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const result = await paginate<FindManyReturn, 'Quote'>(
      this.prismaManager.getClient().quote,
      {
        where: {
          ...where,
          ...searchFilter,
          tags: tagId ? { some: { tagId } } : undefined,
          categories: categoryId ? { some: { id: categoryId } } : undefined,
          favoritedBy: favoritedByUserId ? { some: { userId: favoritedByUserId } } : undefined,
        },
        include: { author: true },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaQuoteToQuoteAdapter),
    };
  }

  public async findMany(input?: QuoteRepositoryFindManyInput): Promise<Quote[]> {
    const where = input?.where || {};

    const entities = await this.prismaManager.getClient().quote.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaQuoteToQuoteAdapter);
  }

  public async findManyFavoritedByUser(input: QuoteRepositoryFindManyFavoritedByUserInput): Promise<Quote[]> {
    const entities = await this.prismaManager.getClient().quote.findMany({
      where: {
        favoritedBy: {
          some: {
            userId: input.where.userId,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaQuoteToQuoteAdapter);
  }

  public async findManyByTag(input: QuoteRepositoryFindManyByTagInput): Promise<Quote[]> {
    const entities = await this.prismaManager.getClient().quote.findMany({
      where: {
        tags: {
          some: {
            tagId: input.where.tagId,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaQuoteToQuoteAdapter);
  }

  public async isTagged(input: QuoteRepositoryIsTaggedInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().tagQuote.count({
      where: input.where,
    });

    return count > 0;
  }

  public async favorite(input: QuoteRepositoryFavoriteInput): Promise<void> {
    await this.prismaManager.getClient().userFavoriteQuote.create({ data: input.data });
  }

  public async unfavorite(input: QuoteRepositoryUnfavoriteInput): Promise<void> {
    await this.prismaManager.getClient().userFavoriteQuote.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userId_quoteId: input.data,
      },
    });
  }

  public countFavorites(quoteId: number): Promise<number> {
    return this.prismaManager.getClient().userFavoriteQuote.count({
      where: {
        quoteId,
      },
    });
  }

  public countTags(quoteId: number): Promise<number> {
    return this.prismaManager.getClient().tagQuote.count({
      where: {
        quoteId,
      },
    });
  }

  public async isFavorited(input: QuoteRepositoryIsFavoritedInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().userFavoriteQuote.count({
      where: input.where,
    });

    return count > 0;
  }

  public async tag(input: QuoteRepositoryTagInput): Promise<void> {
    await this.prismaManager.getClient().tagQuote.create({ data: input.data });
  }

  public async untag(input: QuoteRepositoryUntagInput): Promise<void> {
    await this.prismaManager.getClient().tagQuote.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        tagId_quoteId: input.data,
      },
    });
  }

  public async countFavoritesBatch(quoteIds: number[]): Promise<Map<number, number>> {
    const results = await this.prismaManager.getClient().userFavoriteQuote.groupBy({
      by: ['quoteId'],
      where: { quoteId: { in: quoteIds } },
      _count: { quoteId: true },
    });
    const map = new Map<number, number>();
    for (const r of results) {
      map.set(Number(r.quoteId), r._count.quoteId);
    }
    return map;
  }

  public async countTagsBatch(quoteIds: number[]): Promise<Map<number, number>> {
    const results = await this.prismaManager.getClient().tagQuote.groupBy({
      by: ['quoteId'],
      where: { quoteId: { in: quoteIds } },
      _count: { quoteId: true },
    });
    const map = new Map<number, number>();
    for (const r of results) {
      map.set(Number(r.quoteId), r._count.quoteId);
    }
    return map;
  }

  public async isFavoritedBatch(input: { quoteIds: number[]; userId: number }): Promise<Set<number>> {
    const results = await this.prismaManager.getClient().userFavoriteQuote.findMany({
      where: {
        quoteId: { in: input.quoteIds },
        userId: input.userId,
      },
      select: { quoteId: true },
    });
    return new Set(results.map((r) => Number(r.quoteId)));
  }

  public async create(input: QuoteRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().quote.create({
      data: input,
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async update(input: QuoteRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().quote.update({
      where: input.where,
      data: input.data,
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async delete(input: QuoteRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().quote.delete({ where });
  }
}
