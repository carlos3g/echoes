import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { IsQuoteTaggedInput } from '@app/quote/dtos/is-quote-tagged-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class IsQuoteTaggedUseCase implements UseCaseHandler {
  public constructor(
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly tagRepository: TagRepositoryContract
  ) {}

  public async handle(input: IsQuoteTaggedInput): Promise<{ exists: boolean }> {
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

    const exists = await this.quoteRepository.isTagged({ where: { quoteId: quote.id, tagId: tag.id } });

    return { exists };
  }
}
