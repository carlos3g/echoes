import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
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
    private readonly tagRepository: TagRepositoryContract
  ) {}

  public async handle(input: QuotePaginatedInput): Promise<PaginatedResult<QuoteWithMetadata>> {
    const { filters, paginate, user } = input;

    const authorId = filters?.authorUuid ? await this.getAuthorId(filters.authorUuid) : undefined;
    const tagId = filters?.tagUuid ? await this.getTagId(filters.tagUuid) : undefined;

    const result = await this.quoteRepository.findManyPaginated({
      where: { authorId, tagId },
      options: paginate,
    });

    return {
      ...result,
      data: await this.enrichWithMetadata(result.data, user),
    };
  }

  public async enrichWithMetadata(quotes: Quote[], user?: User): Promise<QuoteWithMetadata[]> {
    const quotesWithMetadataPromises = quotes.map(async (quote) => {
      const [favorites, tags, favoritedByUser] = await Promise.all([
        this.quoteRepository.countFavorites(quote.id),
        this.quoteRepository.countTags(quote.id),
        user ? this.quoteRepository.isFavorited({ where: { quoteId: quote.id, userId: user.id } }) : false,
      ]);

      return { ...quote, metadata: { favorites, tags, favoritedByUser } };
    });

    return Promise.all(quotesWithMetadataPromises);
  }

  public async getAuthorId(uuid: string): Promise<number> {
    try {
      const author = await this.authorRepository.findUniqueOrThrow({
        where: { uuid },
      });

      return author.id;
    } catch {
      throw new NotFoundException('Author not found');
    }
  }

  public async getTagId(uuid: string): Promise<number> {
    try {
      const tag = await this.tagRepository.findUniqueOrThrow({
        where: { uuid },
      });

      return tag.id;
    } catch {
      throw new NotFoundException('Tag not found');
    }
  }
}
