import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { QuotePaginatedInput } from '@app/quote/dtos/quote-paginated-input';
import type { Quote } from '@app/quote/entities/quote.entity';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

export type QuoteWithMetadata = Quote & {
  metadata: {
    favorites: number;
    tags: number;
    favoritedByUser: boolean;
  };
};

@Injectable()
export class ListQuotePaginatedUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly authorRepository: AuthorRepositoryContract,
    private readonly tagRepository: TagRepositoryContract,
    private readonly categoryRepository: CategoryRepositoryContract
  ) {}

  public async handle(input: QuotePaginatedInput): Promise<PaginatedResult<QuoteWithMetadata>> {
    const { filters, paginate, user } = input;

    const [authorId, tagId, categoryId] = await Promise.all([
      filters?.authorUuid ? this.resolveEntityId(this.authorRepository, filters.authorUuid, 'Author') : undefined,
      filters?.tagUuid ? this.resolveEntityId(this.tagRepository, filters.tagUuid, 'Tag') : undefined,
      filters?.categoryUuid
        ? this.resolveEntityId(this.categoryRepository, filters.categoryUuid, 'Category')
        : undefined,
    ]);

    const search = filters?.search;
    const favoritedByUserId = filters?.favoritesOnly && user ? user.id : undefined;

    const result = await this.quoteRepository.findManyPaginated({
      where: { authorId, tagId, categoryId, search, favoritedByUserId },
      options: paginate,
    });

    return {
      ...result,
      data: await this.enrichWithMetadata(result.data, user),
    };
  }

  public async enrichWithMetadata(quotes: Quote[], user?: User): Promise<QuoteWithMetadata[]> {
    const quoteIds = quotes.map((q) => q.id);

    const [favoritesMap, tagsMap, favoritedSet] = await Promise.all([
      this.quoteRepository.countFavoritesBatch(quoteIds),
      this.quoteRepository.countTagsBatch(quoteIds),
      user ? this.quoteRepository.isFavoritedBatch({ quoteIds, userId: user.id }) : new Set<number>(),
    ]);

    return quotes.map((quote) => ({
      ...quote,
      metadata: {
        favorites: favoritesMap.get(quote.id) || 0,
        tags: tagsMap.get(quote.id) || 0,
        favoritedByUser: favoritedSet.has(quote.id),
      },
    }));
  }

  private async resolveEntityId(
    repo: { findUniqueOrThrow(input: { where: { uuid: string } }): Promise<{ id: number }> },
    uuid: string,
    entityName: string
  ): Promise<number> {
    try {
      const entity = await repo.findUniqueOrThrow({ where: { uuid } });
      return entity.id;
    } catch {
      throw new NotFoundException(`${entityName} not found`);
    }
  }
}
