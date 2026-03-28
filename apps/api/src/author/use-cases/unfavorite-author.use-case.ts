import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { UnfavoriteAuthorInput } from '@app/author/dtos/unfavorite-author-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnfavoriteAuthorUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: UnfavoriteAuthorInput): Promise<void> {
    const { authorUuid, user } = input;

    const author = await this.authorRepository.findUniqueOrThrow({
      where: {
        uuid: authorUuid,
      },
    });

    if (!(await this.authorRepository.isFavorited({ where: { authorId: author.id, userId: user.id } }))) {
      return;
    }

    await this.authorRepository.unfavorite({ data: { authorId: author.id, userId: user.id } });
  }
}
