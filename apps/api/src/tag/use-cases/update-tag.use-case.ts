import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { UpdateTagInput } from '@app/tag/dtos/update-tag-input';
import type { Tag } from '@app/tag/entities/tag.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateTagUseCase implements UseCaseHandler {
  public constructor(private readonly tagRepository: TagRepositoryContract) {}

  public async handle(input: UpdateTagInput): Promise<Tag> {
    const { uuid, title, user } = input;

    const tag = await this.tagRepository.findUniqueOrThrow({ where: { uuid } });

    if (tag.userId !== user.id) {
      throw new ForbiddenException();
    }

    return this.tagRepository.update({
      where: { uuid },
      data: { title },
    });
  }
}
