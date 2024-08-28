import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteService {
  public favorite(args: { userId: number; quoteId: number }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public tag(args: { quoteId: number; tagId: number; userId: number }): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
