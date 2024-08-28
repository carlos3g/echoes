import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { FavoriteQuoteInput } from '@app/quote/dtos/favorite-quote-input';
import { QuoteService } from '@app/quote/services/quote.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteQuoteUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly quoteService: QuoteService
  ) {}

  public async handle(input: FavoriteQuoteInput): Promise<void> {
    const { quoteUuid, user } = input;

    const quote = await this.quoteRepository.findUniqueOrThrow({
      where: {
        uuid: quoteUuid,
      },
    });

    return this.quoteService.favorite({ quoteId: quote.id, userId: user.id });
  }
}
