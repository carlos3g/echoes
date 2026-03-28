import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { UnfavoriteQuoteInput } from '@app/quote/dtos/unfavorite-quote-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnfavoriteQuoteUseCase implements UseCaseHandler {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public async handle(input: UnfavoriteQuoteInput): Promise<void> {
    const { quoteUuid, user } = input;

    const quote = await this.quoteRepository.findUniqueOrThrow({
      where: {
        uuid: quoteUuid,
      },
    });

    if (!(await this.quoteRepository.isFavorited({ where: { quoteId: quote.id, userId: user.id } }))) {
      return;
    }

    await this.quoteRepository.unfavorite({ data: { quoteId: quote.id, userId: user.id } });
  }
}
