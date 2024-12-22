import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorService {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public favorite(args: { userId: number; authorId: number }): Promise<void> {
    return this.authorRepository.favorite({ data: args });
  }

  public tag(args: { authorId: number; tagId: number }): Promise<void> {
    return this.authorRepository.tag({ data: args });
  }

  public untag(args: { authorId: number; tagId: number }): Promise<void> {
    return this.authorRepository.untag({ data: args });
  }
}
