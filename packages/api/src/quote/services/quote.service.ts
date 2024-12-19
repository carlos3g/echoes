import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteService {
  public constructor(private readonly quoteRepository: QuoteRepositoryContract) {}

  public favorite(args: { userId: number; quoteId: number }): Promise<void> {
    return this.quoteRepository.favorite({ data: args });
  }

  public tag(args: { quoteId: number; tagId: number }): Promise<void> {
    return this.quoteRepository.tag({ data: args });
  }
}
