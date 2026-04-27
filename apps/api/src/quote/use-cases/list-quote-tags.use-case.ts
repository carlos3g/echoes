import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { ListQuoteTagsInput } from '@app/quote/dtos/list-quote-tags-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { Tag } from '@app/tag/entities/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListQuoteTagsUseCase implements UseCaseHandler {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public async handle(input: ListQuoteTagsInput): Promise<Tag[]> {
    const { quoteUuid, user } = input;

    const quote = await this.quoteRepository.findUniqueOrThrow({ where: { uuid: quoteUuid } });

    return this.quoteRepository.findTagsByQuoteAndUser({
      quoteId: quote.id,
      userId: user.id,
    });
  }
}
