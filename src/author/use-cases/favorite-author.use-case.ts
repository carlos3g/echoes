import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { FavoriteAuthorInput } from '@app/author/dtos/favorite-author-input';
import { AuthorService } from '@app/author/services/author.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteAuthorUseCase implements UseCaseHandler {
  public constructor(
    private readonly authorRepository: AuthorRepositoryContract,
    private readonly authorService: AuthorService
  ) {}

  public async handle(input: FavoriteAuthorInput): Promise<void> {
    const { authorUuid, user } = input;

    const author = await this.authorRepository.findUniqueOrThrow({
      where: {
        uuid: authorUuid,
      },
    });

    return this.authorService.favorite({ authorId: author.id, userId: user.id });
  }
}
