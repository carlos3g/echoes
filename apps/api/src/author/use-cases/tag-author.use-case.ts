import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { TagAuthorInput } from '@app/author/dtos/tag-author-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TagAuthorUseCase implements UseCaseHandler {
  public constructor(
    private readonly authorRepository: AuthorRepositoryContract,
    private readonly tagRepository: TagRepositoryContract
  ) {}

  public async handle(input: TagAuthorInput): Promise<void> {
    const { tagUuid, authorUuid, user } = input;

    const tag = await this.tagRepository.findUniqueOrThrow({
      where: {
        uuid: tagUuid,
      },
    });

    const author = await this.authorRepository.findUniqueOrThrow({
      where: {
        uuid: authorUuid,
      },
    });

    if (tag.userId !== user.id) {
      throw new ForbiddenException();
    }

    if (await this.authorRepository.isTagged({ where: { authorId: author.id, tagId: tag.id } })) {
      return;
    }

    await this.authorRepository.tag({ data: { authorId: author.id, tagId: tag.id } });
  }
}
