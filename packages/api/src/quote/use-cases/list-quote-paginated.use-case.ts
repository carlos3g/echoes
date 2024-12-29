import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { QuotePaginatedInput } from '@app/quote/dtos/quote-paginated-input';
import type { Quote } from '@app/quote/entities/quote.entity';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

type QuoteWithMetadata = Quote & {
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
    private readonly authorRepository: AuthorRepositoryContract
  ) {}

  public async handle(input: QuotePaginatedInput): Promise<PaginatedResult<QuoteWithMetadata>> {
    const { filters, paginate } = input;

    const authorId = filters?.authorUuid ? await this.getAuthorId(filters.authorUuid) : undefined;

    const result = await this.quoteRepository.findManyPaginated({
      where: { authorId },
      options: paginate,
    });

    return {
      ...result,
      data: await this.enrichWithMetadata(result.data),
    };
  }

  public async enrichWithMetadata(quotes: Quote[]): Promise<QuoteWithMetadata[]> {
    const quotesWithMetadataPromises = quotes.map(async (quote) => {
      const [favorites, tags, favoritedByUser] = await Promise.all([
        this.quoteRepository.countFavorites(quote.id),
        this.quoteRepository.countTags(quote.id),
        this.quoteRepository.isFavorited({ where: { quoteId: quote.id, userId: 1 } }),
      ]);

      return { ...quote, metadata: { favorites, tags, favoritedByUser } };
    });

    return Promise.all(quotesWithMetadataPromises);
  }

  public async getAuthorId(uuid: string): Promise<number> {
    const author = await this.authorRepository.findUniqueOrThrow({
      where: { uuid },
    });

    return author.id;
  }
}
