import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { GetOneAuthorInput } from '@app/author/dtos/get-one-author-input';
import type { Author } from '@app/author/entities/author.entity';
import type { AuthorWithMetadata } from '@app/author/entities/author-with-metadata';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOneAuthorUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: GetOneAuthorInput): Promise<AuthorWithMetadata> {
    const { uuid, user } = input;

    const result = await this.authorRepository.findUniqueOrThrow({
      where: { uuid },
    });

    return this.enrichWithMetadata(result, user);
  }

  public async enrichWithMetadata(author: Author, user?: User): Promise<AuthorWithMetadata> {
    const [totalFavorites, totalQuotes, favoritedByUser] = await Promise.all([
      this.authorRepository.countFavorites(author.id),
      this.authorRepository.countQuotes(author.id),
      user ? this.authorRepository.isFavorited({ where: { authorId: author.id, userId: user.id } }) : false,
    ]);

    return { ...author, metadata: { totalQuotes, totalFavorites, favoritedByUser } };
  }
}
