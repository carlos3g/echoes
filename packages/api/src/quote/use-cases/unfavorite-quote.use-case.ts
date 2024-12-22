import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { UnfavoriteQuoteInput } from '@app/quote/dtos/unfavorite-quote-input';
import { QuoteService } from '@app/quote/services/quote.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnfavoriteQuoteUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly quoteService: QuoteService
  ) {}

  public async handle(input: UnfavoriteQuoteInput): Promise<void> {
    const { quoteUuid, user } = input;

    const quote = await this.quoteRepository.findUniqueOrThrow({
      where: {
        uuid: quoteUuid,
      },
    });

    await this.quoteService.unfavorite({ quoteId: quote.id, userId: user.id });
  }
}
