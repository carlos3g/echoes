import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface ShareQuoteInput {
  quoteUuid: string;
  user: User;
  type: string;
  template?: string;
  platform?: string;
}

@Injectable()
export class ShareQuoteUseCase implements UseCaseHandler {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public async handle(input: ShareQuoteInput): Promise<void> {
    const { quoteUuid, user, type, template, platform } = input;

    const quote = await this.quoteRepository.findUniqueOrThrow({
      where: { uuid: quoteUuid },
    });

    await this.quoteRepository.share({
      data: { quoteId: quote.id, userId: user.id, type, template, platform },
    });
  }
}
