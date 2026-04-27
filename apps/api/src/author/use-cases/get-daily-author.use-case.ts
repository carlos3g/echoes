import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { Author } from '@app/author/entities/author.entity';
import type { AuthorWithMetadata } from '@app/author/entities/author-with-metadata';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

interface GetDailyAuthorInput {
  user?: User;
}

@Injectable()
export class GetDailyAuthorUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: GetDailyAuthorInput): Promise<AuthorWithMetadata | null> {
    const totalAuthors = await this.authorRepository.count();

    if (totalAuthors === 0) {
      return null;
    }

    const today = new Date().toISOString().slice(0, 10);
    const dayHash = this.hashString(today);
    const authorIndex = dayHash % totalAuthors;

    const result = await this.authorRepository.findManyPaginated({
      where: {},
      options: { page: authorIndex + 1, perPage: 1 },
    });

    const author = result.data[0];

    if (!author) {
      return null;
    }

    return this.enrichWithMetadata(author, input.user);
  }

  private async enrichWithMetadata(author: Author, user?: User): Promise<AuthorWithMetadata> {
    const [totalFavorites, totalQuotes, favoritedByUser] = await Promise.all([
      this.authorRepository.countFavorites(author.id),
      this.authorRepository.countQuotes(author.id),
      user ? this.authorRepository.isFavorited({ where: { authorId: author.id, userId: user.id } }) : false,
    ]);

    return { ...author, metadata: { totalQuotes, totalFavorites, favoritedByUser } };
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
  }
}
