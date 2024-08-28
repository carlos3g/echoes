import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorService {
  public favorite(args: { userId: number; authorId: number }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public tag(args: { authorId: number; tagId: number; userId: number }): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
