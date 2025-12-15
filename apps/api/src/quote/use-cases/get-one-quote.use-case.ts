import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { GetOneQuoteInput } from '@app/quote/dtos/get-one-quote-input';
import type { Quote } from '@app/quote/entities/quote.entity';
import type { QuoteWithMetadata } from '@app/quote/use-cases/list-quote-paginated.use-case';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOneQuoteUseCase implements UseCaseHandler {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public async handle(input: GetOneQuoteInput): Promise<QuoteWithMetadata> {
    const { uuid, user } = input;

    const result = await this.quoteRepository.findUniqueOrThrow({
      where: { uuid },
    });

    return this.enrichWithMetadata(result, user);
  }

  public async enrichWithMetadata(quote: Quote, user?: User): Promise<QuoteWithMetadata> {
    const [favorites, tags, favoritedByUser] = await Promise.all([
      this.quoteRepository.countFavorites(quote.id),
      this.quoteRepository.countTags(quote.id),
      user ? this.quoteRepository.isFavorited({ where: { quoteId: quote.id, userId: user.id } }) : false,
    ]);

    return { ...quote, metadata: { favorites, tags, favoritedByUser } };
  }
}
