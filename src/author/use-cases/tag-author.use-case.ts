import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { TagAuthorInput } from '@app/author/dtos/tag-author-input';
import { AuthorService } from '@app/author/services/author.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagAuthorUseCase implements UseCaseHandler {
  public constructor(
    private readonly authorRepository: AuthorRepositoryContract,
    private readonly tagRepository: TagRepositoryContract,
    private readonly authorService: AuthorService
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

    return this.authorService.tag({ authorId: author.id, tagId: tag.id, userId: user.id });
  }
}
