import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { UnfavoriteAuthorInput } from '@app/author/dtos/unfavorite-author-input';
import { AuthorService } from '@app/author/services/author.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnfavoriteAuthorUseCase implements UseCaseHandler {
  public constructor(
    private readonly authorRepository: AuthorRepositoryContract,
    private readonly authorService: AuthorService
  ) {}

  public async handle(input: UnfavoriteAuthorInput): Promise<void> {
    const { authorUuid, user } = input;

    const author = await this.authorRepository.findUniqueOrThrow({
      where: {
        uuid: authorUuid,
      },
    });

    await this.authorService.unfavorite({ authorId: author.id, userId: user.id });
  }
}
