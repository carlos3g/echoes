import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { DeleteTagInput } from '@app/tag/dtos/delete-tag-input';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteTagUseCase implements UseCaseHandler {
  public constructor(private readonly tagRepository: TagRepositoryContract) {}

  public async handle(input: DeleteTagInput): Promise<void> {
    const { uuid, user } = input;

    const tag = await this.tagRepository.findUniqueOrThrow({ where: { uuid } });

    if (tag.userId !== user.id) {
      throw new ForbiddenException();
    }

    await this.tagRepository.delete({ where: { uuid } });
  }
}
