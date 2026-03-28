import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { UntagQuoteInput } from '@app/quote/dtos/untag-quote-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UntagQuoteUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly tagRepository: TagRepositoryContract
  ) {}

  public async handle(input: UntagQuoteInput): Promise<void> {
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

    if (!(await this.quoteRepository.isTagged({ where: { quoteId: quote.id, tagId: tag.id } }))) {
      return;
    }

    await this.quoteRepository.untag({ data: { quoteId: quote.id, tagId: tag.id } });
  }
}
