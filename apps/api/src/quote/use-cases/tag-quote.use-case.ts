import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { TagQuoteInput } from '@app/quote/dtos/tag-quote-input';
import { QuoteService } from '@app/quote/services/quote.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TagQuoteUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly tagRepository: TagRepositoryContract,
    private readonly quoteService: QuoteService
  ) {}

  public async handle(input: TagQuoteInput): Promise<void> {
    const { tagUuid, quoteUuid, user } = input;

    const [tag, quote] = await Promise.all([
      this.tagRepository.findUniqueOrThrow({
        where: {
          uuid: tagUuid,
        },
      }),
      this.quoteRepository.findUniqueOrThrow({
        where: {
          uuid: quoteUuid,
        },
      }),
    ]);

    if (tag.userId !== user.id) {
      throw new ForbiddenException();
    }

    if (await this.quoteRepository.isTagged({ where: { quoteId: quote.id, tagId: tag.id } })) {
      return;
    }

    await this.quoteService.tag({ quoteId: quote.id, tagId: tag.id });
  }
}
