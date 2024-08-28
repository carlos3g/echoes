import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { TagQuoteInput } from '@app/quote/dtos/tag-quote-input';
import { QuoteService } from '@app/quote/services/quote.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagQuoteUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly tagRepository: TagRepositoryContract,
    private readonly quoteService: QuoteService
  ) {}

  public async handle(input: TagQuoteInput): Promise<void> {
    const { tagUuid, quoteUuid, user } = input;

    const tag = await this.tagRepository.findUniqueOrThrow({
      where: {
        uuid: tagUuid,
      },
    });

    const quote = await this.quoteRepository.findUniqueOrThrow({
      where: {
        uuid: quoteUuid,
      },
    });

    return this.quoteService.tag({ quoteId: quote.id, tagId: tag.id, userId: user.id });
  }
}
