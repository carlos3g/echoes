import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { AuthorPaginatedInput } from '@app/author/dtos/author-paginated-input';
import type { Author } from '@app/author/entities/author.entity';
import type { AuthorWithMetadata } from '@app/author/entities/author-with-metadata';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAuthorPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: AuthorPaginatedInput): Promise<PaginatedResult<AuthorWithMetadata>> {
    const { filters, paginate, user } = input;

    const result = await this.authorRepository.findManyPaginated({
      where: filters,
      options: paginate,
    });

    return {
      ...result,
      data: await this.enrichWithMetadata(result.data, user),
    };
  }

  public async enrichWithMetadata(authors: Author[], user?: User): Promise<AuthorWithMetadata[]> {
    const authorIds = authors.map((a) => a.id);

    const [favoritesMap, quotesMap, favoritedSet] = await Promise.all([
      this.authorRepository.countFavoritesBatch(authorIds),
      this.authorRepository.countQuotesBatch(authorIds),
      user ? this.authorRepository.isFavoritedBatch({ authorIds, userId: user.id }) : new Set<number>(),
    ]);

    return authors.map((author) => ({
      ...author,
      metadata: {
        totalQuotes: quotesMap.get(author.id) || 0,
        totalFavorites: favoritesMap.get(author.id) || 0,
        favoritedByUser: favoritedSet.has(author.id),
      },
    }));
  }
}
