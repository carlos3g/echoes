import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { GetOneQuoteInput } from '@app/quote/dtos/get-one-quote-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOneQuoteUseCase implements UseCaseHandler {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public async handle(input: GetOneQuoteInput): Promise<unknown> {
    const { uuid } = input;

    const result = await this.quoteRepository.findUniqueOrThrow({
      where: { uuid },
    });

    return result;
  }
}
